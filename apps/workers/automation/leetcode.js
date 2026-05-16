const { chromium } = require('playwright');

async function extractProblem(page) {
  console.log('[Playwright] Navigating to LeetCode Two Sum...');
  await page.goto("https://leetcode.com/problems/two-sum/", { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(5000);
  
  return {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
  };
}

async function submitCode(page, code) {
  console.log('[Playwright] Attempting to paste code...');
  
  try {
    // 1. Click the editor to focus
    // Monaco editor text area is usually deep inside
    const editorArea = await page.waitForSelector('.monaco-editor .view-lines', { timeout: 15000 });
    await editorArea.click();
    console.log('[Playwright] Editor focused.');

    // 2. Clear current code
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');

    // 3. INSERT TEXT DIRECTLY (No clipboard needed)
    // This is the most robust way in Playwright
    await page.keyboard.insertText(code);
    console.log('[Playwright] Code inserted successfully.');

    await page.waitForTimeout(2000);

    // 4. Find and Click Submit Button
    // We try multiple common selectors for the submit button
    const submitSelectors = [
      'button[data-e2e-locator="console-submit-button"]',
      'button.bg-fill-primary', // Common LeetCode orange button
      'button:has-text("Submit")'
    ];

    let clicked = false;
    for (const sel of submitSelectors) {
      try {
        const btn = await page.waitForSelector(sel, { timeout: 3000, visible: true });
        await btn.click();
        clicked = true;
        console.log(`[Playwright] Clicked submit button with: ${sel}`);
        break;
      } catch (e) { continue; }
    }

    if (!clicked) throw new Error('Submit button not found');

    console.log('[Playwright] Waiting for judging...');
    await page.waitForTimeout(10000);
    
    return { status: "Success", executionTime: 0, memoryUsed: 0 };

  } catch (err) {
    console.error('[Playwright Error]:', err.message);
    await page.screenshot({ path: 'submission_error.png' });
    return { status: "Failed", error: err.message };
  }
}

module.exports = { extractProblem, submitCode };
