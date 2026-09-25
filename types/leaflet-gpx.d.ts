// leaflet-gpx ne fournit pas de types : on déclare le strict nécessaire.
import 'leaflet';

declare module 'leaflet' {
  class GPX extends FeatureGroup {
    constructor(gpx: string, options?: {
      async?: boolean;
      polyline_options?: PolylineOptions;
      markers?: Record<string, unknown>;
    });
  }
}

declare module 'leaflet-gpx';
