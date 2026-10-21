import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

// YAML liest 2026-11-14 als Datum ein; intern wird mit 'JJJJ-MM-TT' gearbeitet
const datum = z.preprocess(
  (wert) => (wert instanceof Date ? wert.toISOString().slice(0, 10) : wert),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format JJJJ-MM-TT'),
);
const uhrzeit = z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM');

const termine = defineCollection({
  loader: file('src/content/termine.yaml'),
  schema: z.object({
    titel: z.string(),
    datum,
    bis: datum.optional(),
    beginn: uhrzeit.optional(),
    ende: uhrzeit.optional(),
    ort: z.string().optional(),
    verein: z.string().optional(),
    // weitere beteiligte Vereine: Termin erscheint auch auf deren Vereinsseite
    mit: z.array(z.string()).optional(),
    text: z.string().optional(),
    plakat: z.string().optional(),
    link: z.string().url().optional(),
  }),
});

const plakate = defineCollection({
  loader: file('src/content/plakate.yaml'),
  schema: z.object({
    titel: z.string(),
    bild: z.string(),
    verein: z.string().optional(),
    gueltig_bis: datum,
  }),
});

const verzeichnis = defineCollection({
  loader: file('src/content/verzeichnis.yaml'),
  schema: z.object({
    name: z.string(),
    kategorie: z.enum(['Einkaufen', 'Gastronomie', 'Handwerk', 'Industrie', 'Landwirtschaft', 'Gesundheit', 'Dienstleistung', 'Kultur', 'Einrichtung']),
    text: z.string(),
    adresse: z.string().optional(),
    // eine Angabe oder eine Liste; Hinweis in Klammern möglich, z. B. "0177 1234567 (Saal)"
    telefon: z.union([z.string(), z.array(z.string())]).optional(),
    fax: z.string().optional(),
    email: z.union([z.string(), z.array(z.string())]).optional(),
    web: z.string().url().optional(),
    zeiten: z.string().optional(),
    seite: z.string().optional(),
    bestellen: z.string().url().optional(),
    bild: z.string().optional(),
    angebot: z.object({ titel: z.string(), datei: z.string(), bis: datum }).optional(),
  }),
});

export const collections = { termine, plakate, verzeichnis };
