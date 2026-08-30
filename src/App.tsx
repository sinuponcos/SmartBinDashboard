import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Activity, Radio, Wifi, Loader2 } from "lucide-react";
import MapView from "@/components/MapView";
import ControlPanel from "@/components/ControlPanel";
import StatsBar from "@/components/StatsBar";
import RouteInfo from "@/components/RouteInfo";
import { computeRoute } from "@/utils/routing";
import { getPriority } from "@/types";
import { useBins } from "@/hooks/useBins";

export default function App() {
  const { bins, setBins, loading, error, updateFill, resetBins } = useBins();
  const [selectedBinId, setSelectedBinId] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const simInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [now, setNow] = useState(() => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const handleFillChange = useCallback(
    (id: string, value: number) => {
      updateFill(id, value);
    },
    [updateFill],
  );

  const handleReset = useCallback(() => {
    if (simInterval.current) {
      clearInterval(simInterval.current);
      simInterval.current = null;
    }
    setSimulating(false);
    resetBins();
  }, [resetBins]);

  const handleAutoSimulate = useCallback(() => {
    if (simulating) return;
    setSimulating(true);
    let tick = 0;
    simInterval.current = setInterval(() => {
      tick++;
      setBins((prev) => {
        const updates: { id: string; fillPercent: number }[] = [];
        const next = prev.map((b) => {
          const priority = getPriority(b.fillPercent);
          let fill = b.fillPercent;

          if (priority === "high") {
            // Truck picks up garbage from priority bins — empty them gradually
            // Every few ticks, one high bin gets collected (drops to low)
            // Other high bins slowly decrease as the truck works through the route
            fill = b.fillPercent - (Math.random() * 12 + 8);
            if (fill < 5) fill = 2 + Math.random() * 3;
          } else {
            // Normal and watch bins fill up over time (people throwing garbage)
            const fillRate = priority === "medium" ? Math.random() * 4 + 1.5 : Math.random() * 3.5 + 1;
            fill = b.fillPercent + fillRate;
            if (fill > 100) fill = 100;
          }

          updates.push({ id: b.id, fillPercent: fill });
          return { ...b, fillPercent: fill, lastUpdated: "just now" };
        });

        for (const u of updates) {
          updateFill(u.id, u.fillPercent);
        }

        // Stop if everything is nearly empty (all trucks finished) or all full
        const allLow = next.every((b) => b.fillPercent < 10);
        const allFull = next.every((b) => b.fillPercent >= 99.5);
        if (allLow || allFull) {
          if (simInterval.current) clearInterval(simInterval.current);
          simInterval.current = null;
          setSimulating(false);
        }
        return next;
      });
    }, 2000);
  }, [simulating, updateFill]);

  const highPriorityBins = useMemo(
    () => bins.filter((b) => getPriority(b.fillPercent) === "high"),
    [bins],
  );

  const route = useMemo(() => computeRoute(highPriorityBins), [highPriorityBins]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-sm text-slate-400">Connecting to sensor network…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-2 text-center">
          <Wifi className="h-8 w-8 text-red-400" />
          <p className="text-sm font-semibold text-red-400">Connection Error</p>
          <p className="text-xs text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/60 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/20">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">Smart Bin Monitor</h1>
            <p className="text-xs text-slate-500">Waste Operations Dashboard — South Mumbai Sector</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-1.5 sm:flex">
            <Radio className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-slate-400">IoT Live</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-1.5">
            <Wifi className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-slate-400">Connected</span>
          </div>
          <div className="text-xs tabular-nums text-slate-500">{now}</div>
        </div>
      </header>

      {/* Stats bar */}
      <div className="shrink-0 border-b border-slate-800 bg-slate-900/30 px-5 py-3">
        <StatsBar bins={bins} />
      </div>

      {/* Main content */}
      <div className="flex min-h-0 flex-1 gap-4 p-4">
        {/* Left: Control Panel */}
        <aside className="flex w-72 shrink-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-3 backdrop-blur">
          <ControlPanel
            bins={bins}
            selectedBinId={selectedBinId}
            onSelectBin={setSelectedBinId}
            onFillChange={handleFillChange}
            onAutoSimulate={handleAutoSimulate}
            onReset={handleReset}
            simulating={simulating}
          />
        </aside>

        {/* Center: Map */}
        <main className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/20">
          <MapView bins={bins} route={route} selectedBinId={selectedBinId} onSelectBin={setSelectedBinId} />

          {/* Legend overlay */}
          <div className="absolute bottom-4 left-4 z-[1000] rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 backdrop-blur">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Fill Priority</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500 shadow shadow-emerald-500/50" />
                <span className="text-xs text-slate-300">Normal &lt; 50%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-500 shadow shadow-amber-500/50" />
                <span className="text-xs text-slate-300">Watch 50–80%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500 shadow shadow-red-500/50" />
                <span className="text-xs text-slate-300">Priority 1 &gt; 80%</span>
              </div>
              <div className="mt-2 flex items-center gap-2 border-t border-slate-700 pt-2">
                <span className="h-0.5 w-6 border-t-2 border-dashed border-amber-400" />
                <span className="text-xs text-slate-300">Truck Route</span>
              </div>
            </div>
          </div>
        </main>

        {/* Right: Route Info */}
        <aside className="flex w-72 shrink-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-3 backdrop-blur">
          <RouteInfo route={route} />
        </aside>
      </div>
    </div>
  );
}
