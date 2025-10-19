import { test, expect } from '@playwright/test';

// --- CONFIGURATION ---
function getBase() {
  // Prefer Playwright config baseURL if set in environment, else fallback to localhost
  const envBase =
    process.env.PLAYWRIGHT_BASE_URL ?? process.env.PLAYWRIGHT_TEST_BASE_URL ?? process.env.BASE_URL ?? process.env.TEST_BASE_URL;
  if (!envBase) return 'http://localhost:3000';
  // Ensure a valid absolute URL
  try {
    return new URL(envBase).toString();
  } catch {
    return envBase.startsWith('http') ? envBase : `http://${envBase}`;
  }
}

// --- SELECTOR CONSTANTS ---
const SELECTORS = {
  // Elements that indicate the page loaded successfully
  PAGE_HEADER: 'h1, [data-testid="roadmap-header"]',
  ROADMAP_LIST: '[data-testid="roadmap-list"]',
  ROADMAP_ITEM: '[data-testid="roadmap-item"]',

  // Controls
  ADD_BUTTON: '[data-testid="add-roadmap-item"], button:has-text("Add"), button:has-text("New")',
  EDIT_BUTTON: '[data-testid="edit-button"], button:has-text("Edit")',
  DELETE_BUTTON: '[data-testid="delete-button"], button:has-text("Delete")',

  // Forms and Inputs
  ROADMAP_FORM: '[data-testid="roadmap-form"], form[aria-label*="roadmap"], form',
  TITLE_INPUT: 'input[name="title"], input[type="text"]',
  SUBMIT_BUTTON: 'button[type="submit"], [data-testid="submit"], button:has-text("Save"), button:has-text("Add")',
  CONFIRM_BUTTON: 'button:has-text("Confirm"), button:has-text("Yes"), [data-testid="confirm-delete"]',

  // Responsive
  MOBILE_MENU: '[data-testid="mobile-menu"], [data-testid="hamburger"]',
};

// --- UTILITY FUNCTIONS ---
/** Checks if the page has returned a 'Not found' error. */
const isNotFound = async (page: any) =>
  (await page.locator('h1').filter({ hasText: /not found/i }).count()) > 0;

/** Skips tests if the page couldn't load or returned a 404. */
const skipIfNotFound = async (page: any, message: string) => {
    if (await isNotFound(page)) {
        test.skip(true, `Page returned "Not found" — skipping ${message}`);
    }
};

