import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { kalender } from '../../lib/ics';
import { url } from '../../lib/site';
import type { Termin } from '../../lib/termine';

export const getStaticPaths = (async () =>
  (await getCollection('termine')).map((termin) => ({ params: { id: termin.id }, props: { termin } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props, site }) =>
  new Response(kalender([props.termin as Termin], new URL(url('termine/'), site).href), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
