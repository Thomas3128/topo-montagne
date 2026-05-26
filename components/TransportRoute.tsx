import type { TransportStop } from '@/lib/topos';

const ICONS: Record<string, string> = {
  train: '🚂', tgv: '🚄', ter: '🚆',
  bus: '🚌', navette: '🚐',
  'à pied': '🚶', métro: '🚇', tramway: '🚊',
  covoiturage: '🚗', taxi: '🚕',
};

function icon(via: string) {
  return ICONS[via.toLowerCase()] ?? '🚌';
}

export default function TransportRoute({ stops }: { stops: TransportStop[] }) {
  if (!stops || stops.length < 2) return null;

  return (
    <div className="transport-route">
      <div className="transport-route-header">Accès en transports</div>
      <ol className="transport-chain">
        {stops.map((stop, i) => {
          const isLast = i === stops.length - 1;
          return (
            <li key={i} className={`transport-stop${isLast ? ' transport-stop--dest' : ''}`}>
              <div className="transport-node-col">
                <span className="transport-node" aria-hidden="true">
                  {isLast ? '★' : i === 0 ? '◎' : '●'}
                </span>
                {!isLast && <div className="transport-node-line" />}
              </div>
              <div className="transport-content-col">
                <span className="transport-stop-name">{stop.stop}</span>
                {stop.via && !isLast && (
                  <div className="transport-leg">
                    <span className="transport-leg-icon">{icon(stop.via)}</span>
                    <span className="transport-leg-mode">{stop.via}</span>
                    {stop.ligne && <span className="transport-leg-ligne">{stop.ligne}</span>}
                    {stop.duree && <span className="transport-leg-duree">{stop.duree}</span>}
                    {stop.lien && (
                      <a href={stop.lien} target="_blank" rel="noopener noreferrer" className="transport-leg-link">
                        Horaires →
                      </a>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
