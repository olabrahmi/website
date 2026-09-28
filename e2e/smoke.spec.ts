import { expect, test } from '@playwright/test';

const workSlugs = ['shaza', 'maya', 'payback', 'takeda', 'descope', 'charm-industrial', 'o1labs', 'akasec'];

test('home renders the positioning and both hero buttons', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('I build web platforms big teams rely on.');
  await expect(page.getByRole('link', { name: 'See my work' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download CV' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hiring for AI or product engineering?' })).toBeVisible();
});

for (const slug of workSlugs) {
  test(`work page ${slug} returns 200 with a title`, async ({ page }) => {
    const response = await page.goto(`/work/${slug}`);

    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: "How it's built" })).toBeVisible();
  });
}

test('blog shows the empty state and cv shows the download button', async ({ page }) => {
  await page.goto('/blog');
  await expect(page.getByText('No posts yet. First one is about how Maya fails. Check back soon.')).toBeVisible();

  await page.goto('/cv');
  await expect(page.getByRole('link', { name: 'Download PDF' })).toBeVisible();
});

test('unknown routes show the 404 copy', async ({ page }) => {
  const response = await page.goto('/nope');

  expect(response?.status()).toBe(404);
  await expect(page.getByText("This page doesn't exist. Try the work section.")).toBeVisible();
  await expect(page.getByRole('link', { name: 'See my work' })).toBeVisible();
});

test('old routes redirect', async ({ page }) => {
  await page.goto('/contact');
  await expect(page).toHaveURL(/\/#contact$/);
});

test('theme toggle switches and persists across a reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const html = page.locator('html');

  await expect(html).not.toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(html).toHaveClass(/dark/);
  await page.reload();
  await expect(html).toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(html).not.toHaveClass(/dark/);
});

test('no horizontal scroll at common mobile widths', async ({ page }) => {
  for (const width of [320, 375, 414, 768]) {
    await page.setViewportSize({ width, height: 800 });
    for (const path of ['/', '/work/descope', '/work/maya']) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

      expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
    }
  }
});
