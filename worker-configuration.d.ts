import type { KVNamespace } from '@cloudflare/workers-types';

declare global {
  const BEE_ASST_STORAGE: KVNamespace;
}

export {};
