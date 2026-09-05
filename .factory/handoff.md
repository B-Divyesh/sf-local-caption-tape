# Local Caption Tape handoff

## Repair outcome

Implementation SHA: `1a3836409184033ffebd362c24b0f219d340d8e6`.

This handoff is a report-only successor to that deployed implementation.

- The registered live $29 offer now opens correctly. The public endpoint returns HTTP 303 to `checkout.dodopayments.com`, and the hosted checkout returns HTTP 200 with Local Caption Tape Four-Hour License at $29.
- A real test-mode purchase returned to the product, issued a license, removed it from the browser URL, and returned `{ valid: true, reason: "ok" }` from the test verification endpoint. No license token is recorded in this repository or report. No live charge was made.
- Checkout returns are consumed before app initialization. A verified license now applies four-hour retention without a reload.
- Restore purchase now uses a labeled inline field. Invalid licenses stay on the useful free tier, revoked licenses show a buy link, and a cached valid verdict remains available if a daily refresh cannot connect.
- Paid retention is recomputed after encrypted transcript load, so a saved free state cannot overwrite a verified entitlement.
- The landing, app, and 404 copy now use direct labels. The reported platform, stop, and ticket metaphors are gone. `.factory/copy-audit.md` records the revised words and counts.
- Encrypted writes and deletion are serialized. An immediate delete can no longer race an in-flight save and restore captions after reload.
- The expanded license form exposed a light-theme skip-link contrast failure. The repaired state passes Axe and keeps keyboard focus visible.
- Billing metadata is in `.factory/billing-offer.json`. The required copies are at `/work/.evidence/billing-offer.json` and `/work/.evidence/catalog-description.txt`.

## Product delivered

- Tauri 2 desktop shell with consent-gated, on-device microphone captions.
- AES-GCM encrypted rolling transcript in IndexedDB with a non-exportable device key.
- Search, keyboard jump, typed caption fallback, deletion, and timestamped Markdown or TXT exports.
- One-click `/demo` with six bundled captions, memory-only isolation, reset, and offline reload.
- $29 one-time Sociobot license for four-hour retention. The free 60-minute tape, search, deletion, and exports remain available.
- Responsive landing, privacy, terms, and styled missing route with the product-specific art-deco visual system.
- GitHub release workflow for macOS Intel and Apple Silicon, Windows, and Linux.

## Clean verification

From a fresh clone of the implementation:

```sh
npm ci
npm test
npm run test:unit
npm run build:site
cargo check --locked --manifest-path src-tauri/Cargo.toml
```

- All 12 commands declared in `.factory/claims.json` pass individually.
- `npm test`: 34 passed and one expected duplicate-project test skipped.
- `npm run test:unit`: 3 passed.
- `npm run build:site`: passed. Initial JavaScript is 9.14 KB gzip and CSS is 4.45 KB gzip. The mobile hero is 28 KB WebP.
- `cargo check --locked`: passed after installing the documented WebKit, GTK, app-indicator, SVG, and `patchelf` packages.
- Axe found no serious or critical issue across `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the missing route on desktop and 390 px phone viewports. Expanded restore, keyboard skip navigation, and reduced motion have regression coverage.

## Live verification

- Deployed implementation: `1a3836409184033ffebd362c24b0f219d340d8e6`.
- Factory URL verifier: HTTP 200, one title, `lang="en"`, one `h1`, one `main`, no missing alt text, no unlabeled buttons, and no console errors.
- Fresh desktop and phone contexts showed the job, audience, and **Try it with sample data** action before scrolling.
- Both contexts loaded six sample captions, found two “Tuesday” matches, showed the persistent demo label, reset to six captions, and kept sample changes out of real storage.
- Live delete, reload, offline reload, route titles, legal pages, missing route, security headers, and all 14 crawled links passed.
- The live invalid-license endpoint returned HTTP 200 with `valid: false` and `reason: "invalid"`.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100. LCP 1.4 s, CLS 0, total blocking time 30 ms, total transfer 143 KiB.
- Evidence screenshots and reports are under `/work/.evidence/local-caption-tape-repair-1/final`.

## Desktop release

Release `v0.1.2` completed successfully on all four GitHub Actions builders. It includes macOS Intel and Apple Silicon DMGs, Windows MSI and EXE, Linux AppImage, DEB, and RPM files, `SHA256SUMS`, and a valid `latest.json`.

The downloaded `Local.Caption.Tape_0.1.2_amd64.deb` matched SHA-256 `dc07b2a1e31ef0127f27da5f05c3bd58c2045e8cf69f39cba16a0137c37a496f`. It installed as version 0.1.2 and launched under Xvfb for eight seconds with isolated XDG directories and zero stderr. The live detected-platform button resolves to the v0.1.2 AppImage.

## Known gaps

- v0.1.2 captions microphone input only. System-audio loopback is stated as unavailable on the landing page and in the README.
- Local speech depends on an installed browser or OS language pack that implements `SpeechRecognition.processLocally`. The app refuses cloud speech and offers typed captions when that API is missing.
- Speaker labels in the sample are notes. The app does not perform biometric speaker identification.
- A real test-mode purchase was verified. A live $29 transaction was intentionally not charged during repair.

## Needs operator action

- Packages are unsigned. Add the documented Apple and Windows signing secrets to the release workflow when certificates are available. No signing secret belongs in this repository.
- Add native system-audio capture and a bundled local transcription engine in a later release if system audio is required.

## Independent verification 2

Verification report: `.factory/verification-2.md`.

- Verdict: **PASS** — zero findings and zero untested public claims.
- Candidate implementation reviewed: `1a3836409184033ffebd362c24b0f219d340d8e6`.
- Documentation/handoff commit: `55a0c64c4b0da8cae4e7f53743afb7c15571a448`.
- Re-ran all 12 declared claim commands, the full browser suite (34 passed; one deliberate mobile-project skip), unit tests (3 passed), static build, and Tauri `cargo check` with Linux prerequisites installed.
- Fresh live desktop and 390 px phone contexts passed the first-screen, demo, reset, routes, legal pages, links, console, focus, reduced-motion, Axe, and missing-route checks.
- Rechecked both current hosted checkout endpoints: Live redirects to Dodo and Test displays the registered $29 Local Caption Tape Four-Hour License. The live verifier rejects an unknown token as expected; no token was recorded. The earlier successful Test purchase/valid-license evidence remains accurately documented above.
- Release `v0.1.2` asset metadata and Linux DEB checksum passed. The DEB installed and launched under Xvfb using isolated consumer directories with zero stderr.
