import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap, CircleMarker, Tooltip as LTooltip } from "react-leaflet";
import L from "leaflet";
import type { Bin } from "@/types";
import { getPriority, PRIORITIES } from "@/types";
import { DEPOT } from "@/data/bins";
import type { RoutePlan } from "@/utils/routing";

interface MapViewProps {
  bins: Bin[];
  route: RoutePlan;
  selectedBinId: string | null;
  onSelectBin: (id: string) => void;
}

function createBinIcon(bin: Bin, selected: boolean): L.DivIcon {
  const priority = PRIORITIES[getPriority(bin.fillPercent)];
  const fillPct = Math.round(bin.fillPercent);
  const scale = selected ? 1.15 : 1;
  const ring = selected ? `ring-4 ring-white` : `ring-2 ring-white/70`;

  const html = `
    <div style="transform: scale(${scale}); transform-origin: center;" class="relative flex flex-col items-center transition-transform duration-200">
      <div class="relative w-9 h-9 rounded-full ${ring} flex items-center justify-center shadow-lg ${priority.glowClass}"
           style="background-color: ${priority.hex};">
        <svg viewBox="0 0 24 24" class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 7h16M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
        </svg>
        <div class="absolute -bottom-1 -right-1 bg-white rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none shadow"
             style="color: ${priority.hex};">${fillPct}</div>
      </div>
      <div class="w-0.5 h-2 bg-gray-700/60"></div>
      <div class="w-3 h-1.5 bg-gray-700/60 rounded-b-sm"></div>
    </div>`;

  return L.divIcon({
    html,
    className: "smart-bin-marker",
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    tooltipAnchor: [0, -40],
  });
}

const depotIcon = L.divIcon({
  html: `
    <div class="relative flex flex-col items-center">
      <div class="w-10 h-10 rounded-lg bg-slate-800 ring-2 ring-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
        <svg viewBox="0 0 24 24" class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l2-5h14l2 5M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9M3 9h18M9 13h6"/>
        </svg>
      </div>
      <div class="w-0.5 h-2 bg-slate-700"></div>
    </div>`,
  className: "depot-marker",
  iconSize: [40, 48],
  iconAnchor: [20, 48],
});

function FitBounds({ bins }: { bins: Bin[] }) {
  const map = useMap();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    const points: [number, number][] = bins.map((b) => [b.lat, b.lng]);
    points.push([DEPOT.lat, DEPOT.lng]);
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [50, 50] });
    done.current = true;
  }, [bins, map]);

  return null;
}

export default function MapView({ bins, route, selectedBinId, onSelectBin }: MapViewProps) {
  const routePositions: [number, number][] = [
    [DEPOT.lat, DEPOT.lng],
    ...route.stops.map((s) => [s.bin.lat, s.bin.lng] as [number, number]),
  ];
  if (route.stops.length > 0) {
    routePositions.push([DEPOT.lat, DEPOT.lng]);
  }

  return (
    <MapContainer
      center={[18.9600, 72.8270]}
      zoom={13}
      className="h-full w-full rounded-2xl"
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds bins={bins} />

      {/* Route polyline — wide glow base + bright dashed line on top */}
      {route.stops.length > 0 && (
        <>
          {/* Outer glow halo */}
          <Polyline
            positions={routePositions}
            pathOptions={{
              color: "#f59e0b",
              weight: 14,
              opacity: 0.15,
              lineCap: "round",
            }}
          />
          {/* Mid glow */}
          <Polyline
            positions={routePositions}
            pathOptions={{
              color: "#f59e0b",
              weight: 8,
              opacity: 0.3,
              lineCap: "round",
            }}
          />
          {/* Main bright dashed line */}
          <Polyline
            positions={routePositions}
            pathOptions={{
              color: "#fbbf24",
              weight: 5,
              opacity: 0.95,
              dashArray: "2 14",
              lineCap: "round",
            }}
          />
          {/* Solid thin core for clarity */}
          <Polyline
            positions={routePositions}
            pathOptions={{
              color: "#fde68a",
              weight: 2,
              opacity: 0.8,
            }}
          />
        </>
      )}

      {/* Depot marker */}
      <Marker position={[DEPOT.lat, DEPOT.lng]} icon={depotIcon}>
        <LTooltip direction="top" offset={[0, -44]} opacity={1}>
          <div className="text-xs font-semibold text-slate-900">{DEPOT.name}</div>
        </LTooltip>
      </Marker>

      {/* Bin markers */}
      {bins.map((bin) => {
        const priority = getPriority(bin.fillPercent);
        return (
          <Marker
            key={bin.id}
            position={[bin.lat, bin.lng]}
            icon={createBinIcon(bin, selectedBinId === bin.id)}
            eventHandlers={{ click: () => onSelectBin(bin.id) }}
          >
            <LTooltip direction="top" offset={[0, -40]} opacity={1}>
              <div className="text-xs">
                <div className="font-bold text-slate-900">{bin.id}</div>
                <div className="text-slate-600">{bin.name}</div>
                <div className="mt-0.5 font-semibold" style={{ color: PRIORITIES[priority].hex }}>
                  {bin.fillPercent}% — {PRIORITIES[priority].label}
                </div>
              </div>
            </LTooltip>
          </Marker>
        );
      })}

      {/* Pulsing ring for high-priority bins */}
      {bins
        .filter((b) => getPriority(b.fillPercent) === "high")
        .map((bin) => (
          <CircleMarker
            key={`pulse-${bin.id}`}
            center={[bin.lat, bin.lng]}
            radius={26}
            pathOptions={{
              color: "#ef4444",
              weight: 2,
              opacity: 0.6,
              fillColor: "#ef4444",
              fillOpacity: 0.1,
            }}
          />
        ))}
    </MapContainer>
  );
}
