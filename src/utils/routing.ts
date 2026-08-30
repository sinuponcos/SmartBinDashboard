import type { Bin } from "@/types";
import { DEPOT } from "@/data/bins";

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export interface RouteStop {
  bin: Bin;
  order: number;
  legKm: number;
  cumulativeKm: number;
}

export interface RoutePlan {
  stops: RouteStop[];
  totalKm: number;
  depotReturnKm: number;
}

/**
 * Nearest-neighbor TSP heuristic: starts at the depot, greedily visits the
 * nearest unvisited high-priority bin, then returns to the depot.
 */
export function computeRoute(highPriorityBins: Bin[]): RoutePlan {
  const stops: RouteStop[] = [];
  let totalKm = 0;
  let current = { lat: DEPOT.lat, lng: DEPOT.lng };

  const unvisited = [...highPriorityBins].sort((a, b) => b.fillPercent - a.fillPercent);

  for (let i = 0; i < unvisited.length; i++) {
    let nearestIdx = 0;
    let nearestDist = Infinity;
    for (let j = 0; j < unvisited.length; j++) {
      const d = haversineKm(current, unvisited[j]);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = j;
      }
    }
    const next = unvisited.splice(nearestIdx, 1)[0];
    totalKm += nearestDist;
    stops.push({
      bin: next,
      order: stops.length + 1,
      legKm: nearestDist,
      cumulativeKm: totalKm,
    });
    current = { lat: next.lat, lng: next.lng };
  }

  const depotReturnKm = stops.length > 0 ? haversineKm(current, DEPOT) : 0;
  totalKm += depotReturnKm;

  return { stops, totalKm, depotReturnKm };
}
