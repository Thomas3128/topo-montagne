export default function FormattedDate({ date }: { date: Date | string }) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return (
    <time dateTime={d.toISOString()}>
      {d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
    </time>
  );
}
