import type { Caption } from './types';

export function timestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const rest = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${rest}`;
}

export function asMarkdown(captions: Caption[]): string {
  const rows = captions.map((item) => `- **${timestamp(item.at)}**${item.speaker ? ` — ${item.speaker}` : ''}: ${item.text}`);
  return `# Meeting transcript\n\n${rows.join('\n')}\n`;
}

export function asText(captions: Caption[]): string {
  return captions.map((item) => `[${timestamp(item.at)}]${item.speaker ? ` ${item.speaker}:` : ''} ${item.text}`).join('\n') + '\n';
}

export function downloadTranscript(format: 'md' | 'txt', captions: Caption[]): void {
  const body = format === 'md' ? asMarkdown(captions) : asText(captions);
  const url = URL.createObjectURL(new Blob([body], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `caption-tape.${format}`;
  link.click();
  URL.revokeObjectURL(url);
}
