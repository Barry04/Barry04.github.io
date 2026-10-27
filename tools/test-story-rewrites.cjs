const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const articles = ['vibe-coding-bottleneck', 'agent-skill-memory-governance', 'agent-unreleased-code-compatibility', 'jev-model-thinking'];
const base = process.env.STORY_TEST_URL || 'http://127.0.0.1:4318';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  for (const slug of articles) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
    await context.route(/fonts\.(googleapis|gstatic)\.com|utteranc\.es/, route => route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/2026/${slug}.html`);
    assert.equal(await page.locator('body.page-story').count(), 1, `${slug}: story layout`);
    assert.ok(await page.locator('.story-scene').count() >= 4, `${slug}: connected scenes`);
    assert.ok(await page.locator('[data-story-diagram]').count() >= 3, `${slug}: custom diagrams`);
    assert.ok(await page.locator('.article-toc a').count() >= 4, `${slug}: TOC`);
    for (const figure of await page.locator('.story-diagram--compare,.story-diagram--layers,.story-diagram--branch').all()) {
      assert.equal(await figure.locator('.story-node').first().evaluate(el => getComputedStyle(el, '::after').content), 'none', `${slug}: alternatives must not imply sequential steps`);
    }
    const first = page.locator('[data-story-diagram]').first();
    await first.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('[data-story-diagram]').dataset.running === 'true');
    await page.locator('[data-story-motion]').click();
    assert.equal(await first.getAttribute('data-running'), 'false');
    for (const width of [375, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const diagram of await page.locator('[data-story-diagram]').all()) {
        await diagram.scrollIntoViewIfNeeded();
        assert.equal(await diagram.evaluate(el => el.scrollWidth <= el.clientWidth + 1), true, `${slug}: diagram fits ${width}px`);
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${slug}: page fits ${width}px`);
    }
    await page.setViewportSize({ width: 1440, height: 960 });
    await first.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `.tmp-preview/${slug}-desktop.png`, animations: 'disabled' });
    await page.locator('[data-theme-toggle]').click();
    await page.setViewportSize({ width: 375, height: 900 });
    await first.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `.tmp-preview/${slug}-mobile-dark.png`, animations: 'disabled' });
    assert.deepEqual(errors, []);
    await context.close();
    const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 900 } });
    const staticPage = await staticContext.newPage();
    await staticPage.goto(`${base}/2026/${slug}.html`);
    assert.equal(await staticPage.locator('[data-story-motion]').isVisible(), false);
    for (const node of await staticPage.locator('[data-story-diagram] .story-node').all()) assert.equal(await node.isVisible(), true);
    await staticPage.emulateMedia({ media: 'print' });
    for (const svg of await staticPage.locator('.story-detail svg').all()) assert.equal(await svg.evaluate(el => el.checkVisibility()), true);
    await staticContext.close();
    console.log(`PASS: ${slug} — desktop/mobile, themes, diagrams, controls, TOC, no-JS, print`);
  }
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
