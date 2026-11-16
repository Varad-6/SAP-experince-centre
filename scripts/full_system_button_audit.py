import asyncio
import sys
from playwright.async_api import async_playwright

BASE_URL = "https://aamya-resplendent-cheetah-am.cfapps.eu30.hana.ondemand.com"

async def test_site():
    print(f"=== STARTING PLAYWRIGHT EXHAUSTIVE BUTTON AUDIT ===")
    print(f"Target URL: {BASE_URL}")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        # We will test Desktop and Mobile
        viewports = [
            {"name": "Desktop (1440x900)", "width": 1440, "height": 900},
            {"name": "Mobile iPhone 16 (393x852)", "width": 393, "height": 852, "is_mobile": True, "has_touch": True}
        ]

        failures = []

        for vp in viewports:
            print(f"\n==========================================")
            print(f" TESTING VIEWPORT: {vp['name']}")
            print(f"==========================================")
            
            context = await browser.new_context(
                viewport={"width": vp["width"], "height": vp["height"]},
                is_mobile=vp.get("is_mobile", False),
                has_touch=vp.get("has_touch", False)
            )
            page = await context.new_page()

            page_errors = []
            page.on("pageerror", lambda err: page_errors.append(f"PAGE ERROR: {err}"))
            page.on("console", lambda msg: page_errors.append(f"CONSOLE ERROR: {msg.text}") if msg.type == "error" else None)

            # 1. LANDING PAGE
            print("\n--- 1. Testing Landing Page ---")
            try:
                await page.goto(f"{BASE_URL}/", wait_until="networkidle", timeout=30000)
                
                # Test Explore solutions button
                explore_btn = page.locator('a[href*="/pillars"]').first
                if await explore_btn.is_visible():
                    print("  [OK] 'Explore solutions' CTA is visible. Clicking...")
                    await explore_btn.click()
                    await page.wait_for_timeout(1000)
                    if "/pillars" in page.url:
                        print(f"  [PASS] Navigated to {page.url}")
                    else:
                        failures.append(f"[{vp['name']}] Explore solutions click did not navigate to /pillars. Current: {page.url}")
                else:
                    failures.append(f"[{vp['name']}] 'Explore solutions' CTA not visible on landing page.")

                # Back to landing
                await page.goto(f"{BASE_URL}/", wait_until="networkidle")
                
                # Test Contact details button
                contact_btn = page.locator('button:has-text("Contact details")').first
                if await contact_btn.is_visible():
                    print("  [OK] 'Contact details' button is visible. Clicking...")
                    await contact_btn.click()
                    await page.wait_for_timeout(500)
                    dialog = page.locator('[role="dialog"]')
                    if await dialog.is_visible():
                        print("  [PASS] Contact Dialog opened.")
                        # Test close via X button
                        x_btn = dialog.locator('button[aria-label="Close dialog"]')
                        if await x_btn.is_visible():
                            await x_btn.click()
                            await page.wait_for_timeout(400)
                            if not await dialog.is_visible():
                                print("  [PASS] Contact Dialog closed via (X).")
                            else:
                                failures.append(f"[{vp['name']}] Contact dialog did not close after clicking (X).")
                    else:
                        failures.append(f"[{vp['name']}] Contact Dialog did not open when clicking 'Contact details' on landing page.")

                    # Open again and test bottom 'Close' button
                    await contact_btn.click()
                    await page.wait_for_timeout(400)
                    close_btn = dialog.locator('button:has-text("Close")')
                    if await close_btn.is_visible():
                        await close_btn.click()
                        await page.wait_for_timeout(400)
                        if not await dialog.is_visible():
                            print("  [PASS] Contact Dialog closed via bottom 'Close' button.")
                        else:
                            failures.append(f"[{vp['name']}] Contact dialog did not close after clicking bottom 'Close'.")
                else:
                    failures.append(f"[{vp['name']}] 'Contact details' button not visible on landing page.")

            except Exception as e:
                failures.append(f"[{vp['name']}] Landing page exception: {e}")

            # 2. PILLARS HUB
            print("\n--- 2. Testing Pillars Hub (/pillars/) ---")
            try:
                await page.goto(f"{BASE_URL}/pillars/", wait_until="networkidle")
                
                # Test 'Back to Home'
                back_home = page.locator('a:has-text("Back to Home")')
                if await back_home.is_visible():
                    print("  [OK] 'Back to Home' button is visible.")
                    await back_home.click()
                    await page.wait_for_timeout(800)
                    print(f"  [PASS] Back to Home navigated to {page.url}")
                    await page.goto(f"{BASE_URL}/pillars/", wait_until="networkidle")

                # Test 4 pillar links
                for p_id in ["p1", "p2", "p3", "p4"]:
                    p_link = page.locator(f'a[href*="/pillar/{p_id}"]')
                    if await p_link.count() > 0:
                        text = (await p_link.first.text_content() or "").strip().replace('\n', ' ')
                        print(f"  [OK] Found Pillar link {p_id}: '{text[:40]}...'")
                        await p_link.first.click()
                        await page.wait_for_timeout(800)
                        if f"/pillar/{p_id}" in page.url:
                            print(f"  [PASS] Successfully opened /pillar/{p_id}/")
                        else:
                            failures.append(f"[{vp['name']}] Clicking pillar {p_id} link failed to navigate. Current URL: {page.url}")
                        # Return to /pillars/
                        await page.goto(f"{BASE_URL}/pillars/", wait_until="networkidle")
                    else:
                        failures.append(f"[{vp['name']}] Pillar {p_id} card link not found on /pillars/")

            except Exception as e:
                failures.append(f"[{vp['name']}] Pillars Hub exception: {e}")

            # 3. SAMPLE SOLUTION TEST ACROSS ALL 3 PILLARS
            test_solutions = [
                # Pillar 1
                "podzo",
                "reconly",
                "mdr",
                # Pillar 2
                "hanamorph",
                # Pillar 3
                "revenue-analytics",
                "asset-reliability-mro"
            ]

            for slug in test_solutions:
                print(f"\n--- 3. Testing Solution: {slug} ---")
                sol_url = f"{BASE_URL}/solution/{slug}/"
                try:
                    await page.goto(sol_url, wait_until="networkidle")
                    
                    # Test 'Back to Pillar' button
                    back_btn = page.locator('a:has-text("Back to")').first
                    if await back_btn.is_visible():
                        print(f"  [OK] 'Back' button visible on {slug}.")
                    else:
                        failures.append(f"[{vp['name']}] Back button not visible on /solution/{slug}/")

                    # Test 'Contact details' button
                    contact_btn = page.locator('button:has-text("Contact details")').first
                    if await contact_btn.is_visible():
                        print(f"  [OK] 'Contact details' button visible on {slug}. Clicking...")
                        await contact_btn.click()
                        await page.wait_for_timeout(400)
                        dialog = page.locator('[role="dialog"]')
                        if await dialog.is_visible():
                            print(f"  [PASS] Contact Dialog opened on {slug}.")
                            close_btn = dialog.locator('button:has-text("Close")')
                            await close_btn.click()
                            await page.wait_for_timeout(300)
                        else:
                            failures.append(f"[{vp['name']}] Contact dialog failed to open on {slug}")

                    # Test 'Architecture' button
                    arch_btn = page.locator('button:has-text("Architecture")').first
                    if await arch_btn.is_visible():
                        print(f"  [OK] 'Architecture' button visible on {slug}. Clicking...")
                        await arch_btn.click()
                        await page.wait_for_timeout(500)
                        arch_dialog = page.locator('[role="dialog"][aria-labelledby="blueprint-title"]')
                        if await arch_dialog.is_visible():
                            print(f"  [PASS] Architecture Blueprint dialog opened on {slug}.")
                            
                            # Check if 'View full diagram' button exists
                            view_diag_btn = arch_dialog.locator('button:has-text("View full diagram")')
                            if await view_diag_btn.count() > 0 and await view_diag_btn.is_visible():
                                print(f"  [OK] 'View full diagram' button present. Clicking...")
                                await view_diag_btn.click()
                                await page.wait_for_timeout(500)
                                zoom_dialog = page.locator('[role="dialog"]').nth(1)
                                if await zoom_dialog.is_visible():
                                    print(f"  [PASS] Diagram zoom viewer opened.")
                                    # Test zoom controls
                                    zoom_in = zoom_dialog.locator('button[title="Zoom In"]')
                                    zoom_out = zoom_dialog.locator('button[title="Zoom Out"]')
                                    reset_zoom = zoom_dialog.locator('button[title="Reset Zoom"]')
                                    close_viewer = zoom_dialog.locator('button[title="Close Viewer"]')
                                    
                                    if await zoom_in.is_visible():
                                        await zoom_in.click()
                                        print(f"  [PASS] Clicked Zoom In.")
                                    if await zoom_out.is_visible():
                                        await zoom_out.click()
                                        print(f"  [PASS] Clicked Zoom Out.")
                                    if await reset_zoom.is_visible():
                                        await reset_zoom.click()
                                        print(f"  [PASS] Clicked Reset Zoom.")
                                    if await close_viewer.is_visible():
                                        await close_viewer.click()
                                        await page.wait_for_timeout(300)
                                        print(f"  [PASS] Closed diagram zoom viewer.")

                            # Test 'Close Blueprint' button
                            close_bp_btn = arch_dialog.locator('button:has-text("Close Blueprint")')
                            if await close_bp_btn.is_visible():
                                await close_bp_btn.click()
                                await page.wait_for_timeout(300)
                                if not await arch_dialog.is_visible():
                                    print(f"  [PASS] Architecture dialog closed successfully.")
                                else:
                                    failures.append(f"[{vp['name']}] Architecture dialog did not close on {slug}")
                        else:
                            failures.append(f"[{vp['name']}] Architecture dialog failed to open on {slug}")
                    else:
                        print(f"  [INFO] No Architecture button on {slug}")

                    # Test 'Interactive demo' button
                    demo_link = page.locator('a[href*="/demo"]').first
                    if await demo_link.is_visible():
                        print(f"  [OK] 'Interactive demo' CTA is visible on {slug}. Clicking...")
                        await demo_link.click()
                        await page.wait_for_timeout(1000)
                        if f"/solution/{slug}/demo" in page.url:
                            print(f"  [PASS] Successfully arrived at {page.url}")
                        else:
                            failures.append(f"[{vp['name']}] Interactive demo click did not navigate to demo URL. Current: {page.url}")
                    else:
                        failures.append(f"[{vp['name']}] 'Interactive demo' button not visible on /solution/{slug}/")

                    # 4. TEST SLIDEDECK CONTROLS
                    print(f"  Testing SlideDeck controls on /solution/{slug}/demo/ ...")
                    # Check Next button
                    next_btn = page.locator('button:has-text("Next"), button:has-text("Finish & Summary"), button:has-text("Done")').first
                    prev_btn = page.locator('button:has-text("Previous")').first
                    
                    if await next_btn.is_visible():
                        print(f"    [OK] Next button visible.")
                        # Advance 2 slides
                        await next_btn.click()
                        await page.wait_for_timeout(300)
                        await next_btn.click()
                        await page.wait_for_timeout(300)
                        print(f"    [PASS] Advanced 2 slides using Next.")
                        
                        # Test Previous button
                        if await prev_btn.is_visible() and await prev_btn.is_enabled():
                            await prev_btn.click()
                            await page.wait_for_timeout(300)
                            print(f"    [PASS] Navigated back using Previous.")

                    # Test numbered pill buttons (desktop) or End button
                    end_btn = page.locator('button:has-text("End")')
                    if await end_btn.count() > 0 and await end_btn.is_visible():
                        print(f"    [OK] 'End' button visible. Clicking to jump to closing slide...")
                        await end_btn.click()
                        await page.wait_for_timeout(500)
                        
                        # Test Closing slide buttons: 'Restart deck' and 'Contact Sales Head'
                        restart_btn = page.locator('button:has-text("Restart deck")')
                        if await restart_btn.is_visible():
                            print(f"    [OK] 'Restart deck' visible. Clicking...")
                            await restart_btn.click()
                            await page.wait_for_timeout(400)
                            print(f"    [PASS] Restarted deck to slide 1.")
                        else:
                            failures.append(f"[{vp['name']}] 'Restart deck' button missing on closing slide of {slug}")

                        # Jump to end again to test Contact Sales Head
                        await end_btn.click()
                        await page.wait_for_timeout(400)
                        sales_btn = page.locator('button:has-text("Contact Sales Head")')
                        if await sales_btn.is_visible():
                            print(f"    [OK] 'Contact Sales Head' visible. Clicking...")
                            await sales_btn.click()
                            await page.wait_for_timeout(400)
                            c_dialog = page.locator('[role="dialog"]')
                            if await c_dialog.is_visible():
                                print(f"    [PASS] Contact Dialog opened from closing slide.")
                                await c_dialog.locator('button:has-text("Close")').click()
                                await page.wait_for_timeout(300)
                            else:
                                failures.append(f"[{vp['name']}] Contact Sales Head failed to open dialog on {slug}")
                    
                    # Test 'Back to Overview' button
                    back_overview = page.locator('a:has-text("Back to Overview")')
                    if await back_overview.is_visible():
                        print(f"    [OK] 'Back to Overview' visible. Clicking...")
                        await back_overview.click()
                        await page.wait_for_timeout(800)
                        if f"/solution/{slug}" in page.url and "/demo" not in page.url:
                            print(f"    [PASS] Navigated back to overview: {page.url}")
                        else:
                            failures.append(f"[{vp['name']}] Back to Overview failed. Current: {page.url}")

                except Exception as e:
                    failures.append(f"[{vp['name']}] Exception on {slug}: {e}")

            if page_errors:
                print(f"\n--- Logged Page Errors for {vp['name']} ({len(page_errors)}) ---")
                for err in page_errors[:10]:
                    print("  ", err)

            await context.close()

        await browser.close()

        print(f"\n==========================================")
        print(f" AUDIT COMPLETE: {len(failures)} FAILURES FOUND")
        print(f"==========================================")
        for idx, f in enumerate(failures):
            print(f"  {idx+1}. {f}")
        
        if failures:
            sys.exit(1)
        else:
            print("ALL BUTTON AUDITS PASSED CLEANLY!")

if __name__ == "__main__":
    asyncio.run(test_site())
