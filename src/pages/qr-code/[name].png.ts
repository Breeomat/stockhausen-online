import type { APIRoute } from 'astro';
import { qrCodes, qrPng } from '../../lib/qr';

export const getStaticPaths = () => qrCodes.map((q) => ({ params: { name: `stockhausen-${q.name}` }, props: q }));

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await qrPng(props.ziel)), { headers: { 'Content-Type': 'image/png' } });
