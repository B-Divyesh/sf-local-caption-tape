import { describe, expect, it } from 'vitest';
import { asMarkdown, asText, timestamp } from '../src/export';

const items = [{ id: '1', at: 65, speaker: 'Maya', text: 'Move it to Tuesday.' }];

describe('transcript exports', () => {
  it('formats stable timestamps', () => expect(timestamp(65)).toBe('01:05'));
  it('writes Markdown', () => expect(asMarkdown(items)).toContain('**01:05** — Maya'));
  it('writes text', () => expect(asText(items)).toContain('[01:05] Maya:'));
});
