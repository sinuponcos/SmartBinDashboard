import { Slider } from "@/components/ui/Slider";
import type { Bin } from "@/types";
import { getPriority, PRIORITIES } from "@/types";

interface ControlPanelProps {
  bins: Bin[];
  selectedBinId: string | null;
  onSelectBin: (id: string) => void;
  onFillChange: (id: string, value: number) => void;
  onAutoSimulate: () => void;
  onReset: () => void;
  simulating: boolean;
}

export default function ControlPanel({
  bins,
  selectedBinId,
  onSelectBin,
  onFillChange,
  onAutoSimulate,
  onReset,
  simulating,
}: ControlPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 px-1 pb-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Sensor Control</h2>
          <p className="text-xs text-slate-500">Adjust fill level per bin</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAutoSimulate}
            disabled={simulating}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-900 transition hover:bg-amber-400 disabled:opacity-50"
          >
            {simulating ? (
              <>
                <span className="h-2 w-2 animate-ping rounded-full bg-slate-900" />
                Simulating
              </>
            ) : (
              "Auto-Simulate"
            )}
          </button>
          <button
            onClick={onReset}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {bins.map((bin) => {
          const priority = getPriority(bin.fillPercent);
          const p = PRIORITIES[priority];
          const isSelected = selectedBinId === bin.id;
          return (
            <div
              key={bin.id}
              onClick={() => onSelectBin(bin.id)}
              className={`cursor-pointer rounded-xl border p-3 transition-all duration-200 ${
                isSelected
                  ? "border-slate-500 bg-slate-800/80 ring-1 ring-slate-400"
                  : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: p.hex, boxShadow: `0 0 8px ${p.hex}` }}
                  />
                  <span className="text-sm font-semibold text-slate-200">{bin.id}</span>
                </div>
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color: p.hex }}
                >
                  {Math.round(bin.fillPercent)}%
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-500">{bin.name}</p>
              <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                <Slider
                  value={bin.fillPercent}
                  min={0}
                  max={100}
                  step={1}
                  color={p.hex}
                  onChange={(v) => onFillChange(bin.id, v)}
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-slate-600">
                <span>{p.label}</span>
                <span>{bin.lastUpdated}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
