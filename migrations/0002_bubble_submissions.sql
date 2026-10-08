CREATE TABLE IF NOT EXISTS bubble_submissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  drawing TEXT NOT NULL,
  submitted_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS bubble_submissions_state ON bubble_submissions(state);
