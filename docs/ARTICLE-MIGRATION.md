# Article Migration Plan — Penn Grey Matters

This document outlines how to migrate each article from the old website (greymattersjournalpenn.org) to the new Next.js site. Per the project spec, **content is manually entered into Sanity** — no automation.

---

## Articles Inventory

| # | Title | Old URL | New Slug | Content Source |
|---|-------|---------|----------|----------------|
| 1 | The Truth Behind Intelligence | `/285-2/` | `truth-behind-intelligence` | Live site (fetched) |
| 2 | Written in our genes? Rethinking Nature and Nurture in Human Potential | `/385-2/` | `written-in-our-genes` | Live site (fetched) |
| 3 | Altered Mitochondrial Trafficking and Its Contribution to Neurodegenerative Disease | `/419-2/` | `altered-mitochondrial-trafficking` | Live site (fetched) |
| 4 | The Shrinking Brain | `/442-2/` | `the-shrinking-brain` | Live site (fetched) |
| 5 | Thinking in Tongues | `/thinking-in-tounges/` | `thinking-in-tongues` | Archive HTML + Live site |

---

## Article Metadata Summary

| Article | Author(s) | Artist | Reading Time | Published | Category |
|---------|-----------|-------|--------------|-----------|----------|
| 1. Truth Behind Intelligence | Jeffery Batres, Elgin Tawiah | Elgin Tawiah | 26 min | 08/31/2025 | Cognition |
| 2. Written in our genes? | Elias Mekuriaw | Elgin Tawiah | 10 min | 10/11/2025 | Cognition |
| 3. Altered Mitochondrial Trafficking | Augustus Clarke | Elgin Tawiah | 8 min | 10/27/2025 | Brain Disorders |
| 4. The Shrinking Brain | Isabelle Chen | Elgin Tawiah | 5 min | 11/22/2025 | Brain Disorders |
| 5. Thinking in Tongues | Hans Manish | Elgin Tawiah | 6 min | 01/18/2026 | Cognition & Memory |

---

## Featured Images

Images are hosted on the live WordPress site. Download and save to `public/images/articles/` or upload to Sanity.

| Article | Image Filename (old site) | Suggested Local Path |
|---------|---------------------------|------------------------|
| 1. Truth Behind Intelligence | `iscreen-shoter-google-chrome-250829211526.jpg` | `public/images/articles/truth-behind-intelligence.jpg` |
| 2. Written in our genes? | `iscreen-shoter-google-chrome-251010165645.jpg` | `public/images/articles/written-in-our-genes.jpg` |
| 3. Altered Mitochondrial Trafficking | `untitled_artwork-1.png` | `public/images/articles/altered-mitochondrial-trafficking.png` |
| 4. The Shrinking Brain | `untitled_artwork-15.png` | `public/images/articles/the-shrinking-brain.png` |
| 5. Thinking in Tongues | `iscreen-shoter-preview-260118203324.jpg` | `public/images/articles/thinking-in-tongues.jpg` |

**Image URLs (WordPress uploads):**
- Base: `https://greymattersjournalpenn.org/wp-content/uploads/YYYY/MM/`
- Example: `https://greymattersjournalpenn.org/wp-content/uploads/2026/01/iscreen-shoter-preview-260118203324.jpg`

---

## Per-Article Migration Plan

### Article 1: The Truth Behind Intelligence

**Slug:** `truth-behind-intelligence`

**Content source:** Live site — `https://greymattersjournalpenn.org/285-2/` (full text fetched)

**Steps:**
1. Open Sanity Studio and create a new Article document.
2. Fill metadata:
   - **title:** The Truth Behind Intelligence: Are We Born With It, Can We Change It – And If So, When Do We Peak?
   - **slug:** truth-behind-intelligence
   - **excerpt:** Explore the neurological and psychological basis of intelligence, when we peak, and whether intelligence can be improved.
   - **author:** Jeffery Batres and Elgin Tawiah
   - **artist:** Elgin Tawiah
   - **category:** Cognition
   - **publishedAt:** 2025-08-31
   - **readingTime:** 26
   - **featuredImage:** Upload or link to `truth-behind-intelligence.jpg`
3. Copy body content from the fetched markdown (agent-tools file or live site). Convert to Portable Text blocks:
   - Introduction (Newton, Einstein, Mozart, Bernstein)
   - What is Intellectual Prime?
   - Neurological Basis of Intelligence
   - Psychological Basis of Intelligence
   - Can intelligence be improved?
   - References (numbered list)
4. Preserve all in-text citations and reference list.

---

### Article 2: Written in our genes?

**Slug:** `written-in-our-genes`

**Content source:** Live site — `https://greymattersjournalpenn.org/385-2/`

**Steps:**
1. Create Article in Sanity.
2. Metadata:
   - **title:** Written in our genes? Rethinking Nature and Nurture in Human Potential
   - **slug:** written-in-our-genes
   - **excerpt:** Twin studies, genetic syndromes, and epigenetics reveal how genes and environment shape who we are.
   - **author:** Elias Mekuriaw
   - **artist:** Elgin Tawiah
   - **category:** Cognition
   - **publishedAt:** 2025-10-11
   - **readingTime:** 10
   - **featuredImage:** Upload or link image
3. Body: Copy from live site. Sections include:
   - Minnesota Study of Twins Reared Apart (Jim twins)
   - Nancy Segal, Robert Plomin
   - Williams Syndrome, Prader-Willi Syndrome
   - Addiction genetics (DRD2, D2A1)
   - Epigenetics, Flynn Effect, nurture
   - References (14 items)

