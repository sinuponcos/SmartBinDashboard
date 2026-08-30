import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export interface BinRow {
  id: string;
  name: string;
  lat: number;
  lng: number;
  fill_percent: number;
  capacity_liters: number;
  updated_at: string;
}
