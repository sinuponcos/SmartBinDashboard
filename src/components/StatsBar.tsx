import type { Bin } from "@/types";
import { getPriority, PRIORITIES } from "@/types";
import { Trash2, AlertTriangle, CircleCheck, TrendingUp } from "lucide-react";

interface StatsBarProps {
  bins: Bin[];
}

export default function StatsBar({ bins }: StatsBarProps) {
  const total = bins.length;
  const high = bins.filter((b) => getPriority(b.fillPercent) === "high").length;
  const medium = bins.filter((b) => getPriority(b.fillPercent) === "medium").length;
  const low = bins.filter((b) => getPriority(b.fillPercent) === "low").length;
  const avgFill = total > 0 ? Math.round(bins.reduce((s, b) => s + b.fillPercent, 0) / total) : 0;

  const stats = [
    {
      label: "Total Bins",
      value: total,
      icon: Trash2,
      color: "text-slate-300",
      bg: "bg-slate-800/60",
    },
    {
      label: "Priority 1",
      value: high,
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-red-950/40",
    },
    {
      label: "Watch",
      value: medium,
      icon: CircleCheck,
      color: "text-amber-400",
      bg: "bg-amber-950/40",
    },
    {
      label: "Normal",
      value: low,
      icon: CircleCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-950/40",
    },
    {
      label: "Avg Fill",
      value: `${avgFill}%`,
      icon: TrendingUp,
      color: "text-sky-400",
      bg: "bg-sky-950/40",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className={`flex items-center gap-3 rounded-xl border border-slate-800 ${s.bg} px-4 py-3 backdrop-blur`}
          >
            <div className={`rounded-lg bg-slate-900/60 p-2 ${s.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums text-white">{s.value}</div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
