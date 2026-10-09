# Synapse Sprint

Original Grey Matters at Penn daily deduction game at `/synapse-sprint`. The homepage promotes it immediately after the social media feature.

A daily code contains five distinct signals chosen from eight, in order. Players get six guesses and two truthful clues: two signals appear in relative order, and exactly one of another pair appears. Feedback gives aggregate exact-position and misplaced counts, never individual tile answers. The clues leave hundreds of possible sequences; players combine feedback to narrow them down. Symbols have names and shapes as well as colors.

The answer is generated only in `lib/synapse-secret.ts` (server-only), never in browser code or unfinished API responses. The server evaluates every guess, saves it before replying, and reveals the answer after a solve or six guesses. The same browser resumes its round after refresh. Concurrent updates use optimistic comparison of stored history; stale tabs cannot overwrite guesses. Repeated guesses are rejected without spending an attempt.

There is one ranked round per player cookie per Eastern day, with no ranked restart. Clearing cookies can create another identity, so this is a casual community leaderboard, not a prize competition. Successful rounds earn 1,000 points minus 120 for each additional guess; six-guess solves earn 400. The weekly leaderboard sums daily points Monday–Sunday Eastern, with server-measured total solving time as a tie-breaker. Unsolved rounds cannot publish. Publishing a score is idempotent and requires an optional public nickname; nickname uniqueness is case-insensitive. No fake leaderboard entries are seeded.

Storage uses separate `synapse_*` tables in the existing D1 binding, introduced by migrations 0004 and 0005. It does not access application information. The player cookie is opaque, HttpOnly and SameSite strict; writes require same-origin requests and player ownership. New-round creation is limited by a daily hashed network address. If storage is unavailable, display a retry state rather than an unverified score. Scratchpad marks are temporary private browser state.

Verify with `node --test tests/synapse.test.mjs`, `npx tsc --noEmit`, and `npm run build`. After local migrations and a local Next server, run `node tests/synapse-api.mjs` (restricted to localhost). Browser verification covers keyboard/signal selection, editing a draft, feedback, refresh persistence, result and nickname saving, six-guess failure, and phone/tablet layouts. API tests create only local test entries.
