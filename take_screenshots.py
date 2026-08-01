import time
import os
from playwright.sync_api import sync_playwright

def capture_screenshots():
    # Make sure screenshots folder exists
    screenshots_dir = "/Users/prajwal/Downloads/Noteapp/screenshots"
    os.makedirs(screenshots_dir, exist_ok=True)
    
    with sync_playwright() as p:
        # Launch fresh local Chromium instance with recommended sandbox disable arguments
        print("Launching browser...")
        browser = p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        
        # Launching directly with browser.new_page() rather than creating a new context first
        print("Creating new page...")
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        
        # 1. Homepage
        print("1. Navigating to Homepage...")
        page.goto("http://localhost:5174/")
        page.wait_for_timeout(2000)
        page.screenshot(path=f"{screenshots_dir}/homepage.png")
        print("Saved homepage.png")
        
        # 2. Product/Features Page
        print("2. Navigating to Product page...")
        page.goto("http://localhost:5174/product")
        page.wait_for_timeout(2000)
        page.screenshot(path=f"{screenshots_dir}/product.png")
        print("Saved product.png")
        
        # 3. Solutions Landing Page
        print("3. Navigating to Solutions page...")
        page.goto("http://localhost:5174/solutions")
        page.wait_for_timeout(2000)
        page.screenshot(path=f"{screenshots_dir}/solutions.png")
        print("Saved solutions.png")
        
        # 4. Pricing Page
        print("4. Navigating to Pricing page...")
        page.goto("http://localhost:5174/pricing")
        page.wait_for_timeout(2000)
        page.screenshot(path=f"{screenshots_dir}/pricing.png")
        print("Saved pricing.png")
        
        # 5. Login Page
        print("5. Navigating to Login page...")
        page.goto("http://localhost:5174/login")
        page.wait_for_timeout(2000)
        page.screenshot(path=f"{screenshots_dir}/login.png")
        print("Saved login.png")
        
        # 6. Register Page
        print("6. Navigating to Register page...")
        page.goto("http://localhost:5174/register")
        page.wait_for_timeout(2000)
        page.screenshot(path=f"{screenshots_dir}/register.png")
        print("Saved register.png")
        
        # 7. Register a new user to ensure dashboard starts empty
        unique_id = int(time.time())
        test_email = f"audit_user_{unique_id}@notely.com"
        test_password = "Password@123"
        print(f"Registering user: {test_email}")
        
        page.fill('input[placeholder="Sarah Chen"]', "Audit Tester")
        page.fill('input[placeholder="Acme Corp"]', "Notely Audit")
        page.fill('input[placeholder="you@example.com"]', test_email)
        # Select the password fields by placeholder or index
        passwords = page.locator('input[placeholder="••••••••"]')
        passwords.nth(0).fill(test_password)
        passwords.nth(1).fill(test_password)
        
        page.click('button[type="submit"]')
        
        # Wait for redirect to dashboard directly
        print("Waiting for redirection to /dashboard...")
        page.wait_for_url("**/dashboard", timeout=15000)
        page.wait_for_timeout(3000)
        
        # Save empty state dashboard screenshot
        page.screenshot(path=f"{screenshots_dir}/dashboard_empty.png")
        print("Saved dashboard_empty.png")
        
        # Dump HTML content for debugging
        with open(f"{screenshots_dir}/dashboard_content.html", "w") as f:
            f.write(page.content())
        print("Saved dashboard_content.html")
        
        # 8. Create a new note
        print("Creating first note...")
        page.click('button[title="New Note"]')
        page.wait_for_selector('input[placeholder="Untitled Note"]')
        page.wait_for_timeout(1000)
        
        # Fill title and content
        page.fill('input[placeholder="Untitled Note"]', "Audit Test Note")
        page.fill('textarea[placeholder="Start writing…"]', 
                  "This is a test note for our automated documentation audit. It contains some text that we can use to verify AI features.")
        page.wait_for_timeout(1000)
        
        # Save note
        page.click('button:has-text("Save Note")')
        page.wait_for_timeout(2000)
        page.screenshot(path=f"{screenshots_dir}/dashboard.png")
        print("Saved dashboard.png")
        
        # 9. AI Companion
        print("Opening AI Companion...")
        # Use quick ask bar to prefill and open chat drawer
        page.fill('input[placeholder="Ask about your notes…"]', "What is in my audit test note?")
        page.wait_for_timeout(500)
        # Click the submit button inside the quick ask form
        page.click('form:has(input[placeholder="Ask about your notes…"]) button[type="submit"]')
        page.wait_for_timeout(5000) # Wait for AI response (allow 5 seconds)
        page.screenshot(path=f"{screenshots_dir}/dashboard_chat.png")
        print("Saved dashboard_chat.png")
        
        # 10. Knowledge Map
        print("Opening Knowledge Map...")
        page.click('button[title="Knowledge Map"]')
        page.wait_for_timeout(2000)
        page.screenshot(path=f"{screenshots_dir}/dashboard_map.png")
        print("Saved dashboard_map.png")
        
        # Toggle Map off
        page.click('button[title="Knowledge Map"]')
        page.wait_for_timeout(1000)
        
        # 11. Settings Profile Tab
        print("Opening Settings (Profile Tab)...")
        page.click('button[title="More"]')
        page.wait_for_timeout(500)
        page.click('button:has-text("Settings & Profile")')
        page.wait_for_timeout(2000)
        page.screenshot(path=f"{screenshots_dir}/settings_profile.png")
        print("Saved settings_profile.png")
        
        # 12. Settings Billing Tab
        print("Switching to Billing tab...")
        page.click('button:has-text("Billing & Plans")')
        page.wait_for_timeout(1000)
        page.screenshot(path=f"{screenshots_dir}/settings_billing.png")
        print("Saved settings_billing.png")
        
        print("Closing browser...")
        browser.close()
        print("All screenshots successfully captured!")

if __name__ == "__main__":
    capture_screenshots()
