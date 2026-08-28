# Local Caption Tape visual thesis

## Direction

Local Caption Tape uses an **art-deco transit poster** language. A meeting becomes a line moving through time: each caption is a station, the live edge is the next arrival, and search takes you directly back to the right stop. The style fits a dependable local utility better than a glossy meeting-bot dashboard. It feels public-minded, legible, and calm under pressure.

## Palette

The default treatment is an ink-dark night platform with warm paper panels. The app also supports a paper-light treatment through `prefers-color-scheme`.

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| `--ink` | `#F7F0DC` | `#172B34` | primary text |
| `--muted` | `#C1B9A2` | `#52616A` | secondary text |
| `--ground` | `#102B34` | `#F4EEDC` | page background |
| `--surface` | `#173C46` | `#FFF9E8` | raised working surfaces |
| `--paper` | `#F4E6C1` | `#E9D8AC` | poster fields |
| `--coral` | `#F06A4E` | `#B93925` | primary action/live edge |
| `--gold` | `#F2C14E` | `#855D00` | focus and time markers |
| `--mint` | `#75C9B7` | `#167260` | ready/saved state |
| `--danger` | `#FF9C8C` | `#A52C1F` | destructive/error state |

All text pairs target WCAG AA. State always has a word or symbol as well as color.

## Type

- Display: `Arial Narrow`, `Aptos Narrow`, then condensed system fallbacks. Uppercase headings use measured tracking like enamel station signs.
- Body: `Inter`, `Aptos`, `Segoe UI`, and system sans-serif. System files avoid a font download and keep the first screen fast.
- Transcript timestamps use tabular figures. The transcript itself stays sentence case for fast reading.

## Spacing and shape

- Base unit: 8 px. Main rhythm: 8, 16, 24, 32, 48, 64, 96.
- Content measure: 68 characters. Transcript measure: 76 characters.
- Corners are clipped at 8 px, echoing punched paper tickets. Thin double rules and stepped borders replace generic soft cards.
- The timeline uses a single coral rail with gold station markers. Controls are rectangular, direct, and at least 44 px high.

## Interaction grammar

- The current caption arrives along the timeline from the live edge.
- Search marks matching caption stations and moves focus to the first result.
- Destructive actions name the exact scope and require confirmation. Export never does.
- Demo mode adds a persistent paper ticket strip. Its storage keys use the isolated `demo:lct:` prefix.

## Motion

Caption arrivals use one 220 ms translate-and-fade motion, like a train entering a platform. Route changes use a 160 ms opacity change. Nothing loops. With `prefers-reduced-motion: reduce`, both become instant state changes and smooth scrolling is disabled.

## Asset plan and provenance

- `public/art/caption-terminal.webp`: original generated poster scene for the landing hero and social card. It shows an abstract microphone, a time rail, and caption slips without interface text.
- UI icons, the wordmark, ticket cuts, and timeline geometry are hand-authored SVG/CSS in this repository.
- Generated imagery is decorative. Product claims appear only as live HTML text.

### Prompt sheet

Subject: an abstract tabletop microphone feeding a ribbon of short caption slips into a geometric transit timeline. World: a quiet late-night municipal station control room. Materials: screen-printed paper, enamel signs, brass edge lines, subtle ink grain. Light: warm pool of task light against deep petrol blue. Lens/composition: flat frontal poster, strong diagonal rail from lower left to upper right, large quiet negative area. Palette words: petrol blue, warm cream, signal coral, brass gold, sea-glass mint. Style: 1930s art-deco transit poster, crisp geometric forms, limited inks, tactile screen-print grain. Negative list: no people, no readable text, no letters, no logos, no brand marks, no gradients, no photorealism, no watermark, no fake user interface.

### Generation record

- Tool: `/opt/fleet/lib/gen-image.sh`, factory image deployment.
- Date: 2026-08-28.
- License/provenance: generated specifically for Local Caption Tape; no third-party source art.

