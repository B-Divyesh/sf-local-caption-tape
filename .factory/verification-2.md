# Verify private, searchable meeting captions

## Verdict

**PASS** — 0 findings; 0 untested public claims.

Candidate implementation reviewed: `1a3836409184033ffebd362c24b0f219d340d8e6`.

Documentation and prior-handoff baseline reviewed: `55a0c64c4b0da8cae4e7f53743afb7c15571a448`.

Live URL: <https://local-caption-tape.sociobot.in>

## Job, audience, and first action

- Job: find a spoken phrase from a recent meeting in a private caption tape.
- Audience: Deaf, hard-of-hearing, and attention-variable professionals who need live words to remain visible and searchable without a meeting bot.
- First action before scrolling: **Try it with sample data**. It states that it opens a searchable two-minute meeting.

Fresh Chromium desktop (1440 × 900) and phone (390 × 844) contexts both showed that job, audience, and action in the first screen. The landing title was `Local Caption Tape — private meeting captions`; it has one `h1` and one `main`.

## Claim verification

I ran every command declared in `.factory/claims.json` after `npm ci`. All 12 passed individually.

| Claim | Result |
| --- | --- |
| `checkout-available` | PASS |
| `search-phrase` | PASS |
| `timestamped-export` | PASS |
| `demo-isolated` | PASS |
| `private-network` | PASS |
| `encrypted-tape` | PASS |
| `transcript-only` | PASS |
| `local-speech` | PASS |
| `offline-reload` | PASS |
| `free-retention` | PASS |
| `paid-retention` | PASS |
| `delete-tape` | PASS |

The command set covers checkout availability, search, both exported formats, demo isolation and local-only network behavior, encrypted transcript storage, no audio retention, on-device speech enforcement, offline reload, 60-minute and four-hour retention boundaries, and immediate delete/reload persistence. I cross-checked the landing page and README claims against this list; no unlisted public claim was found.

## Local quality checks

```text
npm ci                                      PASS (0 vulnerabilities)
npm test                                    PASS (34 passed, 1 deliberate mobile-project skip)
npm run test:unit                           PASS (3 tests)
npm run build:site                          PASS
cargo check --locked --manifest-path src-tauri/Cargo.toml  PASS
```

The static build emits 9.14 kB gzip JavaScript and 4.45 kB gzip CSS. The Tauri check passed after installing the normal Linux GTK/WebKit development prerequisites in this disposable verifier environment.

## Live browser checks

- `/`, `/demo`, `/app`, `/privacy`, `/terms`, and `/missing-stop` loaded with their route-specific titles, one `h1`, one `main`, no browser console or page errors, and no serious or critical Axe findings.
- The missing route deliberately presents the styled **Page not found** recovery screen and a Return home action; it is not a broken page.
- On desktop and phone, `/demo` opened with six realistic captions; searching `Tuesday` produced two matches. The persistent **Demo — Sample data. Nothing is saved.** label, Reset demo, and Start for real were present. Reset restored the six-caption sample. The isolated-storage and no-external-request behavior are additionally proved by their passing claim tests.
- Keyboard skip navigation moved focus to `main`; the full suite covers visible restore-field focus and reduced-motion behavior. The live phone view had no serious/critical Axe issue.
- A fresh real app context exercised the missing on-device speech recovery path, typed-caption addition, destructive delete confirmation, and reload persistence. The automated offline-reload claim passed from its own fresh browser context.
- All discovered internal links returned HTTP 200; the checkout and release-asset links resolved successfully, and the two contact links are explicit `mailto:` links. Live headers include CSP, `nosniff`, strict referrer policy, and a same-origin microphone permission policy.

## Checkout and license checks

- The live checkout endpoint currently returns HTTP 303 to `checkout.dodopayments.com`. The declared live claim followed it and received HTTP 200 with **Local Caption Tape** and **$29**.
- The registered test endpoint currently returns HTTP 303 to `test.checkout.dodopayments.com`; its hosted page returned HTTP 200 and displayed **Local Caption Tape Four-Hour License**, **$29.00**, and **One-time license**.
- The current live verification endpoint returned HTTP 200 for an unknown token with `{ "valid": false, "reason": "invalid" }`, as expected. No token is recorded in this report.
- The paid-retention claim also proves return-token capture, URL removal, correct verification-request shape, and the four-hour boundary against a recorded verification fixture. The prior repair handoff and the controller record document the successful test purchase and valid-license result; I did not create another payment or record an entitlement token during this independent check.

## Desktop release check

GitHub Release `v0.1.2` has macOS Apple Silicon and Intel DMGs, Windows MSI and EXE, and Linux AppImage, DEB, and RPM assets, plus `SHA256SUMS` and valid `latest.json` platform metadata.

I downloaded `Local.Caption.Tape_0.1.2_amd64.deb`; its SHA-256 matched the release `SHA256SUMS`. It identified as package `local-caption-tape`, version `0.1.2`, architecture `amd64`, installed successfully, and ran under Xvfb for eight seconds with isolated XDG config/data/cache directories and zero stderr. The timeout exit (`124`) was expected because the verifier ended the running GUI process.

## Earlier findings and known gaps

The only earlier independent report, `.factory/verification-1.md`, found a missing checkout registration and prohibited decorative copy. Both are resolved:

1. The $29 checkout is registered in Live and Test and currently reaches the corresponding Dodo hosted checkout. Its dedicated claim is now declared and passes.
2. The landing now says **Private meeting captions**, **Search the words while people speak**, **Three steps**, and **One-time license**. The copy audit records no banned terms, mood labels, or decorative product lore.

Packages remain unsigned, and v0.1.2 captions microphone input only. Both limits are accurately disclosed on the landing page and in the README; they are known product limitations, not false public claims.

## Evidence conclusion

This candidate meets the researched job with a usable real path and an isolated one-click sample. All declared claims were exercised, with no remaining severity finding and no untested public claim.
