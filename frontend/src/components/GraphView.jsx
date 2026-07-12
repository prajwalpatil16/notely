import React, { useState, useEffect, useRef } from 'react';
import { useNotes, useNoteLinks, useCreateNoteLink, useDeleteNoteLink } from '../hooks/useNotes';
import { getRelatedSuggestions } from '../api/ai';
import EmptyStateIllustration from './EmptyStateIllustration';
import * as Icons from './Icons';
import { useUIStore } from '../store/uiStore';

export default function GraphView({ onSelectNote }) {
  const addToast = useUIStore(state => state.addToast);
  const { data: notes } = useNotes();
  const { data: links } = useNoteLinks();
  const createLinkMut = useCreateNoteLink();
  const deleteLinkMut = useDeleteNoteLink();

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [linkSourceId, setLinkSourceId] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [suggestingForNoteId, setSuggestingForNoteId] = useState(null);

  const containerRef = useRef(null);
  const simulationRef = useRef(null);
  const draggingNodeRef = useRef(null);

  const selectedNode = notes?.find(n => n.id === selectedNodeId);

  // Sync notes and links with local physics states
  useEffect(() => {
    if (!notes) return;

    setNodes(prevNodes => {
      const nodeMap = new Map(prevNodes.map(n => [n.id, n]));
      return notes.map(note => {
        const existing = nodeMap.get(note.id);
        const r = note.is_pinned ? 18 : 14;
        return {
          id: note.id,
          title: note.title,
          content: note.content,
          is_pinned: note.is_pinned,
          r,
          x: existing?.x ?? (100 + Math.random() * 300),
          y: existing?.y ?? (100 + Math.random() * 200),
          vx: existing?.vx ?? 0,
          vy: existing?.vy ?? 0
        };
      });
    });
  }, [notes]);

  useEffect(() => {
    if (links) {
      setEdges(links);
    }
  }, [links]);

  // Verlet spring simulation physics
  useEffect(() => {
    if (nodes.length === 0) return;

    const step = () => {
      const width = containerRef.current?.clientWidth || 600;
      const height = containerRef.current?.clientHeight || 400;

      setNodes(prevNodes => {
        const forces = prevNodes.map(() => ({ fx: 0, fy: 0 }));

        // 1. Repulsion between nodes
        for (let i = 0; i < prevNodes.length; i++) {
          for (let j = i + 1; j < prevNodes.length; j++) {
            const u = prevNodes[i];
            const v = prevNodes[j];
            const dx = v.x - u.x;
            const dy = v.y - u.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const minDist = u.r + v.r + 65;

            if (dist < minDist) {
              const overlap = minDist - dist;
              const force = (overlap / minDist) * 0.75;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;

              if (draggingNodeRef.current !== u.id) {
                forces[i].fx -= fx;
                forces[i].fy -= fy;
              }
              if (draggingNodeRef.current !== v.id) {
                forces[j].fx += fx;
                forces[j].fy += fy;
              }
            }
          }
        }

        // 2. Attraction along edges
        edges.forEach(edge => {
          const uIdx = prevNodes.findIndex(n => n.id === edge.source_note_id);
          const vIdx = prevNodes.findIndex(n => n.id === edge.target_note_id);
          if (uIdx === -1 || vIdx === -1) return;

          const u = prevNodes[uIdx];
          const v = prevNodes[vIdx];
          const dx = v.x - u.x;
          const dy = v.y - u.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = 110;
          const k = 0.035; // spring stiffness

          const force = (dist - targetDist) * k;
          const fux = (dx / dist) * force;
          const fuy = (dy / dist) * force;

          if (draggingNodeRef.current !== u.id && uIdx !== -1) {
            forces[uIdx].fx -= fux;
            forces[uIdx].fy -= fuy;
          }
          if (draggingNodeRef.current !== v.id && vIdx !== -1) {
            forces[vIdx].fx += fux;
            forces[vIdx].fy += fuy;
          }
        });

        // 3. Integrate positions
        return prevNodes.map((node, idx) => {
          if (draggingNodeRef.current === node.id) return node;
          const f = forces[idx];
          const vx = (node.vx + f.fx) * 0.85; 
          const vy = (node.vy + f.fy) * 0.85;

          let x = node.x + vx;
          let y = node.y + vy;

          // Border containment
          if (x < 30) x = 30;
          if (x > width - 30) x = width - 30;
          if (y < 30) y = 30;
          if (y > height - 30) y = height - 30;

          return { ...node, x, y, vx, vy };
        });
      });

      simulationRef.current = requestAnimationFrame(step);
    };

    simulationRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(simulationRef.current);
  }, [nodes.length, edges]);

  const handleMouseDown = (e, nodeId) => {
    e.stopPropagation();
    draggingNodeRef.current = nodeId;
  };

  const handleMouseMove = (e) => {
    if (draggingNodeRef.current === null || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes(prev => prev.map(node => {
      if (node.id === draggingNodeRef.current) {
        return { ...node, x, y, vx: 0, vy: 0 };
      }
      return node;
    }));
  };

  const handleMouseUp = () => {
    draggingNodeRef.current = null;
  };

  const handleNodeClick = (e, node) => {
    e.stopPropagation();
    setSelectedNodeId(node.id);

    if (linkSourceId !== null) {
      if (linkSourceId !== node.id) {
        createLinkMut.mutate({
          source_note_id: linkSourceId,
          target_note_id: node.id,
          relation_type: 'manual'
        });
      }
      setLinkSourceId(null);
    }
  };

  const startManualLink = () => {
    setLinkSourceId(selectedNodeId);
  };

  const fetchAISuggestions = async () => {
    if (!selectedNodeId) return;
    setIsAiLoading(true);
    setSuggestingForNoteId(selectedNodeId);
    try {
      const res = await getRelatedSuggestions(selectedNodeId);
      setAiSuggestions(res.data.suggestions || []);
    } catch (err) {
      addToast("Failed to fetch suggestions: " + err.message, "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  const acceptAISuggestion = (suggestedId) => {
    createLinkMut.mutate({
      source_note_id: selectedNodeId,
      target_note_id: suggestedId,
      relation_type: 'ai_suggested'
    });
    setAiSuggestions(aiSuggestions.filter(s => s.note_id !== suggestedId));
  };

  const handleDeleteLink = (linkId) => {
    if (confirm("Disconnect these notes?")) {
      deleteLinkMut.mutate(linkId);
    }
  };

  return (
    <div className="card flex flex-col p-6 h-[460px] border border-slate-100/80 bg-white">
      <div className="flex justify-between items-center mb-4 select-none">
        <div>
          <h3 className="font-display font-black text-sm text-dark">Knowledge Map</h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Visualize connections and themes</p>
        </div>
        {linkSourceId && (
          <div className="px-3 py-1 bg-primary/10 border border-primary/20 text-[10px] text-primary font-black uppercase tracking-wider rounded-lg animate-pulse">
            Connecting... click target note
          </div>
        )}
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* SVG Physics Canvas */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex-1 bg-slate-50/50 rounded-2xl relative border border-slate-100/50 overflow-hidden"
        >
          {nodes.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-xs font-bold gap-3 p-8">
              <EmptyStateIllustration className="w-16 h-16 opacity-50" />
              <span>No notes on the canvas yet.</span>
            </div>
          ) : (
            <svg className="w-full h-full">
              {/* Glowing effects for premium visuals */}
              <defs>
                <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Edge links */}
              {edges.map(edge => {
                const u = nodes.find(n => n.id === edge.source_note_id);
                const v = nodes.find(n => n.id === edge.target_note_id);
                if (!u || !v) return null;
                const isAi = edge.relation_type === 'ai_suggested';
                return (
                  <line 
                    key={edge.id}
                    x1={u.x} y1={u.y} x2={v.x} y2={v.y} 
                    onClick={(e) => { e.stopPropagation(); handleDeleteLink(edge.id); }}
                    className={`stroke-2 cursor-pointer transition-all duration-200 ${
                      isAi 
                        ? 'stroke-companion/40 edge-flow hover:stroke-red-500' 
                        : 'stroke-slate-200/70 hover:stroke-red-500'
                    }`}
                    strokeWidth={isAi ? "2" : "1.5"}
                  />
                );
              })}

              {/* Note nodes */}
              {nodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                const isLinkingSource = linkSourceId === node.id;
                return (
                  <g 
                    key={node.id} 
                    transform={`translate(${node.x},${node.y})`}
                    className="cursor-grab active:cursor-grabbing group select-none"
                    onMouseDown={(e) => handleMouseDown(e, node.id)}
                    onClick={(e) => handleNodeClick(e, node)}
                  >
                    <circle 
                      r={node.r}
                      filter={isSelected ? "url(#nodeGlow)" : ""}
                      className={`transition-all duration-300 ${
                        isLinkingSource 
                          ? 'fill-primary/20 stroke-primary stroke-2' 
                          : isSelected 
                            ? 'fill-primary stroke-primary/30 stroke-[6px]' 
                            : 'fill-white stroke-slate-200 stroke-2 group-hover:stroke-slate-400'
                      }`}
                    />
                    <text 
                      dy="4" 
                      textAnchor="middle" 
                      className={`text-[9px] font-black pointer-events-none select-none ${
                        isSelected ? 'fill-white' : 'fill-dark'
                      }`}
                    >
                      {node.title ? node.title.charAt(0).toUpperCase() : 'N'}
                    </text>
                    <title>{node.title || "Untitled"}</title>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Selected Node Sidebar Controls */}
        <div className="w-56 flex flex-col justify-between border-l border-slate-100 pl-6 overflow-y-auto select-none">
          {selectedNode ? (
            <div className="space-y-5">
              <div>
                <h4 className="font-display font-black text-xs text-dark truncate">{selectedNode.title || "Untitled"}</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-1.5 line-clamp-3 leading-relaxed">
                  {selectedNode.content || "Empty content..."}
                </p>
              </div>

              <div className="space-y-1.5">
                <button
                  onClick={() => onSelectNote(selectedNode)}
                  className="w-full text-[10px] font-black uppercase bg-slate-50 hover:bg-slate-100 text-dark py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Open Note
                </button>
                <button
                  onClick={startManualLink}
                  className="w-full text-[10px] font-black uppercase bg-slate-50 hover:bg-slate-100 text-dark py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Draw Link
                </button>
                <button
                  onClick={fetchAISuggestions}
                  disabled={isAiLoading}
                  className="w-full text-[10px] font-black uppercase bg-companion-soft text-companion hover:bg-companion/10 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Icons.Sparkles className="w-3.5 h-3.5" />
                  <span>{isAiLoading ? "Thinking..." : "AI Suggestions"}</span>
                </button>
              </div>

              {suggestingForNoteId === selectedNodeId && aiSuggestions.length > 0 && (
                <div className="space-y-2 border-t border-slate-100 pt-4 animate-in fade-in duration-200">
                  <h5 className="text-[9px] font-black text-companion uppercase tracking-wider">Connect to:</h5>
                  <div className="space-y-1.5">
                    {aiSuggestions.map(s => {
                      const match = notes?.find(n => n.id === s.note_id);
                      if (!match) return null;
                      return (
                        <div key={s.note_id} className="flex justify-between items-center gap-2 p-2 bg-slate-50/50 border border-slate-100/50 rounded-lg">
                          <span className="text-[10px] font-bold text-dark truncate flex-1" title={s.reason}>{match.title}</span>
                          <button 
                            onClick={() => acceptAISuggestion(s.note_id)}
                            className="bg-green-500 hover:bg-green-600 text-white text-xs w-5 h-5 rounded-lg flex items-center justify-center font-bold cursor-pointer"
                            title={s.reason}
                          >
                            <Icons.Plus className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-[10px] font-bold text-slate-400/80 leading-relaxed italic px-2">
              <Icons.Map className="w-6 h-6 mb-2 text-slate-300" />
              <span>Select a node on the canvas to inspect relations or request recommendations.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
