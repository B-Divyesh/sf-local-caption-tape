# Local Caption Tape

Find what your meeting just said, without sending its transcript to a meeting bot.

Local Caption Tape is for Deaf, hard-of-hearing, and attention-variable professionals. It keeps a rolling, searchable caption tape on the user’s device. Users can export timestamped Markdown or TXT when they choose.

Try the isolated sample at `https://local-caption-tape.sociobot.in/demo`.

## What works

- Search live or typed captions without stopping the tape.
- Export timestamped Markdown and TXT files.
- Encrypt real transcripts with a non-exportable device key.
- Reload the sample offline after the first visit.
- Use microphone speech only when an on-device language pack is available.
- Delete captions after 60 minutes on the free tier.
- Buy a $29 one-time license through the hosted Sociobot checkout.
- Extend the rolling tape to four hours after the license verifies.

The app does not join meetings or retain audio. Speaker labels are manual notes and may be wrong. System-audio loopback is not in v0.1.0.

## Run the web app

Requirements: Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open `http://localhost:4173/demo` for the isolated sample or `/app` for real local storage.

## Build and test

```sh
npm ci
npm test
npm run test:unit
npm run build:site
```

The exact static deploy command is `npm run build:site`. Its output lands in `dist/site`, with `dist/site/index.html` at the root.

To check the Tauri shell on a machine with Tauri’s system dependencies:

```sh
npm run tauri dev
npm run tauri build
```

## Desktop releases

The tag workflow builds unsigned packages for macOS Intel and Apple Silicon, Windows, and Linux. The landing page reads the latest release through the GitHub API and selects the visitor’s platform. It falls back to the release page when metadata is unavailable.

macOS and Windows builds remain unsigned until the operator adds signing certificates. Review the release notes before opening an unsigned package.

## Data and licensing

Real transcripts use AES-GCM encryption in IndexedDB. The encryption key is non-exportable and stored by the browser or webview. Demo captions stay in memory and never read real transcript storage.

The optional one-time license uses the Sociobot billing API. The hosted checkout returns the license to the app. The app removes it from the URL, stores it under `sb_license:local-caption-tape`, and verifies it. A cached verdict prevents more than one verification request per day. You can also enter an existing license on the landing page.

See [privacy](https://local-caption-tape.sociobot.in/privacy) and [terms](https://local-caption-tape.sociobot.in/terms).

## Project map

- `src/` — TypeScript app, encrypted storage, search, export, and routes
- `src-tauri/` — Tauri 2 desktop shell and bundle metadata
- `public/` — static metadata, service worker, artwork, and install helpers
- `tests/` — Playwright claim and accessibility checks plus export unit tests
- `.factory/` — brief, visual system, claims, demo guide, copy audit, and handoff

## License

MIT. See `LICENSE`.
