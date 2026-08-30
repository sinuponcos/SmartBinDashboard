/*
# Create smart_bins table for IoT waste bin monitoring

1. New Tables
- `smart_bins`
  - `id` (text, primary key) — bin identifier like "BIN-01"
  - `name` (text, not null) — human-readable location name
  - `lat` (double precision, not null) — latitude coordinate
  - `lng` (double precision, not null) — longitude coordinate
  - `fill_percent` (double precision, not null, default 0) — current fill level 0–100
  - `capacity_liters` (integer, not null, default 1200) — bin capacity in liters
  - `updated_at` (timestamptz, default now()) — last sensor reading timestamp

2. Security
- Enable RLS on `smart_bins`.
- Single-tenant (no sign-in): allow anon + authenticated full CRUD so the
  dashboard can read and update bin levels via the anon key.

3. Seed Data
- 10 bins across Midtown Manhattan with initial fill levels and coordinates.
- One row per bin matching the dashboard's INITIAL_BINS.

4. Important Notes
- The `fill_percent` column is the only value the dashboard updates at runtime;
  name/coordinates/capacity are static reference data.
- `updated_at` auto-updates on every row change via a trigger, so the frontend
  can display "last updated" times without the client setting them.
*/

CREATE TABLE IF NOT EXISTS smart_bins (
  id text PRIMARY KEY,
  name text NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  fill_percent double precision NOT NULL DEFAULT 0 CHECK (fill_percent >= 0 AND fill_percent <= 100),
  capacity_liters integer NOT NULL DEFAULT 1200,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE smart_bins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_bins" ON smart_bins;
CREATE POLICY "anon_select_bins" ON smart_bins FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_bins" ON smart_bins;
CREATE POLICY "anon_insert_bins" ON smart_bins FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_bins" ON smart_bins;
CREATE POLICY "anon_update_bins" ON smart_bins FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_bins" ON smart_bins;
CREATE POLICY "anon_delete_bins" ON smart_bins FOR DELETE
  TO anon, authenticated USING (true);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_smart_bins_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_smart_bins_updated_at ON smart_bins;
CREATE TRIGGER trg_smart_bins_updated_at
  BEFORE UPDATE ON smart_bins
  FOR EACH ROW
  EXECUTE FUNCTION update_smart_bins_updated_at();

-- Seed the 10 bins
INSERT INTO smart_bins (id, name, lat, lng, fill_percent, capacity_liters) VALUES
  ('BIN-01', 'Hudson Yards — 33rd St', 40.7536, -74.0011, 92, 1200),
  ('BIN-02', 'Times Square — 45th St', 40.7587, -73.9855, 67, 1200),
  ('BIN-03', 'Bryant Park — 42nd St', 40.7536, -73.9832, 88, 1200),
  ('BIN-04', 'Grand Central — 42nd & Lex', 40.7527, -73.9776, 34, 1200),
  ('BIN-05', 'Rockefeller Plaza — 50th St', 40.7587, -73.9787, 75, 1200),
  ('BIN-06', 'Columbus Circle — 59th St', 40.7681, -73.9819, 96, 1200),
  ('BIN-07', 'Penn Station — 33rd & 7th', 40.7505, -73.9934, 58, 1200),
  ('BIN-08', 'Madison Square — 23rd St', 40.7414, -73.9874, 12, 1200),
  ('BIN-09', 'Union Square — 14th St', 40.7359, -73.9911, 84, 1200),
  ('BIN-10', 'Flatiron — 22nd & 5th', 40.7422, -73.9894, 47, 1200)
ON CONFLICT (id) DO NOTHING;
