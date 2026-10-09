# Mindwalk

The approved original maze is the featured game at `/mindwalk`, with `/mindwalk/classic` retained as an alternate route. Existing browser progress and streaks remain intact. A source snapshot is stored at `output/game-archive/mindwalk-classic-2026-10-09.zip`.

## Play

Study a 6 × 6 maze for eight seconds, or choose relaxed study with no countdown. Once walking begins, walls disappear; the three thoughts and exit stay visible. Move with arrow keys, WASD, direction buttons, or adjacent-square taps. Collect all three thoughts in any order, then reach the exit. Bumping a wall leaves the player in place and reveals that wall. A peek shows the map for two seconds and pauses movement.

Each walk starts with 1,000 points. The final score deducts 20 per step beyond the shortest possible route, 50 per wall bump, and 100 per peek, with a minimum of 100 points. There is no movement timer or elimination. Results show steps, bumps, peeks, and score, and can be copied without revealing the map.

## Daily and practice

Daily maps are deterministic for the Eastern calendar date. Refreshing restores the current daily phase, study deadline, and walk. Practice generates fresh maps and keeps the saved daily walk intact. Completed daily dates determine the browser’s local streak. Relaxed-mode results are labeled in the interface and shared text. No account or public leaderboard is required; scores and streaks are local, not verified competitive rankings.

The generator places twelve walls while keeping every open square reachable. Three distinct thoughts are spaced apart. It searches for a map with a shortest complete route of 20–32 steps. The route solver checks the six thought orders and shortest paths between objectives.

## Checks

- `node --test tests/mindwalk.test.mjs` checks a year of maps, route completion, scoring, wall feedback, movement boundaries, and saved-state validation.
- `npx tsc --noEmit` and targeted ESLint check types and component usage.
- A local headless Chrome check covers study, keyboard play, peeking, completion, saved progress, streaks, practice/daily navigation, the legacy redirect, and phone/tablet layout.

The old Synapse API and database files are retained for compatibility with existing records. Mindwalk does not call that API.
