import type { RouteStop } from '@/lib/topos';

export default function RouteRecap({ stops }: { stops: RouteStop[] }) {
  if (!stops || stops.length < 2) return null;

  return (
    <div className="transport-route">
      <div className="transport-route-header">Itinéraire</div>
      <ol className="transport-chain">
        {stops.map((stop, i) => {
          const isLast = i === stops.length - 1;
          const hasLeg = !isLast && (stop.dp != null || stop.dm != null || stop.km != null || stop.diffTech || stop.diffPhys);

          return (
            <li key={i} className={`transport-stop${isLast ? ' transport-stop--dest' : ''}`}>
              <div className="transport-node-col">
                <span className="transport-node" aria-hidden="true">
                  {i === 0 ? '◎' : isLast ? '★' : '●'}
                </span>
                {!isLast && <div className="transport-node-line" />}
              </div>
              <div className="transport-content-col">
                {stop.jour != null && (
                  <span className="route-day-badge">Jour {stop.jour}</span>
                )}
                <span className="transport-stop-name">{stop.stop}</span>
                {hasLeg && (
                  <div className="transport-leg">
                    {stop.dp != null && <span>↑ {stop.dp} m</span>}
                    {stop.dm != null && <span>↓ {stop.dm} m</span>}
                    {stop.km != null && <span className="transport-leg-duree">{stop.km} km</span>}
                    {stop.diffTech && <span className="route-diff">{stop.diffTech}</span>}
                    {stop.diffPhys && <span className="route-diff-phys">{stop.diffPhys}</span>}
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
