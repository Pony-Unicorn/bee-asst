import type { NextRequest } from 'next/server';
import type { KVNamespace } from '@cloudflare/workers-types';

import jwt from '@tsndr/cloudflare-worker-jwt';

import { BEE_ASST_STORAGE_GET, BEE_ASST_STORAGE_PUT } from '../../../libs/wrapKV';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const Authorization = req.headers.get('Authorization') || '';

  const [scheme, encoded] = Authorization.split(' ');

  if (scheme !== 'Bearer' || !encoded) {
    return Response.redirect(`${new URL(req.url).origin}/login`, 302);
  }

  const isValid = await jwt.verify(encoded, process.env.JWT_SECRET as string);

  if (!isValid) {
    return Response.redirect(`${new URL(req.url).origin}/login`, 302);
  }

  // Decoding token
  const { payload } = jwt.decode(encoded);

  switch (req.method) {
    case 'GET': {
      return await getBookmark(payload.name);
    }
    case 'POST': {
      return await saveBookmark(payload.name, await req.text());
    }
    default:
      return new Response(JSON.stringify({ error: { message: 'Method not allowed.' } }), {
        status: 405,
      });
  }
}

// 获取书签 get
const getBookmark = async (userUnique: string) => {
  const bookmark = await BEE_ASST_STORAGE_GET(`bookmark:${userUnique}`);
  return new Response(
    JSON.stringify({
      data: bookmark,
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
};

// 保存书签 post
const saveBookmark = async (userUnique: string, data: string) => {
  await BEE_ASST_STORAGE_PUT(`bookmark:${userUnique}`, data);

  return new Response(
    JSON.stringify({
      code: 0,
      msg: 'Success!',
    }),
    {
      status: 201,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
};
