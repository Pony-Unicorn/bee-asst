import type { NextRequest } from 'next/server';

import pako from 'pako';

import { BEE_ASST_STORAGE_GET } from '../../../libs/wrapKV';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const bookmark = await BEE_ASST_STORAGE_GET(`bookmark:pony`);

  const result = pako.gzip(bookmark as string);

  const a = pako.ungzip(result, { to: 'string' });

  return new Response(
    JSON.stringify({
      code: 0,
      data: {
        bookmark: a,
        readTime: Date.now(),
      },
      msg: 'Success',
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
}
