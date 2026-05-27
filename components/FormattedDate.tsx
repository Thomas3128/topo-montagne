const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
              'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

export default function FormattedDate({ date }: { date: Date | string }) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const formatted = `${d.getUTCDate()} ${MOIS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  return <time dateTime={d.toISOString()}>{formatted}</time>;
}
