import type { Bin } from "@/types";

export const DEPOT: { lat: number; lng: number; name: string } = {
  lat: 18.9900,
  lng: 72.8270,
  name: "Municipal Depot — Haji Ali Garage",
};

export const INITIAL_BINS: Bin[] = [
  { id: "BIN-01", name: "Gateway of India — Colaba",        lat: 18.9220, lng: 72.8347, fillPercent: 92, capacityLiters: 1200, lastUpdated: "2 min ago" },
  { id: "BIN-02", name: "Marine Drive — Nariman Point",     lat: 18.9430, lng: 72.8230, fillPercent: 67, capacityLiters: 1200, lastUpdated: "5 min ago" },
  { id: "BIN-03", name: "Crawford Market — CST",            lat: 18.9500, lng: 72.8350, fillPercent: 88, capacityLiters: 1200, lastUpdated: "1 min ago" },
  { id: "BIN-04", name: "Horniman Circle — Fort",           lat: 18.9600, lng: 72.8330, fillPercent: 34, capacityLiters: 1200, lastUpdated: "8 min ago" },
  { id: "BIN-05", name: "Chowpatty Beach — Girgaon",         lat: 18.9720, lng: 72.8200, fillPercent: 75, capacityLiters: 1200, lastUpdated: "3 min ago" },
  { id: "BIN-06", name: "Worli Sea Face — Worli",           lat: 19.0170, lng: 72.8180, fillPercent: 96, capacityLiters: 1200, lastUpdated: "just now" },
  { id: "BIN-07", name: "Haji Ali — Worli",                  lat: 18.9930, lng: 72.8250, fillPercent: 58, capacityLiters: 1200, lastUpdated: "6 min ago" },
  { id: "BIN-08", name: "Lower Parel — Phoenix Mall",       lat: 19.0100, lng: 72.8310, fillPercent: 12, capacityLiters: 1200, lastUpdated: "12 min ago" },
  { id: "BIN-09", name: "Mahalaxmi Race Course",             lat: 18.9870, lng: 72.8250, fillPercent: 84, capacityLiters: 1200, lastUpdated: "4 min ago" },
  { id: "BIN-10", name: "Peddar Road — Grant Road",          lat: 18.9750, lng: 72.8100, fillPercent: 47, capacityLiters: 1200, lastUpdated: "7 min ago" },
];
