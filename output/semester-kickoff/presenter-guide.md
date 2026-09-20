# Grey Matters at Penn — Fall 2026 kickoff

Open `grey-matters-kickoff.pptx` in PowerPoint or Keynote. Text and images are editable; each slide has presenter notes. Alternatively, open `grey-matters-kickoff.html` in a browser: it works offline with all artwork embedded. Use arrow keys, fullscreen, N for notes, and the three-minute activity timer. Print / PDF exports the slides from the browser.

Allow about 25–30 minutes, plus election time. Start with the six-word headline activity on slide 2. Slide 11 adds a short cross-team pitch challenge. Slides 6–10 explain the five positions. Slides 12–13 introduce the four leaders with portraits from the website; slide 14 covers proposed lead responsibilities.

## Before the election

The user has not supplied candidates, open positions or a hosted poll link. Slides 15–16 therefore introduce a usable paper-ballot process rather than implying that a live online election exists. Confirm positions, seat counts, consenting candidates, eligible voters, closing time and tie rules before voting. The paper slips assume one seat per race. Print `lead-election-ballots.html` and announce the choices. Use two counters; a runoff for tied candidates is a suggested rule to agree on in advance.

If using an online poll, create the confirmed ballot in the club’s preferred service and configure its voting rules. In the HTML deck, “Add poll link” puts your HTTPS URL on slide 16 for the current session. In PowerPoint, edit slide 16 to include the link. The presentation itself does not collect votes or prevent duplicate submissions.

## Content and credits

Mission: `app/about/page.tsx`. Leaders and portrait assets: the live https://greymattersjournalpenn.com/team page, verified 2026-09-19, with matching local data in `data/team.json` and the Leadership selection in `app/team/page.tsx`. Leaders: Elgin Tawiah (Editor-in-Chief), Elias Mekuriaw (Co-Editor-in-Chief), Livia De La Rosa (Podcast Director), Hans Manish (Lead Editor). Existing leaders are not automatically election candidates. Role workflows and election rules are suggested facilitation content, not established club bylaws.

Art credits and article titles: `data/articles.json`. Decorative cover excerpts credit Elgin Tawiah as artist. The deck preserves the original brush-edge cover, uses full-art backgrounds with paper panels and angled art strips, and incorporates an isolated motor-protein-and-cargo illustration on slide 5, with a different artwork on every slide, plus paint-droplet masks and layered flowing panels; portraits are taken from the website’s existing assets. Stories: Elias Mekuriaw (The Accelerating Clock; Written in our genes?), Hans Manish (Thinking in Tongues), Augustus Clarke (Altered Mitochondrial Trafficking), Isabelle Chen (The Shrinking Brain).

The transparent motor-and-cargo asset was adapted using the built-in imagegen tool from `public/images/articles/inline/mitochondrial-synapse-v2.png`. It is a stylized illustration, not a molecular model. Prompt: isolate the left complete orange motor, its two feet and stalk, and its turquoise cargo; remove the second motor, track and background; preserve the watercolor subject with a clean transparent silhouette. A second pass removed any outside halo. The final asset is `assets/motor-cargo-cutout-clean.png`.

Rebuild both decks and ballots with `python3 scripts/generate-kickoff-presentation.py`.
