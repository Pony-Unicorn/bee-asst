import type { NextRequest } from 'next/server';
import type { KVNamespace } from '@cloudflare/workers-types';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  switch (req.method) {
    case 'GET': {
      const { searchParams } = new URL(req.url);
      const user = searchParams.get('user');
      if (!user) {
        return new Response(JSON.stringify({ error: { message: 'Missing required parameter: user.' } }), {
          status: 400,
        });
      } else {
        return await getBookmark(user);
      }
    }
    case 'POST': {
      const jsonData = await req.json<{ user: string; data: any }>();
      return await saveBookmark(jsonData?.user, JSON.stringify(jsonData?.data));
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
const saveBookmark = async (userUnique: string, data: string) => {
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
