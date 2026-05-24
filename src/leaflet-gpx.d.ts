import * as L from 'leaflet';

declare module 'leaflet' {
   class GPX extends L.Layer {
      constructor(gpx: string, options?: any);
      getBounds(): L.LatLngBounds;
   }
}