export type Caption = {
  id: string;
  at: number;
  text: string;
  speaker?: string;
  uncertain?: boolean;
};

export type TapeState = {
  startedAt: number;
  captions: Caption[];
  retentionMinutes: number;
};

export type LicenseState = {
  token: string;
  valid: boolean;
  checkedAt: number;
};

declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    processLocally?: boolean;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: { error: string }) => void) | null;
    onend: (() => void) | null;
  }

  interface SpeechRecognitionConstructor {
    new (): SpeechRecognition;
    available?: (options: { langs: string[]; processLocally: boolean }) => Promise<string>;
    install?: (options: { langs: string[] }) => Promise<boolean>;
  }

  const SpeechRecognition: SpeechRecognitionConstructor;

  interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
  }
}

export {};
