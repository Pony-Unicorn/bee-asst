import type { NextRequest } from 'next/server';
// import type { KVNamespace } from '@cloudflare/workers-types';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  switch (req.method) {
    case 'POST': {
      const jsonData = await req.json<{ user: string; password: string }>();
      return await login(jsonData?.user, jsonData?.password);
    }
    case 'DELETE': {
      return await logout();
    }
    default:
      return new Response(JSON.stringify({ error: { message: 'Method not allowed.' } }), {
        status: 405,
      });
  }
}

// 登陆
const login = async (userUnique: string, psw: string) => {
  return new Response(
    JSON.stringify({
      data: 'Hello',
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
};

// 登出
const logout = async () => {
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
