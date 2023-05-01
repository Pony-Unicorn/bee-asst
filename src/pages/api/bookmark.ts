import type { NextRequest } from 'next/server';

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
      const jsonData = await req.json<{ user: string; data: ArrayBuffer }>();
      return await saveBookmark(jsonData?.user, jsonData?.data);
    }
    default:
      return new Response(JSON.stringify({ error: { message: 'Method not allowed.' } }), {
        status: 405,
      });
  }
}

// 登陆

// 获取书签 get
const getBookmark = async (userUnique: string) => {
  // const bookmark = await BEE_ASST_STORAGE.get(`bookmark:${userUnique}`);

  return new Response(
    JSON.stringify({
      data: userUnique,
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
const saveBookmark = async (userUnique: string, data: ArrayBuffer) => {
  await BEE_ASST_STORAGE.put(`bookmark:${userUnique}`, data);

  return new Response(
    JSON.stringify({
      message: 'Hello, world!',
    }),
    {
      status: 201,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
};
