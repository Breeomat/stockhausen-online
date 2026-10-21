#!/usr/bin/env python3
"""Grundkarte für /dorf/karte/ aus OpenStreetMap-Daten erzeugen.

Läuft nur bei Bedarf (z. B. wenn sich Straßen oder Gebäude in OSM geändert haben), nicht beim Build:

    python3 scripts/dorfkarte.py              # lädt den Ausschnitt von api.openstreetmap.org
    python3 scripts/dorfkarte.py map.osm      # oder eine vorhandene OSM-Datei (openstreetmap.org → Exportieren)

Schreibt:
  src/assets/dorfkarte/basis.svg     Straßen, Gebäude, Flächen, Gewässer, Straßennamen (Farben per CSS auf der Seite)
  src/lib/dorfkarte-daten.json       Kartenrahmen und Koordinaten aller Hausadressen („Welzgasse 1“ → [x, y])

Kartendaten © OpenStreetMap-Mitwirkende, ODbL – der Hinweis steht auf der Seite unter der Karte.
"""
import json
import math
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

# Ausschnitt: Dorf mit Sportplatz, Schützenhaus und Conrads-Ruhe
WEST, SUED, OST, NORD = 9.4325, 50.5550, 9.4565, 50.5680
BREITE = 1000  # viewBox-Breite; Höhe ergibt sich aus dem Seitenverhältnis

WURZEL = Path(__file__).resolve().parent.parent
KX = math.cos(math.radians((SUED + NORD) / 2))
HOEHE = round(BREITE * (NORD - SUED) / ((OST - WEST) * KX))


def xy(lat, lon):
    return (round((lon - WEST) / (OST - WEST) * BREITE, 1), round((NORD - lat) / (NORD - SUED) * HOEHE, 1))


def laden():
    if len(sys.argv) > 1:
        return ET.parse(sys.argv[1]).getroot()
    url = f'https://api.openstreetmap.org/api/0.6/map?bbox={WEST},{SUED},{OST},{NORD}'
    req = urllib.request.Request(url, headers={'User-Agent': 'stockhausen-online.de Dorfkarte'})
    with urllib.request.urlopen(req, timeout=180) as antwort:
        return ET.fromstring(antwort.read())


osm = laden()
knoten = {n.get('id'): (float(n.get('lat')), float(n.get('lon'))) for n in osm.iter('node')}
wege = {}
for w in osm.iter('way'):
    refs = [nd.get('ref') for nd in w.iter('nd') if nd.get('ref') in knoten]
    wege[w.get('id')] = (refs, {t.get('k'): t.get('v') for t in w.iter('tag')})


def tags(el):
    return {t.get('k'): t.get('v') for t in el.iter('tag')}


def pfad(refs, zu=False):
    pts = [xy(*knoten[r]) for r in refs]
    if len(pts) < 2:
        return ''
    d = 'M' + ' '.join(f'{x:g},{y:g}' for x, y in pts)
    return d + ('Z' if zu else '')


def ringe(rel):
    """Äußere/innere Wege einer Multipolygon-Relation zu geschlossenen Ringen verbinden."""
    stuecke = [list(wege[m.get('ref')][0]) for m in rel.iter('member') if m.get('type') == 'way' and m.get('ref') in wege]
    stuecke = [s for s in stuecke if len(s) > 1]
    fertig = []
    while stuecke:
        ring = stuecke.pop(0)
        weiter = True
        while ring[0] != ring[-1] and weiter:
            weiter = False
            for i, s in enumerate(stuecke):
                if s[0] == ring[-1]: ring += s[1:]
                elif s[-1] == ring[-1]: ring += s[-2::-1]
                elif s[-1] == ring[0]: ring = s[:-1] + ring
                elif s[0] == ring[0]: ring = s[:0:-1] + ring
                else: continue
                stuecke.pop(i)
                weiter = True
                break
        fertig.append(ring)
    return fertig


