-- New (post-1 July 2025) wards covering former District 7, HCMC.
-- shortcut: former_areas left empty until verified against Resolution 1685/NQ-UBTVQH15.
INSERT INTO "wards" ("name", "slug", "sort_order") VALUES
  ('Tân Thuận', 'tan-thuan', 1),
  ('Phú Thuận', 'phu-thuan', 2),
  ('Tân Mỹ', 'tan-my', 3),
  ('Tân Hưng', 'tan-hung', 4)
ON CONFLICT ("slug") DO NOTHING;
