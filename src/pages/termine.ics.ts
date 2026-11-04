import type { APIRoute } from 'astro';
import { dorfTermine } from '../lib/termine';
import { kalender } from '../lib/ics';
import { url } from '../lib/site';

export const GET: APIRoute = async ({ site }) =>
  new Response(kalender(await dorfTermine(), new URL(url('termine/'), site).href), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
