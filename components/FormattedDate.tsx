const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
              'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

// 'May 11 2026' est lu en heure locale, alors que '2026-05-11' est lu en UTC :
// on ramène tout en heure locale et on lit la date avec les getters locaux,
// sinon on affiche la veille dès que le fuseau est en avance sur UTC.
function parseDate(date: Date | string): Date {
  if (date instanceof Date) return date;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  return iso ? new Date(+iso[1], +iso[2] - 1, +iso[3]) : new Date(date);
}

export default function FormattedDate({ date }: { date: Date | string }) {
  const d = parseDate(date);
  const pad = (n: number) => String(n).padStart(2, '0');
  const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return <time dateTime={iso}>{`${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`}</time>;
}
