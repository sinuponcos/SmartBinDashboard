import { Route, Navigation, MapPin } from "lucide-react";
import type { RoutePlan } from "@/utils/routing";
import { DEPOT } from "@/data/bins";

interface RouteInfoProps {
  route: RoutePlan;
}

export default function RouteInfo({ route }: RouteInfoProps) {
  const hasRoute = route.stops.length > 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 pb-3">
        <Route className="h-5 w-5 text-amber-400" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Optimal Route</h2>
      </div>

      {!hasRoute ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="rounded-full bg-slate-800/60 p-4">
            <Navigation className="h-8 w-8 text-slate-600" />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-400">No priority bins</p>
          <p className="mt-1 text-xs text-slate-600">
            Bins above 80% fill will trigger an automated collection route.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Stops</div>
              <div className="text-lg font-bold tabular-nums text-amber-400">{route.stops.length}</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Total Distance</div>
              <div className="text-lg font-bold tabular-nums text-amber-400">{route.totalKm.toFixed(2)} km</div>
            </div>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
            {/* Depot start */}
            <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-amber-400">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-300">{DEPOT.name}</div>
                <div className="text-[10px] text-slate-600">Start & End</div>
              </div>
            </div>

            {route.stops.map((stop) => (
              <div
                key={stop.bin.id}
                className="flex items-center gap-3 rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-2"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {stop.order}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-200">{stop.bin.id}</div>
                  <div className="truncate text-[10px] text-slate-500">{stop.bin.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold tabular-nums text-red-400">{stop.bin.fillPercent}%</div>
                  <div className="text-[10px] tabular-nums text-slate-600">+{stop.legKm.toFixed(2)} km</div>
                </div>
              </div>
            ))}

            {/* Depot return */}
            <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-amber-400">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-300">Return to Depot</div>
                <div className="text-[10px] tabular-nums text-slate-600">+{route.depotReturnKm.toFixed(2)} km</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
