import type { NextRequest } from 'next/server';
import jwt from '@tsndr/cloudflare-worker-jwt';
import pako from 'pako';

import { BEE_ASST_STORAGE_GET, BEE_ASST_STORAGE_PUT } from '../../../libs/wrapKV';

export const config = {
  runtime: 'edge',
};

const bookmarkDefault = {
  metadata: { version: '0.0.0', inc: 0, lastUpdateTime: 0 },
  comboTagSet: {},
  tagSetOrder: [],
  items: {},
  tagSet: {},
};

type ISubmitData = { bookmark: string; lastReadTime: number };

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
      return await saveBookmark(payload.name, await req.json());
    }
    default:
      return new Response(JSON.stringify({ error: { message: 'Method not allowed.' } }), {
        status: 405,
      });
  }
}

// 获取书签 get
const getBookmark = async (userUnique: string) => {
  const bookmark = await BEE_ASST_STORAGE_GET(`bookmark:${userUnique}`, true);

  return new Response(
    JSON.stringify({
      code: 0,
      data: {
        bookmark: bookmark ? JSON.parse(pako.ungzip(bookmark as ArrayBuffer, { to: 'string' })) : bookmarkDefault,
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
};

// 保存书签 post
const saveBookmark = async (userUnique: string, data: ISubmitData) => {
  const bookmark = await BEE_ASST_STORAGE_GET(`bookmark:${userUnique}`, true);

  const bookmarkStr = pako.ungzip(bookmark as ArrayBuffer, { to: 'string' });

  const bookmarkData = JSON.parse(bookmarkStr);

  if (data.lastReadTime < bookmarkData.metadata.lastUpdateTime) {
    return new Response(
      JSON.stringify({
        code: -1,
        msg: 'Fail! Please update the data',
      }),
      {
        status: 409,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }

  await BEE_ASST_STORAGE_PUT(`bookmark:${userUnique}`, pako.gzip(data.bookmark));

  return new Response(
    JSON.stringify({
      code: 0,
      data: {
        readTime: Date.now(),
      },
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
