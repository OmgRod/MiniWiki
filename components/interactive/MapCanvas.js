import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';

export default function MapCanvas({
  latitude,
  longitude,
  zoomLevel,
  frameHeight,
  tileUrl,
  attribution,
  markerLabel,
}) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={zoomLevel}
      scrollWheelZoom={false}
      style={{ height: `${frameHeight}px`, width: '100%' }}
      className="z-0"
    >
      <TileLayer url={tileUrl} attribution={attribution} />
      <CircleMarker center={[latitude, longitude]} radius={8} pathOptions={{ color: '#2563eb', fillColor: '#60a5fa', fillOpacity: 0.9 }}>
        <Popup>{markerLabel}</Popup>
      </CircleMarker>
    </MapContainer>
  );
}
