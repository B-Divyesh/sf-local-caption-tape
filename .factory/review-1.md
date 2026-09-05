# Review searchable private meeting captions

## Verdict

**PASS** — 0 findings; 0 untested public claims.

Candidate implementation reviewed: `1a3836409184033ffebd362c24b0f219d340d8e6` (`fix: serialize encrypted tape deletion`).

Documentation and verification baseline reviewed: `264b3b9bc23dbe10aab39464c0482dd696427648` (`test: record second independent verification`). The changes after the implementation candidate are claims, test, handoff, and verification documentation only; no later product source was treated as a new implementation.

Live URL: <https://local-caption-tape.sociobot.in>

## Job, audience, and first action

- Job: find what a recent meeting said in a private, searchable caption tape.
- Audience: people who need live words to remain visible and searchable, including Deaf, hard-of-hearing, and attention-variable professionals.
- First action before scrolling: **Try it with sample data**. It says that it opens a searchable two-minute meeting.

Fresh Chromium desktop (1440 × 900) and phone (390 × 844) contexts both showed the headline, audience sentence, and action above the fold. The action loaded six realistic sample captions. The persistent **Demo — Sample data. Nothing is saved.** label, search result, typed-caption path, Reset demo, and Start for real path worked in both contexts. Reset restored six captions, and Start for real opened an empty real tape; the sample change did not carry over.

## Claim verification

After `npm ci`, I ran every command declared in `.factory/claims.json` separately. All 12 passed.

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

The commands prove the observable checkout redirect and offer, sample search and exports, sandbox isolation, no off-origin sample-caption requests, encrypted real storage, no retained audio object, on-device speech enforcement, offline reload, both retention boundaries, returned-license handling, and immediate delete/reload persistence. I also cross-checked public landing and README claims against this list; no unlisted claim was found.

## Local and release checks

```text
npm ci                                      PASS (0 vulnerabilities)
npm test                                    PASS (34 passed, 1 intentional duplicate-project skip)
npm run test:unit                           PASS (3 tests)
npm run build:site                          PASS
cargo check --locked --manifest-path src-tauri/Cargo.toml  PASS
```

The static build is 9.14 kB gzip JavaScript and 4.45 kB gzip CSS. The first Tauri check correctly identified that the disposable container lacked its GTK/WebKit development prerequisites. After installing the normal Tauri Linux prerequisites (`libwebkit2gtk-4.1-dev`, GTK/app-indicator/SVG development packages, and `patchelf`), the documented `cargo check` passed.

Release `v0.1.2` is published with macOS Apple Silicon and Intel DMGs, Windows MSI and EXE, Linux AppImage, DEB, and RPM, plus `SHA256SUMS` and `latest.json`. The downloaded `Local.Caption.Tape_0.1.2_amd64.deb` matched `SHA256SUMS`, identified as `local-caption-tape` version `0.1.2` for `amd64`, installed successfully, and ran under Xvfb for eight seconds with isolated XDG directories and zero stderr. The timeout exit was expected because the review stopped the running GUI process.

## Live checks

- Fresh desktop and phone scans of `/`, `/demo`, `/app`, `/privacy`, `/terms`, and `/missing-stop` all returned a rendered page with the correct route title, one `main`, one `h1`, no page or console errors, and no serious or critical Axe issue.
- `/missing-stop` deliberately renders the styled **Page not found** recovery screen. It is an expected SPA fallback, not a broken page.
- The direct live link crawl found all internal routes at HTTP 200. The AppImage is an explicit GitHub release download redirect, checkout is an explicit Dodo redirect, and the two contact links are `mailto:` links.
- Live headers include a matching CSP with `frame-ancestors` as a response header, `nosniff`, strict referrer policy, and a same-origin microphone permission policy. `robots.txt` and `sitemap.xml` are present.
- Current Live checkout returned HTTP 303 to `checkout.dodopayments.com`, whose page returned HTTP 200 and included Local Caption Tape at $29. Current Test checkout returned HTTP 303 to `test.checkout.dodopayments.com`, whose page returned HTTP 200 and included the registered Local Caption Tape Four-Hour License at $29. The current live verification endpoint returned HTTP 200 with `valid: false` and `reason: "invalid"` for an unknown token, as required. No token is recorded here.
- The paid-retention claim re-exercised return-token capture, URL removal, billing verification request shape, cached entitlement recovery, and the four-hour boundary with a recorded verification response. The previous real Test purchase/valid-license evidence remains in the handoff; this review did not create or retain another license token.

## Earlier findings and current disposition

`.factory/verification-1.md` recorded two findings and one untested claim:

1. The checkout was unregistered. **Resolved:** the current Live and Test routes reach their correct Dodo hosts and show the registered $29 offer; `checkout-available` is now a declared passing claim.
2. The page used decorative copy. **Resolved:** current first-screen and price labels are direct plain words. The current copy audit has no prohibited mood labels or product lore.

`.factory/verification-2.md` was a zero-finding PASS. Its prior checks of reset, privacy, keyboard, reduced motion, legal pages, missing route, release checksum, installation, and launch were independently repeated or revalidated above. Remaining limitations—unsigned packages, microphone-only input, browser/OS-local speech availability, and manual speaker labels—are accurately disclosed rather than claimed as delivered features.

## Evidence conclusion

The current live product and the reviewed implementation meet the private, searchable meeting-caption job with a usable free path, a separate one-click sample, a working registered paid license route, and a verified desktop artifact. This review has zero findings at every severity and zero untested public claims.
