# Verify searchable private meeting captions

## Verdict

**FAIL** — 2 findings; 1 untested public claim.

Candidate implementation: `44ff75f6166864792fe87b631435f87edbd1d36b` (`docs: record verified desktop release`).

Documentation baseline reviewed: `44ff75f6166864792fe87b631435f87edbd1d36b`. This report is a later report-only change; no product code was changed.

Live URL: <https://local-caption-tape.sociobot.in>

## Job, audience, and first action

- Job: find a spoken phrase from a recent meeting in a private caption tape.
- Audience: people who need live words to remain visible and searchable, including Deaf, hard-of-hearing, and attention-variable professionals.
- First action before scrolling: **Try it with sample data**. It says it opens a searchable two-minute meeting.

I checked this in fresh desktop and 390 px phone Chromium contexts. The first screen stated all three clearly and the action was visible without scrolling.

## Findings

1. **P1 — The advertised one-time purchase cannot be started.** The live **Buy the one-time license** link goes to `https://api.sociobot.in/api/v1/products/local-caption-tape/checkout`, which returned HTTP 404 with `{"error":"enabled factory product","status":404}` on 2026-09-05. This blocks purchase and license activation for the public $29 offer. The handoff already listed registration of the product as operator work; its current disposition is still pending, not resolved. The public purchase claim also has no entry in `.factory/claims.json` and no sandbox test for a successful eligible checkout, so it is counted as one untested public claim.

2. **P2 — Landing copy does not fully meet the plain-words contract.** The live first screen uses decorative or metaphor copy: “Private caption memory · Platform 01” and “Every spoken phrase becomes a stop you can return to.” The price section label “Permanent ticket” has the same issue. The assigned contract prohibits metaphor, mood labels, and product-lore labels. This is a copy-only issue, but it prevents a zero-finding PASS.

## What passed

- A separate clean clone at the candidate SHA installed with `npm ci` without vulnerabilities reported by npm.
- All ten declared claim commands passed individually from that clean clone:

  | Claim | Result |
  | --- | --- |
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

- Full browser suite: `npm test` — 23 passed, 1 intentional mobile-project skip.
- Unit suite: `npm run test:unit` — 3 passed.
- Static build: `npm run build` — passed; 8.61 kB gzip JavaScript and 4.28 kB gzip CSS.
- After installing the documented Linux GTK/WebKit prerequisites, `cargo check --locked --manifest-path src-tauri/Cargo.toml` passed.
- Live URL verifier passed: HTTP 200, no console errors, one title, `lang="en"`, one `main`, one `h1`, no images missing alt text, and no unlabeled buttons.
- Live `/demo` Axe WCAG 2 A/AA scan had no violations. The clean-clone browser suite also found no serious or critical Axe issue across `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the styled missing route on desktop and phone.
- The live landing page, demo, app, privacy, terms, robots, sitemap, and styled missing route loaded. The missing route intentionally rendered the product’s recovery page; it is not a defect.
- The one-click demo loaded six realistic captions, showed the persistent “Demo — Sample data. Nothing is saved.” bar, allowed a typed caption, and exposed Reset demo and Start for real. The sandbox isolation, reset, search, exports, offline reload, invalid local-speech fallback, retention boundaries, and encrypted real storage are covered by the passing claim suite.
- The documented system-audio gap is accurately stated on the landing page and README; no false system-audio claim was found. Unsigned-package status is also accurately disclosed.
- Release `v0.1.0` has macOS Intel/Apple Silicon, Windows, and Linux assets plus `SHA256SUMS` and valid `latest.json`. The downloaded `Local.Caption.Tape_0.1.0_amd64.deb` matched SHA-256 `1fb301220ade153891e976871d388fde7bce43c6404f2a95bbc45986b1e5487e`.
- In a clean Linux consumer data directory, the `.deb` installed successfully and `local-caption-tape` opened under Xvfb for eight seconds with no stderr. It created only its expected WebKit HSTS data at startup.

## Earlier findings and known gaps

No earlier standalone review or verification report exists in repository history. I inspected the earlier handoff records. Their release-asset, checksum, desktop-build, signing-disclosure, local-speech, and system-audio notes are either verified above or remain accurately disclosed. The earlier operator-action item to register the billing product remains unresolved and is finding 1.

## Recheck after repair

1. Register and enable the $29 Sociobot product, then verify checkout reaches the hosted flow and add a recorded sandbox claim test for that public purchase path.
2. Replace the three decorative phrases with direct labels, then rerun the copy audit and the command set above.
3. Re-run this verification. PASS requires zero findings and zero untested public claims.
