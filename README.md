# Penn Grey Matters

<div align="center">
  <img src="public/main-image.png" alt="Penn Grey Matters" width="320">
</div>

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-2563EB?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Three Fiber](https://img.shields.io/badge/R3F-interactive_3D-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://docs.pmnd.rs/react-three-fiber)
[![Sanity](https://img.shields.io/badge/Sanity-CMS-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)](https://www.sanity.io/)

Website for **Penn Grey Matters** — the UPenn student neuroscience publication. Articles, a 3D brain you can poke at, podcast and research pages (content still rolling in), and the usual about/team/join stuff.

Built with Next.js 15, TypeScript, Tailwind v4, Framer Motion, and React Three Fiber. Content lives in JSON files for now; Sanity schema is sketched out in `sanity/schema.ts`.

## Table of Contents

- [What's on the site](#whats-on-the-site)
- [Grey Matter](#grey-matter)
- [Run it](#run-it)
- [Repo layout](#repo-layout)
- [Routes](#routes)

---

## What's on the site

**Home** opens with a preloader, then the hero expands. Below that: a scrolling row of recent articles, a neuron web that draws itself as you scroll, the about blurb, and a slice of the Grey Matter brain explorer.

<p align="center">
  <img src="media/landing_page.png" alt="Landing page" width="88%">
</p>

**Articles** — archive and individual post pages with related reads.

**Grey Matter** (`/explore`) — drag to rotate a 3D brain, click regions in the side panel (hippocampus, amygdala, prefrontal cortex, etc.) for functions and facts. Same layout shows up on the homepage. See [Grey Matter](#grey-matter) below.

**Podcast & Research** — Grey Frequencies (`/podcast`) and Research Spotlight (`/research`). Pages are built with coming-soon layouts; episodes and faculty spotlights get added when they're ready.

<table>
  <tr>
    <td align="center" width="50%">
      <img src="media/podcast_page.png" alt="Grey Frequencies podcast page" width="100%"><br>
      <sub><code>/podcast</code> · Grey Frequencies</sub>
    </td>
    <td align="center" width="50%">
      <img src="media/research_page.png" alt="Research spotlight page" width="100%"><br>
      <sub><code>/research</code> · Research Spotlight</sub>
    </td>
  </tr>
</table>

**Get Involved** (`/get-involved`) — recruitment page and join form. Writers, designers, researchers, podcast hosts, devs.

<p align="center">
  <img src="media/get_involved_page.png" alt="Get involved page" width="75%">
</p>

**Chapters, Team, About, Contact** — chapters map, editorial roster, mission statement, contact form.

---

## Grey Matter

3D brain model at `public/models/brain/scene.gltf`. Region copy in `data/brain-regions.json`. UI is `BrainCanvas` + `BrainRegionsPanel`, bundled as `GreyMatterExplorer`.

<p align="center">
  <img src="media/3d_brain.gif" alt="Grey Matter brain explorer" width="65%">
</p>

---

## Run it

```bash
git clone https://github.com/tmarhguy/greymattersupenn.git
cd greymattersupenn
npm install
npm run dev
```

→ [localhost:3000](http://localhost:3000)

`.env.local` if you need forms or Sanity:

| Variable | For |
|----------|-----|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | CMS |
| `RESEND_API_KEY` | Contact / newsletter |
| `EDITORIAL_EMAIL` | Where contact submissions go |

---

## Repo layout

```
app/           pages + API routes
components/    UI (hero, articles, explore, neuron-network, …)
data/          articles.json, brain-regions.json, team, chapters
public/        images, brain model, logo
media/         screenshots for this README
sanity/        CMS schema (not wired up yet)
docs/          article migration notes
```

---

## Routes

| Path | What |
|------|------|
| `/` | Home |
| `/articles`, `/articles/[slug]` | Archive + post |
| `/explore` | Grey Matter |
| `/podcast`, `/research` | Coming soon |
| `/chapters`, `/team`, `/about` | Info |
| `/get-involved`, `/contact` | Forms |
