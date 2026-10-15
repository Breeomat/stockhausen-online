import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { heute } from './termine';

export type Plakat = CollectionEntry<'plakate'> & { bild: ImageMetadata };

const bilder = import.meta.glob<{ default: ImageMetadata }>('../assets/plakate/*.{jpg,jpeg,png,webp}', { eager: true });

function mitBild(eintrag: CollectionEntry<'plakate'>): Plakat {
  const datei = bilder[`../assets/plakate/${eintrag.data.bild}`];
  if (!datei) throw new Error(`Plakat "${eintrag.id}": Bild src/assets/plakate/${eintrag.data.bild} fehlt`);
  return { ...eintrag, bild: datei.default };
}

const nachDatum = (a: Plakat, b: Plakat) => a.data.gueltig_bis.localeCompare(b.data.gueltig_bis);

export async function plakate() {
  const stichtag = heute();
  const alle = (await getCollection('plakate')).map(mitBild);
  return {
    aktuell: alle.filter((p) => p.data.gueltig_bis >= stichtag).sort(nachDatum),
    archiv: alle.filter((p) => p.data.gueltig_bis < stichtag).sort(nachDatum).reverse(),
  };
}
