# Bubble activity

`/` temporarily redirects to `/bubble`. The original homepage remains intact.

Students draw, enter their name, city, US home state, and 1–3 drawing themes, and submit to Cloudflare D1.
A seven-day HttpOnly receipt cookie restores their saved drawing on the same
browser. Each name may submit once (ignoring case and surrounding spaces). Changing names
creates a separate submission without overwriting the previous drawing. Duplicate
names are rejected atomically on the server, including across browsers.
Unsaved edits remain in memory. The downloadable SVG is a separate personal copy.

Typing `Elgin` (case-insensitive) immediately shows the class-map button; no
submission is required to sign in.
The gallery password is `elgin` (overridable with `BUBBLE_ADMIN_PASSWORD`).
`APPLICATION_ADMIN_PASSWORD` remains the server-side signing secret; the login
password for the application admin area is unchanged. The gallery checks
authorization before loading any class data. Bubble admin
sessions are separately signed and scoped. Elgin's drawing is included normally.
The map groups by state, lists cities, has Alaska/Hawaii insets, and refreshes every
15 seconds. State shading averages Jaccard overlap between student-selected themes
and the reference drawing, excluding the reference itself. Untagged legacy drawings
remain visible but unscored. Geographic distance does not affect similarity.

Before deploying this feature, apply the additive production migration:

```sh
npx wrangler d1 migrations apply APPLICATION_DB --remote
npm run deploy
```

The existing `APPLICATION_DB` binding and `APPLICATION_ADMIN_PASSWORD` secret must
be available to the worker. No new external map service or key is required.

Checks:

```sh
node --test tests/bubble.test.mjs
npx eslint app/bubble lib/bubble*.ts tests/bubble.test.mjs
npx tsc --noEmit
npm run build
```

Browser verification should cover: blank submission, required name/city/state/themes, stickers,
resizing and dragging, pen/text, successful save, reload, duplicate rejection, a second name in the same browser, an
unauthorized gallery visit, wrong/correct admin password, map filters, expanded
drawings, sign-out, and mobile width.

The map's **View stats** button ranks categories across the full class, counting
each submission once per chosen theme. Percentages use submissions with themes.
**Clear map** requires an authenticated admin and an in-page confirmation. It
deletes only bubble submissions, clears the current receipt, resets the map/stats,
and frees all names for resubmission. Open drawing tabs recheck saved status on
focus and every ten seconds. Admin authentication remains active after a reset.
