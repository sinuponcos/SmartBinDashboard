import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { BinRow } from "@/lib/supabase";
import type { Bin } from "@/types";

function rowToBin(row: BinRow): Bin {
  return {
    id: row.id,
    name: row.name,
    lat: row.lat,
    lng: row.lng,
    fillPercent: row.fill_percent,
    capacityLiters: row.capacity_liters,
    lastUpdated: formatRelative(row.updated_at),
  };
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 10) return "just now";
  if (sec < 60) return `${sec} sec ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  return `${hr} hr ago`;
}

export function useBins() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const refreshRelativeTimes = useCallback(() => {
    setBins((prev) =>
      prev.map((b) => {
        const row = { updated_at: b.lastUpdated } as BinRow;
        return b;
      }),
    );
  }, []);

  const loadBins = useCallback(async () => {
    const { data, error } = await supabase
      .from("smart_bins")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (data) {
      setBins((data as BinRow[]).map(rowToBin));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBins();

    const channel = supabase
      .channel("smart_bins_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "smart_bins" },
        (payload) => {
          const row = payload.new as BinRow;
          setBins((prev) =>
            prev.map((b) => (b.id === row.id ? rowToBin(row) : b)),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadBins]);

  const updateFill = useCallback((id: string, fillPercent: number) => {
    // Optimistic local update
    setBins((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, fillPercent, lastUpdated: "just now" } : b,
      ),
    );

    // Debounce the DB write so dragging a slider doesn't spam requests
    if (debounceRef.current[id]) clearTimeout(debounceRef.current[id]);
    debounceRef.current[id] = setTimeout(async () => {
      const { error } = await supabase
        .from("smart_bins")
        .update({ fill_percent: fillPercent })
        .eq("id", id);
      if (error) console.error("Failed to update bin:", error.message);
    }, 400);
  }, []);

  const updateAllFills = useCallback(async (updates: { id: string; fillPercent: number }[]) => {
    for (const u of updates) {
      const { error } = await supabase
        .from("smart_bins")
        .update({ fill_percent: u.fillPercent })
        .eq("id", u.id);
      if (error) console.error("Failed to update bin:", error.message);
    }
  }, []);

  const resetBins = useCallback(async () => {
    const initialFills: Record<string, number> = {
      "BIN-01": 92, "BIN-02": 67, "BIN-03": 88, "BIN-04": 34, "BIN-05": 75,
      "BIN-06": 96, "BIN-07": 58, "BIN-08": 12, "BIN-09": 84, "BIN-10": 47,
    };
    const updates = Object.entries(initialFills).map(([id, fillPercent]) => ({ id, fillPercent }));
    await updateAllFills(updates);
    setBins((prev) =>
      prev.map((b) => ({
        ...b,
        fillPercent: initialFills[b.id] ?? b.fillPercent,
        lastUpdated: "just now",
      })),
    );
  }, [updateAllFills]);

  return { bins, setBins, loading, error, updateFill, resetBins, refreshRelativeTimes };
}
