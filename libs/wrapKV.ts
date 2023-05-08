import type { KVNamespace } from '@cloudflare/workers-types';

const isAPI = Boolean(process.env.WORKERS_KV_USE_API);
const account_identifier = process.env.CF_ACCOUNT_IDENTIFIER;
const namespace_identifier = process.env.CF_NAMESPACE_IDENTIFIER;
const cf_bearer = process.env.CF_BEARER;

export const BEE_ASST_STORAGE_GET = async (keyName: string, isArrayBuffer = false) => {
  if (isAPI) {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cf_bearer}` },
    };

    const data = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${account_identifier}/storage/kv/namespaces/${namespace_identifier}/values/${keyName}`,
      options
    );

    if (data.status === 200) {
      if (isArrayBuffer) {
        return await data.arrayBuffer();
      } else {
        return await data.text();
      }
    }

    const errorInfo = (await data.json()) as any;

    if (data.status === 404) {
      if (errorInfo.errors[0].code === 10009) return null;
    } else {
      throw new Error('Workers KV GET error');
    }
  }

  const BEE_ASST_STORAGE = process.env.BEE_ASST_STORAGE as unknown as KVNamespace;
  if (isArrayBuffer) {
    return await BEE_ASST_STORAGE.get(keyName, { type: 'arrayBuffer' });
  } else {
    return await BEE_ASST_STORAGE.get(keyName);
  }
};

export const BEE_ASST_STORAGE_PUT = async (keyName: string, data: string | ArrayBuffer) => {
  if (isAPI) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cf_bearer}`,
      },
      body: data,
    };

    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${account_identifier}/storage/kv/namespaces/${namespace_identifier}/values/${keyName}`,
      options
    );

    const jsonData = (await res.json()) as any;

    if (res.status === 200 && jsonData.success) {
      return;
    } else {
      throw new Error('Workers KV PUT error');
    }
  }

  const BEE_ASST_STORAGE = process.env.BEE_ASST_STORAGE as unknown as KVNamespace;
  await BEE_ASST_STORAGE.put(keyName, data);
};
