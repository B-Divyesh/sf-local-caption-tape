# Demo sandbox

## Entry point

- Hosted: `https://local-caption-tape.sociobot.in/demo`
- Local: run `npm run dev`, then open `http://localhost:4173/demo`

The first-screen “Try it with sample data” link reaches the demo in one click. The persistent banner identifies demo mode.

## Sample data

The bundled meeting has six captions over two minutes. Maya and Jon discuss a launch checklist, an accessibility review, a Linux package check, and a Tuesday decision. One speaker label is marked uncertain.

Try these checks:

1. Search for `Tuesday` to show two matches.
2. Export Markdown and TXT to inspect timestamps.
3. Add a typed caption.
4. Select “Reset demo” to restore the six bundled captions.
5. Select “Start for real” to leave the sandbox.

## Isolation

Demo transcript state lives only in page memory. It does not open or write the `local-caption-tape` IndexedDB database. Demo preferences would use the reserved `demo:lct:` localStorage prefix; v0.1.0 has no persisted demo preferences. Leaving or reloading the demo discards changes.

The automated test `@claim:demo-isolated` checks both storage systems from a fresh browser context.
