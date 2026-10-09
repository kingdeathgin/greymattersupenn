CREATE TABLE IF NOT EXISTS synapse_players (
  id TEXT PRIMARY KEY,
  nickname TEXT,
  created_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS synapse_nickname_unique ON synapse_players(lower(nickname)) WHERE nickname IS NOT NULL;
CREATE TABLE IF NOT EXISTS synapse_runs (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL REFERENCES synapse_players(id),
  day TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  network_key TEXT NOT NULL,
  finished_at INTEGER,
  score INTEGER,
  moves INTEGER,
  elapsed_ms INTEGER
);
CREATE INDEX IF NOT EXISTS synapse_runs_player_day ON synapse_runs(player_id, day);
CREATE INDEX IF NOT EXISTS synapse_runs_network_time ON synapse_runs(network_key, started_at);
CREATE TABLE IF NOT EXISTS synapse_scores (
  day TEXT NOT NULL,
  player_id TEXT NOT NULL REFERENCES synapse_players(id),
  score INTEGER NOT NULL CHECK(score BETWEEN 100 AND 1000),
  moves INTEGER NOT NULL CHECK(moves > 0),
  elapsed_ms INTEGER NOT NULL CHECK(elapsed_ms >= 0),
  PRIMARY KEY(day, player_id)
);
CREATE INDEX IF NOT EXISTS synapse_scores_week ON synapse_scores(day);
