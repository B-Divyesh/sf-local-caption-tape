import './styles.css';
import { sampleCaptions } from './sample';
import { asMarkdown, asText, downloadTranscript, timestamp } from './export';
import { clearTape, loadTape, saveTape } from './storage';
import type { Caption, LicenseState, TapeState } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
const PRODUCT = 'local-caption-tape';
const API = `https://api.sociobot.in/api/v1/products/${PRODUCT}`;
const LICENSE_KEY = `sb_license:${PRODUCT}`;
const LICENSE_CACHE = `sb_license_cache:${PRODUCT}`;
const BUILD = 'v0.1.0';
let cleanup: (() => void) | undefined;

const icons = {
  mark: `<svg aria-hidden="true" viewBox="0 0 48 48"><path d="M6 24h10m16 0h10M16 12v24l16-6V6z"/><circle cx="9" cy="24" r="4"/><circle cx="39" cy="24" r="4"/></svg>`,
  search: `<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>`
};

function pageShell(content: string, options: { active?: string; demo?: boolean } = {}): string {
  return `
    <div class="route-announcer sr-only" aria-live="polite"></div>
    ${options.demo ? `<aside class="demo-bar" aria-label="Demo mode"><strong>Demo</strong><span>Sample data. Nothing is saved.</span><button data-reset-demo>Reset demo</button><a href="/app" data-link>Start for real</a></aside>` : ''}
    <header class="site-header">
      <nav class="nav-wrap" aria-label="Main navigation">
        <a class="wordmark" href="/" data-link aria-label="Local Caption Tape home">${icons.mark}<span>Local Caption Tape</span></a>
        <div class="nav-links">
          <a href="/demo" data-link ${options.active === 'demo' ? 'aria-current="page"' : ''}>Demo</a>
          <a href="/app" data-link ${options.active === 'app' ? 'aria-current="page"' : ''}>Open app</a>
          <a href="/privacy" data-link ${options.active === 'privacy' ? 'aria-current="page"' : ''}>Privacy</a>
        </div>
      </nav>
    </header>
    ${content}
    <footer class="site-footer">
      <div><span class="mini-mark">●—●</span><p>Private, searchable captions on your device.</p></div>
      <nav aria-label="Footer navigation"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external)</span></a></nav>
      <p class="build-id">${BUILD} · Original generated poster art</p>
    </footer>`;
}