---

### Article 3: Altered Mitochondrial Trafficking

**Slug:** `altered-mitochondrial-trafficking`

**Content source:** Live site — `https://greymattersjournalpenn.org/419-2/`

**Steps:**
1. Create Article in Sanity.
2. Metadata:
   - **title:** Altered Mitochondrial Trafficking and Its Contribution to Neurodegenerative Disease
   - **slug:** altered-mitochondrial-trafficking
   - **excerpt:** How mitochondrial transport in neurons breaks down in Alzheimer's, Parkinson's, and Huntington's disease.
   - **author:** Augustus Clarke
   - **artist:** Elgin Tawiah
   - **category:** Brain Disorders
   - **publishedAt:** 2025-10-27
   - **readingTime:** 8
   - **featuredImage:** Upload or link image
3. Body: Copy from live site. Sections:
   - Golgi, Nissl, mitochondria in neurons
   - Healthy mitochondrial trafficking (kinesin, dynein, Miro, TRAK)
   - AD (amyloid-β, tau), PD (PINK1, Parkin, alpha-synuclein), HD (huntingtin)
   - Therapeutic approaches
   - References (8 items)

---

### Article 4: The Shrinking Brain

**Slug:** `the-shrinking-brain`

**Content source:** Live site — `https://greymattersjournalpenn.org/442-2/`

**Steps:**
1. Create Article in Sanity.
2. Metadata:
   - **title:** The Shrinking Brain
   - **slug:** the-shrinking-brain
   - **excerpt:** How the brain loses volume with age, which regions shrink, and what we can do to slow the process.
   - **author:** Isabelle Chen
   - **artist:** Elgin Tawiah
   - **category:** Brain Disorders
   - **publishedAt:** 2025-11-22
   - **readingTime:** 5
   - **featuredImage:** Upload or link image
3. Body: Copy from live site. Sections:
   - Introduction
   - What parts of the brain shrink? (hippocampus, prefrontal cortex, sex differences)
   - How does it affect us? (proteostasis, white matter, dopamine)
   - Preventative Measures
   - Conclusion
   - References (8 items)

---

### Article 5: Thinking in Tongues

**Slug:** `thinking-in-tongues`

**Content source:** Archive HTML (`old-website-data/Thinking in Tounges – Penn Grey Matters_files/`) + live site. Full content available in both.

**Steps:**
1. Create Article in Sanity.
2. Metadata:
   - **title:** Thinking in Tongues: How Multilingualism Can Preserve Cognitive Function in Aging Adults
   - **slug:** thinking-in-tongues
   - **excerpt:** Multilingualism enhances cognitive reserve, executive function, and memory — and may help prevent neurodegenerative disease.
   - **author:** Hans Manish
   - **artist:** Elgin Tawiah
   - **category:** Cognition & Memory
   - **publishedAt:** 2026-01-18
   - **readingTime:** 6
   - **featuredImage:** Upload or link `iscreen-shoter-preview-260118203324.jpg`
3. Body: Copy from archive HTML or live site. Sections:
   - Introduction (life expectancy, aging)
   - Cognitive Reserve
   - Executive Function
   - Memory
   - Impacts on Neurodegenerative Diseases
   - Conclusion
   - References (7 items)
4. **Note:** Original URL has typo "Tounges" — new slug uses correct spelling "tongues".

---

## Data Structure for Sanity

Each article maps to the `article` schema:

```ts
{
  title: string,
  slug: { current: string },
  excerpt: string,
  body: PortableTextBlock[],
  author: string,
  artist: string,
  category: "Brain Disorders" | "Neurotechnology" | "Cognition" | "Cognition & Memory",
  publishedAt: datetime,
  readingTime: number,  // minutes
  featuredImage: image
}
```

---

## Image Handling

1. **Option A — Download from live site:**
   - Visit each article on greymattersjournalpenn.org
   - Right-click featured image → Save As
   - Save to `public/images/articles/<slug>.<ext>`
   - In Sanity, either reference local path or upload

2. **Option B — Use WordPress URLs temporarily:**
   - Store image URL in Sanity if the old site remains live
   - Risk: URLs may break if the old site is retired

3. **Option C — Sanity image upload:**
   - Download images, then upload directly in Sanity Studio
   - Recommended for long-term ownership

---

## Updating the New Site

After articles are in Sanity:

1. **Articles list page** (`app/articles/page.tsx`): Replace `placeholderArticles` with a Sanity query fetching all articles.
2. **Article detail page** (`app/articles/[slug]/page.tsx`): Replace static `articles` object with a Sanity query by slug.
3. **Homepage**: Update the articles grid to pull from Sanity (or keep featured subset).

If Sanity is not yet connected, use a JSON file at `data/articles.json` that mirrors this structure. The pages can import from that file until Sanity is wired up.

---

## Checklist

- [ ] Download all 5 featured images
- [ ] Create `public/images/articles/` directory
- [ ] Article 1: Truth Behind Intelligence — enter in Sanity
- [ ] Article 2: Written in our genes? — enter in Sanity
- [ ] Article 3: Altered Mitochondrial Trafficking — enter in Sanity
- [ ] Article 4: The Shrinking Brain — enter in Sanity
- [ ] Article 5: Thinking in Tongues — enter in Sanity
- [ ] Connect articles page to Sanity (or `data/articles.json`)
- [ ] Connect article detail page to Sanity
- [ ] Update homepage articles section
- [ ] Add article slugs to `brain-regions.json` `articles` arrays where relevant
