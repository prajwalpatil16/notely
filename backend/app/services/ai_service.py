import os
import json
from concurrent.futures import ThreadPoolExecutor
from google import genai
from app.models import db, Note, NoteLink

# Global ThreadPoolExecutor for background AI calls (fixes main thread blocking)
ai_executor = ThreadPoolExecutor(max_workers=5)

class AIService:
    def __init__(self):
        self._client = None

    @property
    def client(self):
        if self._client is None:
            api_key = os.environ.get("GEMINI_API_KEY", "")
            if api_key:
                self._client = genai.Client(api_key=api_key)
        return self._client

    def summarize_note(self, content: str) -> str:
        def task():
            if not self.client:
                return "AI service is not configured. Please add GEMINI_API_KEY to your environment."
            prompt = f"Please summarize the following note content in a concise manner:\n\n{content}"
            try:
                response = self.client.models.generate_content(
                    model='gemini-1.5-flash',
                    contents=prompt
                )
                return response.text or "No summary generated."
            except Exception as e:
                return f"Error in AI summarization: {str(e)}"

        future = ai_executor.submit(task)
        return future.result()

    def suggest_tags(self, content: str) -> list:
        def task():
            if not self.client:
                return []
            prompt = (
                "Based on the following note content, suggest 3-5 relevant short tags. "
                "Return only the tags as a comma-separated list without markdown or extra text:\n\n"
                f"{content}"
            )
            try:
                response = self.client.models.generate_content(
                    model='gemini-1.5-flash',
                    contents=prompt
                )
                text = response.text or ""
                tags = [tag.strip() for tag in text.split(',') if tag.strip()]
                return tags
            except Exception as e:
                return []

        future = ai_executor.submit(task)
        return future.result()

    def improve_content(self, content: str) -> str:
        def task():
            if not self.client:
                return content
            prompt = (
                "Please refine and improve the writing of the following note content for "
                "better clarity and a professional yet natural tone, while keeping the original meaning:\n\n"
                f"{content}"
            )
            try:
                response = self.client.models.generate_content(
                    model='gemini-1.5-flash',
                    contents=prompt
                )
                return response.text or content
            except Exception as e:
                return content

        future = ai_executor.submit(task)
        return future.result()

    def generate_chat_response(self, user_id: int, query: str, chat_history: list) -> tuple:
        """
        Processes conversation, performs basic RAG across user's notes,
        and returns a tuple of (response_text, list_of_cited_note_ids).
        """
        def task():
            if not self.client:
                return "AI service is not configured. Please add GEMINI_API_KEY to your environment.", []

            # 1. Fetch all user notes to match query keywords
            notes = Note.query.filter_by(owner_id=user_id, is_archived=False).all()
            
            # Simple term-overlap score for RAG candidates selection
            query_words = set(query.lower().split())
            matched_notes = []
            for note in notes:
                score = 0
                title_lower = (note.title or "").lower()
                content_lower = (note.content or "").lower()
                for word in query_words:
                    if len(word) > 2:  # Skip short stop-words
                        if word in title_lower:
                            score += 5
                        if word in content_lower:
                            score += 1
                if score > 0:
                    matched_notes.append((score, note))

            # Sort by highest score first and slice top 5
            matched_notes.sort(key=lambda x: x[0], reverse=True)
            top_notes = [n for score, n in matched_notes[:5]]

            # 2. Build context blocks and tracks citations
            context_blocks = []
            cited_ids = []
            for n in top_notes:
                context_blocks.append(
                    f"Note ID: {n.id}\nNote Title: {n.title}\nNote Content: {n.content}\n---"
                )
                cited_ids.append(n.id)

            notes_context = "\n".join(context_blocks) if context_blocks else "No matching notes found."

            # 3. Format chat history
            formatted_history = []
            for msg in chat_history[-6:]:  # Inject last 6 exchanges
                role_label = "User" if msg["role"] == "user" else "Assistant"
                formatted_history.append(f"{role_label}: {msg['content']}")
            
            history_context = "\n".join(formatted_history)

            prompt = (
                "You are the Notely AI Knowledge Companion. You assist users in querying and summarizing their notes.\n"
                "Here is the context containing the user's relevant notes:\n"
                f"{notes_context}\n\n"
                "Here is the recent conversation history:\n"
                f"{history_context}\n\n"
                f"User's new message: {query}\n\n"
                "Instructions:\n"
                "1. Answer the query based ONLY on the provided notes context.\n"
                "2. If the answer is not available in the context, explicitly say that you do not have any notes matching that query.\n"
                "3. Keep the response helpful, clear, and highly focused.\n"
                "4. Do NOT write Note IDs (e.g. Note 123) in your final text answer. The interface will render citations separately."
            )

            try:
                response = self.client.models.generate_content(
                    model='gemini-1.5-flash',
                    contents=prompt
                )
                return response.text or "I was unable to formulate a response.", cited_ids
            except Exception as e:
                return f"Error communicating with AI model: {str(e)}", []

        future = ai_executor.submit(task)
        return future.result()

    def suggest_related_notes(self, user_id: int, target_note_id: int) -> list:
        def task():
            if not self.client:
                return []

            target_note = Note.query.filter_by(id=target_note_id, owner_id=user_id).first()
            if not target_note:
                return []

            other_notes = Note.query.filter(
                Note.id != target_note_id,
                Note.owner_id == user_id,
                Note.is_archived == False
            ).all()
            if not other_notes:
                return []

            # Restrict context size by choosing top 15 candidate notes
            candidates = other_notes[:15]
            candidates_data = [{"id": n.id, "title": n.title, "snippet": (n.content or "")[:150]} for n in candidates]

            prompt = (
                "We are building a connected knowledge map. Find links between this source note and candidates.\n"
                f"Source Note ID: {target_note.id}\n"
                f"Source Note Title: {target_note.title}\n"
                f"Source Note Content: {target_note.content}\n\n"
                "Other Candidate Notes:\n"
                f"{str(candidates_data)}\n\n"
                "Determine which candidate notes are relevant or topically related to the source note.\n"
                "Return a JSON list of objects containing 'note_id' (integer) and 'reason' (short string text explaining the connection).\n"
                "Only connect notes that have a genuine link. Output ONLY the raw JSON array (enclosed in brackets)."
            )

            try:
                response = self.client.models.generate_content(
                    model='gemini-1.5-flash',
                    contents=prompt
                )
                text = response.text or "[]"
                # Strip markdown JSON blocks if present
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0].strip()
                elif "```" in text:
                    text = text.split("```")[1].split("```")[0].strip()
                
                suggestions = json.loads(text)
                candidate_ids = {c.id for c in candidates}
                valid_suggestions = []
                
                for s in suggestions:
                    n_id = s.get("note_id")
                    if n_id in candidate_ids:
                        valid_suggestions.append({
                            "note_id": n_id,
                            "reason": s.get("reason", "Topically related")
                        })
                return valid_suggestions
            except Exception as e:
                print("Error calculating suggested connections:", e)
                return []

        future = ai_executor.submit(task)
        return future.result()

ai_service = AIService()