def flaechenklasse(t):
    lu, nat, lei = t.get('landuse'), t.get('natural'), t.get('leisure')
    if lu in ('forest',) or nat in ('wood',): return 'wald'
    if nat in ('scrub', 'heath'): return 'gebuesch'
    if lu in ('meadow', 'grass', 'orchard', 'village_green') or lei == 'park': return 'wiese'
    if lu == 'farmland': return 'acker'
    if lu == 'residential': return 'wohnen'
    if lu in ('industrial', 'commercial'): return 'gewerbe'
    if lu == 'cemetery' or t.get('amenity') == 'grave_yard': return 'friedhof'
    if nat == 'water' or lu == 'basin': return 'wasser'
    if lei in ('pitch', 'track'): return 'sport'
    if t.get('amenity') == 'parking': return 'parken'
    return None


# Zeichenreihenfolge der Flächen (unten → oben)
FLAECHEN = ['acker', 'wiese', 'gebuesch', 'wald', 'wohnen', 'gewerbe', 'friedhof', 'parken', 'sport', 'wasser']
flaechen = {k: [] for k in FLAECHEN}
gebaeude, baeche, fluesse = [], [], []
strassen = {k: [] for k in ('weg', 'treppe', 'zufahrt', 'feldweg', 'wohnstrasse', 'hauptstrasse')}
namen = {}

for wid, (refs, t) in wege.items():
    if len(refs) < 2:
        continue
    geschlossen = refs[0] == refs[-1]
    hw = t.get('highway')
    if 'building' in t and geschlossen:
        gebaeude.append(pfad(refs, True))
    elif hw:
        klasse = {'secondary': 'hauptstrasse', 'tertiary': 'hauptstrasse', 'primary': 'hauptstrasse',
                  'residential': 'wohnstrasse', 'unclassified': 'wohnstrasse', 'living_street': 'wohnstrasse',
                  'service': 'zufahrt', 'track': 'feldweg', 'steps': 'treppe'}.get(hw, 'weg' if hw in ('footway', 'path', 'cycleway', 'pedestrian') else None)
        if klasse:
            strassen[klasse].append(pfad(refs))
            if t.get('name') and klasse in ('hauptstrasse', 'wohnstrasse'):
                namen.setdefault(t['name'], []).append(refs)
    elif t.get('waterway') in ('stream', 'ditch', 'drain', 'canal'):
        baeche.append(pfad(refs))
    elif t.get('waterway') == 'river':
        fluesse.append(pfad(refs))
    elif geschlossen and flaechenklasse(t):
        flaechen[flaechenklasse(t)].append(pfad(refs, True))

for rel in osm.iter('relation'):
    t = tags(rel)
    if t.get('type') == 'multipolygon' and flaechenklasse(t):
        d = ''.join(pfad(r, True) for r in ringe(rel))
        if d: flaechen[flaechenklasse(t)].append(d)


def laenge(refs):
    pts = [xy(*knoten[r]) for r in refs]
    return sum(math.dist(a, b) for a, b in zip(pts, pts[1:]))


# Straßennamen: je Straße der längste Abschnitt, Schrift läuft immer von links nach rechts
beschriftung = []
def ketten(abschnitte):
    stuecke = [list(a) for a in abschnitte]
    fertig = []
    while stuecke:
        kette = stuecke.pop(0)
        weiter = True
        while weiter:
            weiter = False
            for i, s in enumerate(stuecke):
                if s[0] == kette[-1]: kette += s[1:]
                elif s[-1] == kette[-1]: kette += s[-2::-1]
                elif s[-1] == kette[0]: kette = s[:-1] + kette
                elif s[0] == kette[0]: kette = s[:0:-1] + kette
                else: continue
                stuecke.pop(i)
                weiter = True
                break
        fertig.append(kette)
    return fertig


