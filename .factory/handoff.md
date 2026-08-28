# Local Caption Tape handoff

## Built

- Tauri 2 desktop shell with a Vite and TypeScript interface.
- Consent-gated microphone captions that require the browser or webview's on-device speech mode.
- AES-GCM encrypted rolling tape in IndexedDB with a non-exportable device key.
- Search, keyboard jump, typed caption fallback, deletion, and timestamped Markdown or TXT exports.
- One-click `/demo` with six bundled captions, in-memory isolation, reset, and offline reload.
- Art-deco transit-poster site, original generated artwork, responsive layout, privacy, terms, and a styled 404 route.
- $29 one-time Sociobot license purchase, restore, daily verification cache, and four-hour paid retention. Core search and exports remain free.
- GitHub Actions release matrix for macOS Intel and Apple Silicon, Windows, and Linux. It publishes Tauri bundles, `SHA256SUMS`, and `latest.json`.
- OS-aware download fallback plus checksum-verifying Linux and Windows install scripts.

## Verify

```sh
npm ci
npm test
npm run test:unit
npm run build:site
```

`npm test`: 21 passed, with one intentionally skipped duplicate desktop assertion. All eight `@claim` tests passed. Axe found no serious or critical issues across all routes on desktop and 390 px mobile.

`npm run test:unit`: 3 passed.

`npm run build:site`: passed. Output is `dist/site/index.html`. Initial assets are 8.63 KB JS gzip and 4.27 KB CSS gzip. The mobile hero is 28 KB WebP.

Production preview checks:

- Factory URL verifier: passed with zero console errors.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse metrics: LCP 2.1 s, CLS 0, total blocking time 0 ms.

The exact static deploy command is `npm run build:site`; deploy `dist/site`.

## Known gaps

- v0.1.0 captions microphone input only. System-audio loopback is stated as unavailable in the product and README.
- Local speech depends on an installed browser or OS language pack that implements `SpeechRecognition.processLocally`. The app refuses cloud speech and offers typed captions when that API is missing.
- Speaker labels in the sample are notes. The app does not perform biometric speaker identification.
- Local Rust compilation in the worker needs Linux WebKit and GTK development packages. The release workflow installs them before building.

## Needs operator action

- Register `local-caption-tape` and its $29 one-time price in the Sociobot billing system before launch.
- Push tag `v0.1.0`, let the release workflow finish, then verify one asset against `SHA256SUMS` and confirm `latest.json` URLs.
- Packages are unsigned. For macOS, wire `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, and `APPLE_TEAM_ID` into the workflow. For Windows, wire `WINDOWS_CERT_PFX` and `WINDOWS_CERT_PASSWORD`. No signing secrets belong in this repository.
- Add native system-audio capture and a bundled local transcription engine in a later release if system audio is required.
