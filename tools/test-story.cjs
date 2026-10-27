const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('playwright');

const base = process.env.STORY_TEST_URL || 'http://127.0.0.1:4318';
const article = '/2026/skill-lifecycle.html';
const shots = path.resolve('.tmp-preview');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const errors = [];
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route(/fonts\.(googleapis|gstatic)\.com|utteranc\.es/, route => route.abort());
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + article);
  await page.locator('[data-story-diagram]').first().waitFor({ timeout: 5000 });
  assert.equal(await page.locator('body.page-story').count(), 1);
  assert.equal(await page.locator('.story-scene').count() >= 4, true);
  assert.equal(await page.locator('.article-toc a').count() >= 4, true);
  const diagram = page.locator('[data-story-diagram]').first();
  await diagram.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('[data-story-diagram]').dataset.running === 'true');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  assert.equal(await diagram.getAttribute('data-running'), 'false');
  await page.evaluate(() => {
    delete document.hidden;
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForFunction(() => document.querySelector('[data-story-diagram]').dataset.running === 'true');
  const initial = await diagram.locator('.is-current').getAttribute('data-story-step');
  await page.waitForFunction(previous => document.querySelector('[data-story-diagram] .is-current').dataset.storyStep !== previous, initial);
  const toggle = page.locator('[data-story-motion]');
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-pressed'), 'true');
  assert.equal(await diagram.getAttribute('data-running'), 'false');
  await toggle.click();
  await diagram.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('[data-story-diagram]').dataset.running === 'true');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => document.querySelector('[data-story-diagram]').dataset.running === 'false');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await diagram.scrollIntoViewIfNeeded();
  assert.equal(await toggle.isDisabled(), true);
  assert.equal(await diagram.getAttribute('data-running'), 'false');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.screenshot({ path: path.join(shots, 'story-desktop-light.png'), fullPage: false });
  await page.locator('[data-theme-toggle]').click();
  await page.screenshot({ path: path.join(shots, 'story-desktop-dark.png'), fullPage: false });
  await page.setViewportSize({ width: 375, height: 812 });
  for (const figure of await page.locator('[data-story-diagram]').all()) {
    await figure.scrollIntoViewIfNeeded();
    const overflows = await figure.evaluate(el => el.scrollWidth > el.clientWidth + 1);
    assert.equal(overflows, false, 'mobile diagram must fit without horizontal scrolling');
  }
  await diagram.scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(shots, 'story-mobile-dark.png'), fullPage: false });
  await page.locator('[data-theme-toggle]').click();
  await page.screenshot({ path: path.join(shots, 'story-mobile-light.png'), fullPage: false });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.setViewportSize({ width: 320, height: 740 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.goto(base + '/2026/hello-again.html');
  assert.equal(await page.locator('script[src*="/story.js"],link[href*="/story.css"]').count(), 0);
  const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const staticPage = await nojs.newPage();
  await staticPage.goto(base + article);
  assert.equal(await staticPage.locator('[data-story-diagram]').count() >= 3, true);
  assert.equal(await staticPage.locator('[data-story-motion]').isVisible(), false);
  assert.equal(await staticPage.locator('.story-node').first().isVisible(), true);
  await staticPage.emulateMedia({ media: 'print' });
  assert.equal(await staticPage.locator('.story-detail svg').evaluate(el => el.checkVisibility()), true, 'closed supplemental diagram must print without JS');
  assert.deepEqual(errors, []);
  await browser.close();
  console.log('PASS: scenes, TOC, sequencing, pause/resume, offscreen/background pause, reduced motion, desktop/mobile themes at 375/320px, no-JS, print and ordinary article isolation');
})().catch(error => { console.error(error); process.exit(1); });
