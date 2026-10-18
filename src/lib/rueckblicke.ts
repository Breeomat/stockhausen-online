import type { ImageMetadata } from 'astro';
import erntedank2026 from '../assets/fotos/erntedank-2026-stall.jpg';

// Rückblicke (Berichte mit Fotos) für die Liste unter /aktuelles/. Neue Berichte als eigene Seite unter
// src/pages/aktuelles/<name>/ anlegen und hier eintragen; die Liste wird nach Datum sortiert (neueste zuerst).
export interface Rueckblick { titel: string; datum: string; text: string; href: string; bild?: { src: ImageMetadata; alt: string } }

export const rueckblicke: Rueckblick[] = [
  {
    titel: 'Erntedank im Stall',
    datum: '2026-10-18',
    text: 'Ein Stall voller Menschen und eine Maus, die die Predigt hält: Erntedankgottesdienst mit dem Kindergarten Storchennest und Kartoffelfeuer.',
    href: 'aktuelles/erntedank-2026/',
    bild: { src: erntedank2026, alt: 'Voll besetzter Stall beim Erntedankgottesdienst' },
  },
].sort((a, b) => b.datum.localeCompare(a.datum));
