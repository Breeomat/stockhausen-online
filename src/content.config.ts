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
    verein: z.string(),
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

export const collections = { termine, plakate };
