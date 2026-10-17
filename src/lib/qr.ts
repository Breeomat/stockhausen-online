// QR-Codes zum Ausdrucken (Seite /qr-code/, Downloads als SVG und PNG)
import QRCode from 'qrcode';

const site = 'https://stockhausen-online.de';

export const qrCodes = [
  { name: 'startseite', titel: 'Startseite', ziel: `${site}/`, text: 'Für Plakate, Schaukasten und Gemeindeblatt.' },
  { name: 'termine', titel: 'Termine', ziel: `${site}/termine/`, text: 'Führt direkt zu allen Terminen der Vereine.' },
];

const optionen = { errorCorrectionLevel: 'M' as const, margin: 2, color: { dark: '#1d4e6e', light: '#ffffff' } };

export const qrSvg = (ziel: string) => QRCode.toString(ziel, { ...optionen, type: 'svg' });
export const qrPng = (ziel: string) => QRCode.toBuffer(ziel, { ...optionen, type: 'png', width: 1200 });
