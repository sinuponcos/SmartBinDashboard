/*
# Relocate smart bins to Mumbai, India

1. Changes
- Update all 10 smart_bins rows with new Indian location names and coordinates
  in and around South Mumbai (Colaba, Marine Drive, Worli, etc.).
- Update fill_percent to new initial values for a fresh demo state.
- Update the depot reference (no depot table — depot is in app code).

2. Security
- No policy changes. Existing anon CRUD policies remain in place.

3. Important Notes
- This is a pure data UPDATE — no schema changes, no new columns.
- All coordinates are within Mumbai (approx lat 18.92–19.07, lng 72.80–72.85).
*/

UPDATE smart_bins SET name = 'Gateway of India — Colaba',         lat = 18.9220, lng = 72.8347, fill_percent = 92  WHERE id = 'BIN-01';
UPDATE smart_bins SET name = 'Marine Drive — Nariman Point',      lat = 18.9430, lng = 72.8230, fill_percent = 67  WHERE id = 'BIN-02';
UPDATE smart_bins SET name = 'Crawford Market — CST',             lat = 18.9500, lng = 72.8350, fill_percent = 88  WHERE id = 'BIN-03';
UPDATE smart_bins SET name = 'Horniman Circle — Fort',            lat = 18.9600, lng = 72.8330, fill_percent = 34  WHERE id = 'BIN-04';
UPDATE smart_bins SET name = 'Chowpatty Beach — Girgaon',         lat = 18.9720, lng = 72.8200, fill_percent = 75  WHERE id = 'BIN-05';
UPDATE smart_bins SET name = 'Worli Sea Face — Worli',            lat = 19.0170, lng = 72.8180, fill_percent = 96  WHERE id = 'BIN-06';
UPDATE smart_bins SET name = 'Haji Ali — Worli',                  lat = 18.9930, lng = 72.8250, fill_percent = 58  WHERE id = 'BIN-07';
UPDATE smart_bins SET name = 'Lower Parel — Phoenix Mall',        lat = 19.0100, lng = 72.8310, fill_percent = 12  WHERE id = 'BIN-08';
UPDATE smart_bins SET name = 'Mahalaxmi Race Course',             lat = 18.9870, lng = 72.8250, fill_percent = 84  WHERE id = 'BIN-09';
UPDATE smart_bins SET name = 'Peddar Road — Grant Road',          lat = 18.9750, lng = 72.8100, fill_percent = 47  WHERE id = 'BIN-10';
