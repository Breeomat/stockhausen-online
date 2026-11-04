import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { plakate } from '../../lib/plakate';

// Vorschaubild der Plakatwand beim Teilen (WhatsApp, Facebook …): Collage der zuletzt eingetragenen aktuellen Plakate,
// leicht schräg wie an einer Pinnwand. Entsteht bei jedem Neubau neu (auch nachts), ist also immer aktuell.
export const BREITE = 1200;
export const HOEHE = 630;

const text = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export const GET: APIRoute = async () => {
  const { neueste } = await plakate();
  const auswahl = neueste.slice(0, 4);
  const h = 400, b = Math.round(h / 1.414), rand = 7;
  const winkel = [-4, 2.5, -2, 3.5];
  const abstand = auswahl.length > 0 ? Math.min(b + 34, (BREITE - 80 - b) / Math.max(1, auswahl.length - 1)) : 0;
  const gesamt = b + abstand * (auswahl.length - 1);
  const start = (BREITE - gesamt) / 2;

  const teile = await Promise.all(
    auswahl.map(async (p, i) => {
      const quelle = await readFile(new URL(`../../assets/plakate/${p.data.bild}`, `file://${process.cwd()}/src/pages/plakate/`));
      const bild = await sharp(quelle).resize({ width: b, height: h, fit: 'cover', position: 'top' })
        .extend({ top: rand, bottom: rand, left: rand, right: rand, background: '#ffffff' }).png().toBuffer();
      const schatten = await sharp({ create: { width: b + 2 * rand, height: h + 2 * rand, channels: 4, background: { r: 30, g: 20, b: 10, alpha: 0.45 } } })
        .extend({ top: 24, bottom: 24, left: 24, right: 24, background: { r: 0, g: 0, b: 0, alpha: 0 } }).blur(10).png().toBuffer();
      const drehen = (buf: Buffer) => sharp(buf).rotate(winkel[i % winkel.length], { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer({ resolveWithObject: true });
      const [d, s] = await Promise.all([drehen(bild), drehen(schatten)]);
      const mitteX = start + i * abstand + b / 2;
      const mitteY = 352 + (i % 2 ? 8 : -6);
      return [
        { input: s.data, left: Math.round(mitteX - s.info.width / 2 + 6), top: Math.round(mitteY - s.info.height / 2 + 10) },
        { input: d.data, left: Math.round(mitteX - d.info.width / 2), top: Math.round(mitteY - d.info.height / 2) },
      ];
    }),
  );
  // Reißzwecken oben auf jedem Plakat
  const zwecken = auswahl.map((_, i) => {
    const x = start + i * abstand + b / 2, y = 352 + (i % 2 ? 8 : -6) - h / 2 + 4;
    return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="9" fill="#c0522b" stroke="#7a2e14" stroke-width="2"/><circle cx="${(x - 3).toFixed(0)}" cy="${(y - 3).toFixed(0)}" r="3" fill="#f3b49a"/>`;
  }).join('');
  const kopf = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${BREITE}" height="${HOEHE}">
    <rect x="0" y="0" width="${BREITE}" height="118" fill="#1d4e6e"/>
    <rect x="0" y="118" width="${BREITE}" height="5" fill="#e9ad3f"/>
    <text x="48" y="66" font-family="DejaVu Serif, Georgia, serif" font-size="46" font-weight="bold" fill="#ffffff">Plakatwand Stockhausen</text>
    <text x="50" y="101" font-family="DejaVu Sans, Arial, sans-serif" font-size="22" fill="#f3d79a">${text(auswahl.length ? 'Was gerade aushängt' : 'Die Plakate der Vereine')} · stockhausen-online.de</text>
    ${zwecken}
  </svg>`);

  // Hintergrund: Korkwand
  const kork = await sharp({ create: { width: BREITE, height: HOEHE, channels: 3, background: '#c99a64' } })
    .composite([
      { input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${BREITE}" height="${HOEHE}"><filter id="k"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.22  0 0 0 0 0.1  0 0 0 0.55 0"/></filter><rect width="100%" height="100%" filter="url(#k)"/></svg>`) },
    ]).png().toBuffer();

  const jpg = await sharp(kork).composite([...teile.flat(), { input: kopf }]).jpeg({ quality: 82 }).toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { 'Content-Type': 'image/jpeg' } });
};