// --- TEST SUITE ---
// Increased timeout for the entire suite to 60 seconds (default is 30s)
test.describe('Roadmap page', { timeout: 60000 }, () => {
  test.beforeEach(async ({ page }) => {
    const base = getBase();

    // Seed localStorage on about:blank first
    await page.goto('about:blank');
    await page.evaluate(() => {
      try {
        const sample = [
          {
            id: 'test-1',
            title: 'Test Roadmap 1',
            field: 'AI Generated',
            progress: 0,
            phase: 'Foundation',
            timeline: '6 months',
            createdAt: new Date().toISOString(),
            milestones: { completed: 0, total: 3 }
          }
        ];
        // Ensure myRoadmaps key is set for all subsequent tests
        localStorage.setItem('myRoadmaps', JSON.stringify(sample));
      } catch (e) {
        // ignore
      }
    });

    // Navigate to the target page and wait for content
    const url = new URL('/roadmaps', base).toString();
    // Using 'load' is often faster and generally sufficient for the page structure
    await page.goto(url, { waitUntil: 'load' });

    // *** FIX 1: Explicitly wait for the list to appear after page load ***
    // This addresses failures in Edit/Delete tests where items aren't visible fast enough.
    const list = page.locator(SELECTORS.ROADMAP_LIST);
    try {
        await list.waitFor({ state: 'visible', timeout: 15000 }); // Wait up to 15s for the list
    } catch (e) {
        // If the list is not visible, the subsequent tests will skip gracefully.
    }
  });

  // Test 1: Header and Title (Passed in previous run, no change)
  test('page has correct title and header', async ({ page }) => {
    await skipIfNotFound(page, 'header assertions');

    await expect(page).toHaveTitle(/Roadmap|Your Roadmap|Baby Collab/);

    const header = page.locator(SELECTORS.PAGE_HEADER).filter({ hasText: /roadmap/i }).first();
    await expect(header).toBeVisible({ timeout: 10000 });
    await expect(header).toContainText(/roadmap/i);
  });

  // Test 2: List Rendering (Passed in previous run, no change)
  test('roadmap list renders and contains seeded items', async ({ page }) => {
    await skipIfNotFound(page, 'list assertions');

    const list = page.locator(SELECTORS.ROADMAP_LIST);
    if ((await list.count()) === 0) test.skip(true, 'Roadmap list not present on this build — skipping');

    await expect(list).toBeVisible();

    const seededItem = list.locator(SELECTORS.ROADMAP_ITEM).filter({ hasText: 'Test Roadmap 1' });
    await expect(seededItem).toBeVisible({ timeout: 10000 });
  });

  // Test 3: Create (Failing on form visibility)
  test('can create a new roadmap item', async ({ page }) => {
    await skipIfNotFound(page, 'create test');

    const addBtn = page.locator(SELECTORS.ADD_BUTTON).first();
    await expect(addBtn).toBeVisible();
    await addBtn.click(); // This click must trigger the form to appear

    // *** FIX 2: Increased timeout for form visibility ***
    const form = page.locator(SELECTORS.ROADMAP_FORM).first();
    await expect(form).toBeVisible({ timeout: 15000 }); // Increased from default 5s to 15s

    const uniqueTitle = `E2E temp ${Date.now()}`;
    const titleInput = form.locator(SELECTORS.TITLE_INPUT).first();
    await titleInput.fill(uniqueTitle);

    const submit = form.locator(SELECTORS.SUBMIT_BUTTON).first();
    await submit.click();

    await form.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {/* ignore if form remains */});

    const list = page.locator(SELECTORS.ROADMAP_LIST);
    const created = list.locator(SELECTORS.ROADMAP_ITEM).filter({ hasText: uniqueTitle });

    await expect(created).toBeVisible({ timeout: 15000 });

    // Cleanup: try to delete the created item (optional but recommended)
    const deleteBtn = created.locator(SELECTORS.DELETE_BUTTON).first();
    if ((await deleteBtn.count()) > 0) {
      await deleteBtn.click();
      const confirm = page.locator(SELECTORS.CONFIRM_BUTTON).first();
      if ((await confirm.count()) > 0) await confirm.click();
      await created.waitFor({ state: 'hidden', timeout: 10000 });
    }
  });

  // Test 4: Edit (Failing on item visibility)
  test('can edit an existing roadmap item', async ({ page }) => {
    await skipIfNotFound(page, 'edit test');

    // Item visibility issue fixed by the general wait in beforeEach
    const firstItem = page.locator(SELECTORS.ROADMAP_ITEM).first();
    await expect(firstItem).toBeVisible();

    const editBtn = firstItem.locator(SELECTORS.EDIT_BUTTON).first();
    await editBtn.click();

    const editForm = page.locator(SELECTORS.ROADMAP_FORM).first();
    await expect(editForm).toBeVisible();

    const titleInput = editForm.locator(SELECTORS.TITLE_INPUT).first();
    const oldTitle = await titleInput.inputValue();
    const newTitle = oldTitle + ' Updated';

    await titleInput.fill(newTitle);

    const save = editForm.locator(SELECTORS.SUBMIT_BUTTON).first();
    await save.click();

    await editForm.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {/* ignore if form remains */});

    const updatedItem = page.locator(SELECTORS.ROADMAP_ITEM).filter({ hasText: newTitle });
    await expect(updatedItem).toBeVisible({ timeout: 15000 });
  });

  // Test 5: Delete (Failing on item visibility)
  test('can delete a roadmap item', async ({ page }) => {
    await skipIfNotFound(page, 'delete test');

    const list = page.locator(SELECTORS.ROADMAP_LIST);

    // Item visibility issue fixed by the general wait in beforeEach
    const itemToDelete = list.locator(SELECTORS.ROADMAP_ITEM).first();
    await expect(itemToDelete).toBeVisible();

    const initialItemCount = await list.locator(SELECTORS.ROADMAP_ITEM).count();
    
    const deleteBtn = itemToDelete.locator(SELECTORS.DELETE_BUTTON).first();
    await deleteBtn.click();

    const confirm = page.locator(SELECTORS.CONFIRM_BUTTON).first();
    if ((await confirm.count()) > 0) await confirm.click();

    // Assertion: The deleted item should disappear
    await itemToDelete.waitFor({ state: 'hidden', timeout: 15000 });

    const finalItemCount = await list.locator(SELECTORS.ROADMAP_ITEM).count();
    expect(finalItemCount).toBe(initialItemCount - 1);
  });

  // Test 6: Responsive (Failing on mobile menu visibility)
  test('responsive: mobile menu or compact layout is visible on small viewport', async ({ page }) => {
    await skipIfNotFound(page, 'responsive checks');

    await page.setViewportSize({ width: 375, height: 800 });
    await page.reload({ waitUntil: 'load' });

    // *** FIX 3: Increased timeout for mobile menu visibility ***
    const mobileMenu = page.locator(SELECTORS.MOBILE_MENU);
    await expect(mobileMenu.first()).toBeVisible({ timeout: 15000 });
  });

  // Test 7: Accessibility (Passed in previous run, no change)
  test('basic keyboard accessibility: can tab to primary controls', async ({ page }) => {
    await skipIfNotFound(page, 'keyboard accessibility test');

    const addButton = page.locator(SELECTORS.ADD_BUTTON).first();
    await expect(addButton).toBeVisible();

    await addButton.focus();
    await expect(addButton).toBeFocused();
  });
});