def im_bild(refs):
    # nur den sichtbaren Teil beschriften
    teil = [r for r in refs if 0 <= xy(*knoten[r])[0] <= BREITE and 0 <= xy(*knoten[r])[1] <= HOEHE]
    return teil if len(teil) > 1 else refs


def gerade_genug(refs):
    # Abschnitt mit wenig Richtungswechsel (Text auf engen Kurven wird unlesbar): längstes Teilstück ohne Knick > 50°
    pts = [xy(*knoten[r]) for r in refs]
    best, start = (0, 1), 0
    for i in range(1, len(pts) - 1):
        a = math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0])
        b = math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0])
        knick = abs((b - a + math.pi) % (2 * math.pi) - math.pi)
        if knick > math.radians(50):
            if laenge(refs[start:i + 1]) > laenge(refs[best[0]:best[1] + 1]): best = (start, i)
            start = i
    if laenge(refs[start:]) > laenge(refs[best[0]:best[1] + 1]): best = (start, len(refs) - 1)
    return refs[best[0]:best[1] + 1]


for i, (name, abschnitte) in enumerate(sorted(namen.items())):
    refs = max((gerade_genug(im_bild(k)) for k in ketten(abschnitte)), key=laenge)
    if laenge(refs) < len(name) * 6.5:
        continue
    a, b = xy(*knoten[refs[0]]), xy(*knoten[refs[-1]])
    if b[0] < a[0]:
        refs = refs[::-1]
    beschriftung.append((f'strasse-{i}', name, pfad(refs)))

g = lambda klasse, ds: f'<path class="k-{klasse}" d="{"".join(ds)}"/>' if ds else ''
teile = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {BREITE} {HOEHE}" class="dorfkarte__basis" aria-hidden="true">',
         f'<rect class="k-grund" width="{BREITE}" height="{HOEHE}"/>']
teile += [g(k, flaechen[k]) for k in FLAECHEN]
teile += [g('fluss', fluesse), g('bach', baeche), g('haus', gebaeude)]
for k in ('feldweg', 'weg', 'treppe', 'zufahrt', 'wohnstrasse', 'hauptstrasse'):
    teile.append(g(f'{k}-rand', strassen[k]) if k in ('zufahrt', 'wohnstrasse', 'hauptstrasse') else '')
for k in ('feldweg', 'weg', 'treppe', 'zufahrt', 'wohnstrasse', 'hauptstrasse'):
    teile.append(g(k, strassen[k]))
teile.append('<defs>' + ''.join(f'<path id="{i}" d="{d}"/>' for i, _, d in beschriftung) + '</defs>')
teile += [f'<text class="k-name"><textPath href="#{i}" startOffset="50%" text-anchor="middle">{n}</textPath></text>' for i, n, _ in beschriftung]
teile.append('</svg>')

(WURZEL / 'src/assets/dorfkarte').mkdir(parents=True, exist_ok=True)
(WURZEL / 'src/assets/dorfkarte/basis.svg').write_text(''.join(t for t in teile if t), encoding='utf-8')

adressen = {}
for el in list(osm.iter('node')) + list(osm.iter('way')):
    t = tags(el)
    if 'addr:street' in t and 'addr:housenumber' in t:
        refs = [nd.get('ref') for nd in el.iter('nd') if nd.get('ref') in knoten] or [el.get('id')]
        pts = [knoten[r] for r in refs if r in knoten]
        if pts:
            adressen[f"{t['addr:street']} {t['addr:housenumber']}"] = list(xy(sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts)))

daten = {'rahmen': {'west': WEST, 'sued': SUED, 'ost': OST, 'nord': NORD, 'breite': BREITE, 'hoehe': HOEHE},
         'adressen': dict(sorted(adressen.items()))}
(WURZEL / 'src/lib/dorfkarte-daten.json').write_text(json.dumps(daten, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print(f'basis.svg: {len(gebaeude)} Gebäude, {sum(map(len, strassen.values()))} Wege, {len(beschriftung)} Straßennamen; {len(adressen)} Adressen')
