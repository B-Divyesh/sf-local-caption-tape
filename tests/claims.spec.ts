import { expect, test } from '@playwright/test';

test('@claim:search-phrase finds a spoken phrase', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Search captions').fill('Tuesday');
  await expect(page.getByText('2 matches')).toBeVisible();
  await expect(page.locator('mark')).toHaveCount(2);
  await page.getByLabel('Search captions').press('Enter');
  await expect(page.locator('#caption-list li').first()).toBeFocused();
});

test('@claim:timestamped-export exports Markdown and TXT', async ({ page }) => {
  await page.goto('/demo');
  for (const [name, expected] of [['Export Markdown', '# Meeting transcript'], ['Export TXT', '[00:00] Maya:']] as const) {
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name }).click();
    const download = await downloadPromise;
    const stream = await download.createReadStream();
    let body = '';
    for await (const chunk of stream!) body += chunk.toString();
    expect(body).toContain(expected);
    expect(body).toContain('Tuesday at nine');
  }
});

test('@claim:demo-isolated leaves real transcript storage untouched', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Add a caption by typing').fill('This belongs only to the demo');
  await page.getByRole('button', { name: 'Add caption' }).click();
  const dbs = await page.evaluate(() => indexedDB.databases());
  expect(dbs.find((item) => item.name === 'local-caption-tape')).toBeUndefined();
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => !key.startsWith('release:')))).toEqual([]);
});

test('@claim:private-network sends no demo data off origin', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByLabel('Search captions').fill('launch');
  await page.getByLabel('Add a caption by typing').fill('Private phrase');
  await page.getByRole('button', { name: 'Add caption' }).click();
  expect(requests.filter((url) => new URL(url).origin !== new URL(page.url()).origin)).toEqual([]);
});

test('@claim:encrypted-tape stores no transcript plaintext', async ({ page }) => {
  await page.goto('/app');
  await page.getByLabel('Add a caption by typing').fill('violet confidential phrase');
  await page.getByRole('button', { name: 'Add caption' }).click();
  await expect(page.getByText('violet confidential phrase')).toBeVisible();
  await page.waitForTimeout(100);
  const raw = await page.evaluate(async () => {
    const request = indexedDB.open('local-caption-tape');
    const db = await new Promise<IDBDatabase>((resolve) => { request.onsuccess = () => resolve(request.result); });
    const keys = await new Promise<IDBValidKey[]>((resolve) => { const r = db.transaction('private').objectStore('private').getAllKeys(); r.onsuccess = () => resolve(r.result); });
    return JSON.stringify(keys) + JSON.stringify(Object.entries(localStorage));
  });
  expect(raw).not.toContain('violet confidential phrase');
  await page.reload();
  await expect(page.getByText('violet confidential phrase')).toBeVisible();
});

test('@claim:transcript-only stores no audio object', async ({ page }) => {
  await page.goto('/app');
  await page.getByLabel('Add a caption by typing').fill('A transcript-only storage check');
  await page.getByRole('button', { name: 'Add caption' }).click();
  await page.waitForTimeout(100);
  const stored = await page.evaluate(async () => {
    const request = indexedDB.open('local-caption-tape');
    const db = await new Promise<IDBDatabase>((resolve) => { request.onsuccess = () => resolve(request.result); });
    const values = await new Promise<unknown[]>((resolve) => {
      const result = db.transaction('private').objectStore('private').getAll();
      result.onsuccess = () => resolve(result.result);
    });
    return values.map((value) => ({
      isBlob: value instanceof Blob,
      isMediaStream: typeof MediaStream !== 'undefined' && value instanceof MediaStream,
      fields: value && typeof value === 'object' ? Object.keys(value) : []
    }));
  });
  expect(stored.some((value) => value.isBlob || value.isMediaStream)).toBe(false);
  expect(stored.some((value) => value.fields.includes('ciphertext'))).toBe(true);
});

test('@claim:local-speech requires on-device processing', async ({ page }) => {
  await page.addInitScript(() => {
    class FakeRecognition {
      static available = async (options: { processLocally: boolean }) => options.processLocally ? 'available' : 'unavailable';
      continuous = false; interimResults = false; lang = ''; processLocally = false;
      onresult = null; onerror = null; onend = null;
      start() { (window as unknown as { recognitionLocal: boolean }).recognitionLocal = this.processLocally; }
      stop() {} abort() {}
    }
    (window as unknown as { SpeechRecognition: typeof FakeRecognition }).SpeechRecognition = FakeRecognition;
  });
  await page.goto('/app');
  await page.getByLabel('Everyone knows captions will run').check();
  await page.getByRole('button', { name: 'Start microphone' }).click();
  await expect(page.getByText('Listening on this device')).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { recognitionLocal: boolean }).recognitionLocal)).toBe(true);
});

test('@claim:offline-reload reloads the sample offline', async ({ page, context }) => {
  await page.goto('/demo');
  await page.waitForFunction(() => navigator.serviceWorker?.ready);
  await page.reload();
  await expect(page.getByText('Sample loaded')).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('Sample loaded')).toBeVisible();
});

test('@claim:free-retention removes captions after 60 minutes', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-08-28T12:00:00Z') });
  await page.goto('/app');
  await page.getByLabel('Add a caption by typing').fill('Free tape expiry marker');
  await page.getByRole('button', { name: 'Add caption' }).click();
  await page.clock.fastForward(61 * 60 * 1000);
  await page.getByLabel('Search captions').fill('expiry');
  await expect(page.getByText('Your captions will appear here')).toBeVisible();
});

test('@claim:paid-retention keeps captions for four hours', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-08-28T12:00:00Z') });
  await page.addInitScript(() => localStorage.setItem('sb_license_cache:local-caption-tape', JSON.stringify({ token: 'test', valid: true, checkedAt: Date.now() })));
  await page.goto('/app');
  await expect(page.getByText('Deletes after 4 hours')).toBeVisible();
  await page.getByLabel('Add a caption by typing').fill('Paid tape expiry marker');
  await page.getByRole('button', { name: 'Add caption' }).click();
  await page.clock.fastForward(61 * 60 * 1000);
  await page.getByLabel('Search captions').fill('paid');
  await expect(page.getByText('Paid tape expiry marker')).toBeVisible();
  await page.clock.fastForward(180 * 60 * 1000);
  await page.getByLabel('Search captions').fill('expiry');
  await expect(page.getByText('Your captions will appear here')).toBeVisible();
});