function landing(): string {
  return pageShell(`<main id="main">
    <section class="hero poster-grid" aria-labelledby="page-title">
      <div class="hero-copy">
        <p class="eyebrow">Private caption memory · Platform 01</p>
        <h1 id="page-title" tabindex="-1">Find what your meeting just said</h1>
        <p class="lede">For people who need live words to stay visible, searchable, and under their control.</p>
        <div class="hero-actions">
          <a class="button primary" href="/demo" data-link>Try it with sample data</a>
          <span>It opens a searchable two-minute meeting.</span>
        </div>
        <ul class="plain-facts" aria-label="Product facts">
          <li><strong>Private</strong><span>Captions stay encrypted on this device.</span></li>
          <li><strong>Offline</strong><span>Works offline after your first visit.</span></li>
          <li><strong>One time</strong><span>$29 for a four-hour rolling tape.</span></li>
        </ul>
      </div>
      <figure class="hero-art">
        <picture><source srcset="/art/caption-terminal-640.webp 640w, /art/caption-terminal.webp 1200w" sizes="(max-width: 760px) 100vw, 48vw"><img src="/art/caption-terminal.webp" width="1200" height="800" alt="A poster-style microphone feeds paper captions onto a transit line." fetchpriority="high" decoding="async"></picture>
        <figcaption>Every spoken phrase becomes a stop you can return to.</figcaption>
      </figure>
    </section>

    <section class="preview-section ruled" aria-labelledby="preview-title">
      <div class="section-heading"><p class="eyebrow">The working tape</p><h2 id="preview-title">Search the words while people speak</h2><p>Try the full sample. Search for “Tuesday” and jump to the decision.</p></div>
      <div class="app-window compact-preview" aria-label="Caption tape preview">
        <div class="window-bar"><span>12:04 elapsed</span><span class="live-pill">● Captions ready</span></div>
        <div class="preview-search">${icons.search}<span>Tuesday</span><kbd>⌘ K</kbd></div>
        <ol class="caption-list preview-list">
          <li><time>00:42</time><div><strong>Maya</strong><p>Please move the customer email to <mark>Tuesday</mark> morning.</p></div></li>
          <li><time>02:01</time><div><strong>Maya</strong><p>The final decision is <mark>Tuesday</mark> at nine.</p></div></li>
        </ol>
        <a class="text-link" href="/demo" data-link>Open this sample tape →</a>
      </div>
    </section>

    <section class="steps" aria-labelledby="steps-title">
      <div class="section-heading"><p class="eyebrow">Three stops</p><h2 id="steps-title">How the tape works</h2></div>
      <ol class="step-line">
        <li><span>01</span><div><h3>Confirm consent</h3><p>Tell people captions are running. Then start your microphone.</p></div></li>
        <li><span>02</span><div><h3>Follow and find</h3><p>Read live words. Search any phrase without stopping captions.</p></div></li>
        <li><span>03</span><div><h3>Export or let go</h3><p>Save Markdown or TXT. Unsaved captions expire on schedule.</p></div></li>
      </ol>
      <div class="walkthrough" aria-label="Captioned screenshot walkthrough">
        <figure><div class="mini-screen"><span class="ticket-num">01</span><p>Consent confirmed</p><button tabindex="-1">Start microphone</button></div><figcaption>Confirm consent before a caption starts.</figcaption></figure>
        <figure><div class="mini-screen dark"><span class="ticket-num">02</span><p><mark>Launch checklist</mark> is the first result.</p><span class="rail">●━━━━●</span></div><figcaption>Search moves to the first spoken match.</figcaption></figure>
        <figure><div class="mini-screen"><span class="ticket-num">03</span><p>6 captions · Markdown</p><button tabindex="-1">Export Markdown</button></div><figcaption>Export creates a timestamped local file.</figcaption></figure>
      </div>
    </section>

    <section class="limits-section ruled" aria-labelledby="limits-title">
      <div><p class="eyebrow">Clear boundaries</p><h2 id="limits-title">No meeting bot. No cloud recording.</h2></div>
      <ul>
        <li>Microphone captions start only after you confirm consent.</li>
        <li>Speaker names are notes, not biometric identification.</li>
        <li>System-audio loopback is not in this release.</li>
        <li>On-device speech support depends on your installed language pack.</li>
      </ul>
    </section>

    <section class="price-section" aria-labelledby="price-title">
      <div class="price-ticket"><p class="eyebrow">Permanent ticket</p><h2 id="price-title">Keep a longer tape for $29</h2><p>Free includes a 60-minute tape, search, and both exports. One purchase extends retention to four hours.</p><a class="button primary" href="${API}/checkout">Buy the one-time license</a><button class="button quiet" data-open-license>Have a license? Paste it</button><p class="fine-print">Sociobot is the merchant of record. Refunds revoke the license.</p></div>
      <div class="download-panel"><p class="eyebrow">Desktop release</p><h2>Install for your computer</h2><p>Desktop packages are unsigned while certificates are pending.</p><a class="button secondary" id="platform-download" href="https://github.com/B-Divyesh/sf-local-caption-tape/releases">Downloads are being published</a><p id="download-note" class="fine-print">Open the release page for available packages.</p></div>
    </section>
  </main>`);
}

