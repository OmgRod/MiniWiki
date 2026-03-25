import dynamic from 'next/dynamic';

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

const MapCanvas = dynamic(() => import('./MapCanvas'), {
  ssr: false,
  loading: () => <div className="w-full bg-slate-100 dark:bg-slate-900" style={{ height: '320px' }} />,
});

export default function Map({
  lat = 40.7128,
  lng = -74.006,
  zoom = 12,
  height = 360,
  title = 'Location',
  caption = '',
  tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution = '&copy; OpenStreetMap contributors',
  markerLabel = 'Selected location',
  className = '',
}) {
  const latitude = clamp(toNumber(lat, 40.7128), -85, 85);
  const longitude = clamp(toNumber(lng, -74.006), -180, 180);
  const zoomLevel = clamp(Math.round(toNumber(zoom, 12)), 1, 19);
  const frameHeight = Math.max(220, Math.round(toNumber(height, 360)));

  const openStreetMapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoomLevel}/${latitude}/${longitude}`;

  return (
    <div className={`my-4 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
        {caption ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{caption}</p> : null}
      </div>

      <MapCanvas
        latitude={latitude}
        longitude={longitude}
        zoomLevel={zoomLevel}
        frameHeight={frameHeight}
        tileUrl={tileUrl}
        attribution={attribution}
        markerLabel={markerLabel}
      />

      <div className="border-t border-slate-200 px-4 py-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <a href={openStreetMapUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-slate-700 dark:hover:text-slate-300">
          Open in OpenStreetMap
        </a>
      </div>
    </div>
  );
}
