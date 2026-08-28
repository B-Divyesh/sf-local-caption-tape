import type { Caption } from './types';

export const sampleCaptions: Caption[] = [
  { id: 's1', at: 0, speaker: 'Maya', text: 'Thanks for joining. Today we need to settle the launch checklist.' },
  { id: 's2', at: 18, speaker: 'Jon', text: 'The accessibility review is complete. Keyboard navigation passed.' },
  { id: 's3', at: 42, speaker: 'Maya', text: 'Please move the customer email to Tuesday morning.' },
  { id: 's4', at: 67, speaker: 'Speaker 2?', uncertain: true, text: 'I will check the Linux package before noon.' },
  { id: 's5', at: 93, speaker: 'Jon', text: 'Search for launch checklist if you need this decision later.' },
  { id: 's6', at: 121, speaker: 'Maya', text: 'The final decision is Tuesday at nine, after the package check.' }
];