function legal(kind: 'privacy' | 'terms'): string {
  const privacy = kind === 'privacy';
  const body = privacy ? `
    <p class="lede">Your captions belong on your device, not in our database.</p>
    <h2>What stays on your device</h2><p>Real transcripts are encrypted with a non-exportable device key. Demo transcripts stay in memory and disappear when you leave.</p>
    <h2>What leaves your device</h2><p>Caption audio is not sent to Local Caption Tape or Sociobot. A license check sends the license token to the Sociobot billing API at most once each day.</p>
    <h2>Files you export</h2><p>Exports go to the folder you choose. Local Caption Tape cannot read them after download.</p>
    <h2>Delete your data</h2><p>Use “Delete this tape” in the app. The retention timer also removes old captions.</p>
    <h2>Contact</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a> with privacy questions.</p>` : `
    <p class="lede">Use captions with consent and check important decisions against the speaker.</p>
    <h2>Consent comes first</h2><p>You must follow recording and caption laws where you live. Tell every participant before starting captions.</p>
    <h2>Caption accuracy</h2><p>Speech recognition can miss words. Speaker labels are manual notes and may be wrong.</p>
    <h2>Purchase</h2><p>The $29 license is a one-time purchase through Sociobot. Refunds follow the merchant terms and revoke the license.</p>
    <h2>No warranty</h2><p>The app is provided as-is under the MIT License. Do not use it as the only record for safety-critical decisions.</p>
    <h2>Contact</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a> for terms questions.</p>`;
  return pageShell(`<main id="main" class="legal-page"><p class="eyebrow">Effective 28 August 2026</p><h1 id="page-title" tabindex="-1">${privacy ? 'Privacy in plain words' : 'Terms for using the tape'}</h1>${body}</main>`, { active: kind });
}

function notFound(): string {
  return pageShell(`<main id="main" class="not-found"><div class="lost-line" aria-hidden="true">●━━━━━━╳</div><p class="eyebrow">End of the line · 404</p><h1 id="page-title" tabindex="-1">This stop is not on the tape</h1><p>The address may be old. Return to the first platform.</p><a class="button primary" href="/" data-link>Return home</a></main>`);
}

function appView(demo: boolean): string {
  return pageShell(`<main id="main" class="tape-page">
    <section class="tape-head">
      <div><p class="eyebrow">${demo ? 'Sample meeting · 02:01' : 'Private tape · microphone'}</p><h1 id="page-title" tabindex="-1">Keep spoken words within reach</h1><p>${demo ? 'Search this sample. Export it. Reset it at any time.' : 'Confirm consent, then start on-device microphone captions.'}</p></div>
      <div class="tape-status" id="tape-status" role="status"><span class="status-dot"></span><span>${demo ? 'Sample loaded' : 'Ready on this device'}</span></div>
    </section>
    <section class="tape-controls" aria-label="Tape controls">
      <div class="consent-block ${demo ? 'hidden' : ''}"><label><input id="consent" type="checkbox"> Everyone knows captions will run</label><button class="button primary" id="start-captions" disabled>Start microphone</button></div>
      <label class="search-box" for="search-tape">${icons.search}<span class="sr-only">Search captions</span><input id="search-tape" type="search" placeholder="Search this tape" autocomplete="off"><kbd>Ctrl K</kbd></label>
      <div class="export-buttons"><button class="button secondary" id="export-md">Export Markdown</button><button class="button quiet" id="export-txt">Export TXT</button></div>
    </section>
    <div class="app-window tape-window">
      <div class="window-bar"><span id="match-count">${demo ? '6 captions' : 'No captions yet'}</span><span id="retention-label">${demo ? 'Demo resets on request' : 'Deletes after 60 minutes'}</span></div>
      <div id="empty-state" class="empty-state ${demo ? 'hidden' : ''}"><span class="empty-symbol" aria-hidden="true">●━━━━</span><h2>Your captions will appear here</h2><p>Confirm consent and start the microphone. You can also type a caption below.</p><a class="text-link" href="/demo" data-link>Load sample meeting →</a></div>
      <ol class="caption-list" id="caption-list" aria-label="Transcript captions"></ol>
      <form id="manual-form" class="manual-entry"><label for="manual-caption">Add a caption by typing</label><div><input id="manual-caption" maxlength="280" placeholder="Type words you need to keep"><button class="button secondary">Add caption</button></div></form>
    </div>
    <aside class="local-note"><strong>Local speech check</strong><p id="speech-note">The app checks for an installed on-device language pack only when you start.</p></aside>
    <section class="danger-zone" aria-labelledby="delete-title"><div><h2 id="delete-title">Delete this tape</h2><p>This removes every unsaved caption on this device.</p></div><button class="button danger" id="delete-tape">Delete this tape</button></section>
  </main>`, { active: demo ? 'demo' : 'app', demo });
}

