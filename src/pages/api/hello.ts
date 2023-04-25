import type { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
}
