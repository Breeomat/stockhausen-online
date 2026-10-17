import type { APIRoute } from 'astro';
import { qrCodes, qrSvg } from '../../lib/qr';

export const getStaticPaths = () => qrCodes.map((q) => ({ params: { name: `stockhausen-${q.name}` }, props: q }));

export const GET: APIRoute = async ({ props }) =>
  new Response(await qrSvg(props.ziel), { headers: { 'Content-Type': 'image/svg+xml' } });