function secondsNow(startedAt: number): number {
  return Math.max(0, Math.round((Date.now() - startedAt) / 1000));
}

function tapeController(demo: boolean): () => void {
  let state: TapeState = { startedAt: demo ? Date.now() - 121_000 : Date.now(), captions: demo ? structuredClone(sampleCaptions) : [], retentionMinutes: hasPaidLicense() ? 240 : 60 };
  let recognition: SpeechRecognition | null = null;
  const list = document.querySelector<HTMLOListElement>('#caption-list')!;
  const search = document.querySelector<HTMLInputElement>('#search-tape')!;
  const empty = document.querySelector<HTMLElement>('#empty-state')!;
  const count = document.querySelector<HTMLElement>('#match-count')!;
  const status = document.querySelector<HTMLElement>('#tape-status')!;
  const speechNote = document.querySelector<HTMLElement>('#speech-note')!;
  const retentionLabel = document.querySelector<HTMLElement>('#retention-label')!;

  if (!demo) {
    retentionLabel.textContent = `Deletes after ${state.retentionMinutes === 240 ? '4 hours' : '60 minutes'}`;
    const token = localStorage.getItem(LICENSE_KEY);
    const cache = licenseCache();
    if (token && (!cache || Date.now() - cache.checkedAt > 86_400_000)) {
      void verifyLicense(token).then((valid) => {
        state.retentionMinutes = valid ? 240 : 60;
        retentionLabel.textContent = valid ? 'Deletes after 4 hours' : 'License inactive · deletes after 60 minutes';
        void persist();
      });
    }
  }

  const persist = async () => {
    if (!demo) await saveTape(state);
  };

  const expire = () => {
    const cutoff = secondsNow(state.startedAt) - state.retentionMinutes * 60;
    state.captions = state.captions.filter((caption) => caption.at >= cutoff);
  };

  const render = () => {
    expire();
    const query = search.value.trim().toLocaleLowerCase();
    const matching = state.captions.filter((caption) => caption.text.toLocaleLowerCase().includes(query));
    empty.classList.toggle('hidden', state.captions.length > 0);
    count.textContent = query ? `${matching.length} ${matching.length === 1 ? 'match' : 'matches'}` : `${state.captions.length} ${state.captions.length === 1 ? 'caption' : 'captions'}`;
    list.innerHTML = matching.map((caption) => {
      const safeText = escapeHtml(caption.text);
      const text = query ? safeText.replace(new RegExp(`(${escapeRegExp(escapeHtml(query))})`, 'ig'), '<mark>$1</mark>') : safeText;
      return `<li id="caption-${caption.id}" tabindex="-1"><time datetime="PT${caption.at}S">${timestamp(caption.at)}</time><div>${caption.speaker ? `<strong>${escapeHtml(caption.speaker)}${caption.uncertain ? ' <span class="uncertain">uncertain</span>' : ''}</strong>` : ''}<p>${text}</p></div></li>`;
    }).join('');
  };

  const add = (text: string) => {
    state.captions.push({ id: crypto.randomUUID(), at: secondsNow(state.startedAt), text });
    render();
    void persist();
  };

  if (!demo) {
    void loadTape().then((saved) => {
      if (saved) state = saved;
      render();
    }).catch(() => {
      speechNote.textContent = 'The encrypted tape could not open. Reload the app and try again.';
    });
  }
  render();

  search.addEventListener('input', render);
  search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      list.querySelector<HTMLElement>('li')?.focus({ preventScroll: false });
    }
  });
  document.addEventListener('keydown', focusSearch);
  document.querySelector('#export-md')?.addEventListener('click', () => downloadTranscript('md', state.captions));
  document.querySelector('#export-txt')?.addEventListener('click', () => downloadTranscript('txt', state.captions));
  document.querySelector<HTMLFormElement>('#manual-form')!.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.querySelector<HTMLInputElement>('#manual-caption')!;
    const text = input.value.trim();
    if (text) { add(text); input.value = ''; status.lastElementChild!.textContent = 'Caption added'; }
  });

  const consent = document.querySelector<HTMLInputElement>('#consent');
  const start = document.querySelector<HTMLButtonElement>('#start-captions');
  consent?.addEventListener('change', () => { if (start) start.disabled = !consent.checked; });
  start?.addEventListener('click', async () => {
    if (recognition) { recognition.stop(); recognition = null; start.textContent = 'Start microphone'; status.lastElementChild!.textContent = 'Captions stopped'; return; }
    start.disabled = true;
    const Constructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Constructor) {
      speechNote.textContent = 'On-device speech is unavailable here. Type captions below or install the desktop app on a supported system.';
      status.lastElementChild!.textContent = 'Speech pack unavailable';
      start.disabled = false;
      return;
    }
    try {
      const availability = Constructor.available ? await Constructor.available({ langs: ['en-US'], processLocally: true }) : 'unavailable';
      if (availability === 'downloadable' && Constructor.install) {
        speechNote.textContent = 'Installing the English on-device speech pack…';
        const installed = await Constructor.install({ langs: ['en-US'] });
        if (!installed) throw new Error('install-failed');
      } else if (!['available', 'downloadable'].includes(availability)) {
        throw new Error('not-local');
      }
      recognition = new Constructor();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.processLocally = true;
      recognition.onresult = (event) => {
        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          if (event.results[index].isFinal) add(event.results[index][0].transcript.trim());
        }
      };
      recognition.onerror = (event) => { speechNote.textContent = `Captions stopped because ${event.error.replaceAll('-', ' ')}. Check microphone access and start again.`; };
      recognition.onend = () => { recognition = null; start.textContent = 'Start microphone'; start.disabled = false; status.lastElementChild!.textContent = 'Captions stopped'; };
      recognition.start();
      start.textContent = 'Stop captions';
      status.lastElementChild!.textContent = 'Listening on this device';
      speechNote.textContent = 'English speech is processing on this device. Audio is not retained.';
    } catch {
      speechNote.textContent = 'No on-device English speech pack is available. Type captions below or install a supported language pack.';
      status.lastElementChild!.textContent = 'Speech pack unavailable';
    } finally { start.disabled = false; }
  });

  document.querySelector('#delete-tape')?.addEventListener('click', async () => {
    if (!confirm(`Delete all ${state.captions.length} captions from this tape?`)) return;
    state.captions = [];
    if (!demo) await clearTape();
    render();
    status.lastElementChild!.textContent = 'Tape deleted';
  });
  document.querySelector('[data-reset-demo]')?.addEventListener('click', () => {
    state = { startedAt: Date.now() - 121_000, captions: structuredClone(sampleCaptions), retentionMinutes: 60 };
    search.value = '';
    render();
    status.lastElementChild!.textContent = 'Demo reset';
  });

  const reportConnection = () => {
    if (!navigator.onLine) status.lastElementChild!.textContent = 'Offline · local tape ready';
  };
  addEventListener('offline', reportConnection);

  return () => { document.removeEventListener('keydown', focusSearch); removeEventListener('offline', reportConnection); recognition?.abort(); };

  function focusSearch(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'k') { event.preventDefault(); search.focus(); }
  }
}

