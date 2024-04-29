// src/nostr.d.ts

export {};

declare global {
  interface Window {
    nostr?: {
      getPublicKey: () => Promise<string>;
      signEvent: (event: {
        created_at: number;
        kind: number;
        tags: string[][];
        content: string;
      }) => Promise<{ id: string; pubkey: string; sig: string }>;
    };
  }
}
