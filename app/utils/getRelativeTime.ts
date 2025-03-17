interface DateUnits {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}
const DATE_UNITS: DateUnits = {
  year: 31536000,
  month: 2592000,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1
};
const languageCode = 'en'
const rtf = new Intl.RelativeTimeFormat(languageCode, { numeric: 'auto' });

export default function getRelativeTime(timestamp: string | undefined) {
  if (!timestamp) return

  const from = new Date(timestamp).getTime();
  const now = new Date().getTime();

  const elapsed = (from - now) / 1000;

  for (const [unit, seconds] of Object.entries(DATE_UNITS) as [keyof DateUnits, number][]) {
    if (Math.abs(elapsed) > seconds) {
      return rtf.format(
        Math.floor(elapsed / DATE_UNITS[unit]),
        unit
      )
    }
  }

  return rtf.format(0, 'second');
}