function escapeHtml(value: string): string {
  const node = document.createElement('span'); node.textContent = value; return node.innerHTML;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function licenseCache(): LicenseState | null {
  try { return JSON.parse(localStorage.getItem(LICENSE_CACHE) || 'null') as LicenseState | null; }
  catch { return null; }
}

function hasPaidLicense(): boolean {
  const value = licenseCache();
  return Boolean(value?.valid && Date.now() - value.checkedAt < 86_400_000);
}

async function verifyLicense(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API}/verify?license=${encodeURIComponent(token)}`);
    const result = await response.json() as { valid: boolean };
    const value: LicenseState = { token, valid: result.valid, checkedAt: Date.now() };
    localStorage.setItem(LICENSE_CACHE, JSON.stringify(value));
    return result.valid;
  } catch { return false; }
}

function handleLicense(): void {
  const url = new URL(location.href);
  const incoming = url.searchParams.get('license');
  if (incoming) {
    localStorage.setItem(LICENSE_KEY, incoming);
    url.searchParams.delete('license');
    history.replaceState({}, '', url);
    void verifyLicense(incoming);
  }
  document.querySelector('[data-open-license]')?.addEventListener('click', () => {
    const token = prompt('Paste your Local Caption Tape license');
    if (token?.trim()) { localStorage.setItem(LICENSE_KEY, token.trim()); void verifyLicense(token.trim()); alert('License saved. The app will verify it in the background.'); }
  });
}

async function loadRelease(): Promise<void> {
  const link = document.querySelector<HTMLAnchorElement>('#platform-download');
  if (!link) return;
  const cached = localStorage.getItem('release:local-caption-tape');
  try {
    const value = cached ? JSON.parse(cached) as { at: number; data: GitHubRelease } : null;
    const data = value && Date.now() - value.at < 3_600_000 ? value.data : await fetch('https://api.github.com/repos/B-Divyesh/sf-local-caption-tape/releases?per_page=1').then(async (response) => {
      if (!response.ok) throw new Error('release lookup failed');
      const releases = await response.json() as GitHubRelease[];
      if (!releases[0]) throw new Error('no release');
      return releases[0];
    });
    localStorage.setItem('release:local-caption-tape', JSON.stringify({ at: Date.now(), data }));
    const wanted = navigator.userAgent.includes('Windows') ? /\.msi$|\.exe$/ : navigator.userAgent.includes('Mac') ? /\.dmg$/ : /\.AppImage$|\.deb$/;
    const asset = data.assets.find((item) => wanted.test(item.name));
    if (asset) { link.href = asset.browser_download_url; link.textContent = `Download ${asset.name}`; document.querySelector('#download-note')!.textContent = `Release ${data.tag_name} · ${(asset.size / 1_048_576).toFixed(1)} MB`; }
  } catch { /* Calm fallback is already rendered. */ }
}

type GitHubRelease = { tag_name: string; assets: Array<{ name: string; browser_download_url: string; size: number }> };

function route(push = false): void {
  cleanup?.();
  let path = location.pathname.replace(/\/$/, '') || '/';
  if (path === '/index.html') path = '/';
  if (path === '/') { app.innerHTML = landing(); document.title = 'Local Caption Tape — private meeting captions'; void loadRelease(); }
  else if (path === '/demo') { app.innerHTML = appView(true); document.title = 'Demo — Local Caption Tape'; cleanup = tapeController(true); }
  else if (path === '/app') { app.innerHTML = appView(false); document.title = 'Caption tape — Local Caption Tape'; cleanup = tapeController(false); }
  else if (path === '/privacy') { app.innerHTML = legal('privacy'); document.title = 'Privacy — Local Caption Tape'; }
  else if (path === '/terms') { app.innerHTML = legal('terms'); document.title = 'Terms — Local Caption Tape'; }
  else { app.innerHTML = notFound(); document.title = 'Not found — Local Caption Tape'; }
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = `https://local-caption-tape.sociobot.in${path === '/' ? '/' : path}`;
  bindLinks();
  handleLicense();
  if (push) {
    const h1 = document.querySelector<HTMLHeadingElement>('h1');
    h1?.focus();
    document.querySelector('.route-announcer')!.textContent = h1?.textContent || 'Page changed';
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
}

function bindLinks(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[data-link]').forEach((link) => link.addEventListener('click', (event) => {
    if (link.origin !== location.origin) return;
    event.preventDefault();
    history.pushState({}, '', link.href);
    route(true);
  }));
}

addEventListener('popstate', () => route(true));
if ('__TAURI_INTERNALS__' in window && location.pathname === '/') history.replaceState({}, '', '/app');
route();

if ('serviceWorker' in navigator && !('__TAURI_INTERNALS__' in window)) {
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}

export { asMarkdown, asText };
