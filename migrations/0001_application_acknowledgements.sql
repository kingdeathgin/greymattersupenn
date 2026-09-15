CREATE TABLE IF NOT EXISTS application_acknowledgements (
  email TEXT PRIMARY KEY,
  confirmed_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS application_admin_attempts (
  client_key TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL,
  window_start INTEGER NOT NULL
);
