import type { NextRequest } from 'next/server';
import type { KVNamespace } from '@cloudflare/workers-types';

import jwt from '@tsndr/cloudflare-worker-jwt';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const Authorization = req.headers.get('Authorization') || '';

  const [scheme, encoded] = Authorization.split(' ');

  if (!encoded || scheme !== 'Bearer') {
    return new Response(JSON.stringify({ error: { message: 'Malformed authorization header.' } }), {
      status: 400,
    });
  }

  const isValid = await jwt.verify(encoded, process.env.JWT_SECRET as string);

  if (!isValid) {
    return Response.redirect('/login');
  }

  // Decoding token
  const { payload } = jwt.decode(encoded);

  switch (req.method) {
    case 'GET': {
      return await getBookmark(payload.name);
    }
    case 'POST': {
      const jsonData = await req.json<{ data: any }>();
      return await saveBookmark(payload.name, jsonData?.data);
    }
    default:
      return new Response(JSON.stringify({ error: { message: 'Method not allowed.' } }), {
        status: 405,
      });
  }
}

// 获取书签 get
const getBookmark = async (userUnique: string) => {
  const BEE_ASST_STORAGE = process.env.BEE_ASST_STORAGE as unknown as KVNamespace;
  const bookmark = await BEE_ASST_STORAGE.get(`bookmark:${userUnique}`);

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
const saveBookmark = async (userUnique: string, data: any) => {
  const BEE_ASST_STORAGE = process.env.BEE_ASST_STORAGE as unknown as KVNamespace;
  await BEE_ASST_STORAGE.put(`bookmark:${userUnique}`, data);

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
