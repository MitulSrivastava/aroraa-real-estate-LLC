---
name: make-project-page
description: Create a new Dubai/Noida property project page for the Aroraa Real Estate site from a brochure or a details doc. Builds the full <slug>.html page and wires it into dubai-projects.html, sitemap.xml, and llms.txt. Use whenever the user wants to add a new project/property page.
---

# Make a new Aroraa project page

This site is a set of static HTML property pages (Bootstrap 5, no build step). Every
project page shares the same structure — only the content values change. This skill
produces a complete, correctly-wired page so nothing gets forgotten.

## Inputs (flexible)

The user provides project details one of two ways — accept either:
- **A brochure** (PDF/image/text dump) — extract the fields below from it.
- **A details doc / pasted notes** — read the fields straight from it.

**One project or many.** The input may describe a single project or several at once (a
doc listing multiple projects, or multiple brochures). When there are multiple, treat
each as its own project and run the full procedure (Steps 1–5) for each — see
"Batch mode" below.

If a required field is missing from what they gave you, ask for just those fields. Do
not invent prices, RERA numbers, or amenities — if unknown, omit that element rather
than guessing. Marketing copy (overview paragraphs, "why invest" blurbs) you may write.

### Fields to collect
- **Project name** + **developer** (e.g. "Laguna Residence" / "One Development")
- **Region** — **Dubai** or **Noida**. This decides the template, listing page,
  currency, breadcrumb, and geo tags (see Step 0).
- **Slug** — kebab-case, e.g. `laguna-residence`. The **file on disk is `<slug>.html`**,
  but **every link is extensionless** (`href="<slug>"`) — the site rewrites URLs via
  .htaccess. Never put `.html` in an `href`, canonical, OG url, breadcrumb, or sitemap
  `<loc>`. (The *only* place `.html` appears is the `llms.txt` Page line — existing
  convention — and the filename itself.)
- **Location** — area + city (e.g. "Dubai Land, Dubai")
- **Starting price** (e.g. "AED 750K* Onwards") + a one-line price subtitle
- **Property type** (Apartments / Villas / Townhouses / Branded Residences …)
- **Project status badge** (New Launch / Under Construction / Ready …)
- **Unit configuration** (e.g. "Studio, 1 & 2 BHK")
- **3–4 "Why invest" highlights** (icon + title + one line each)
- **4 overview feature cards** (icon + title + one line)
- **Price/config table rows** (unit type, description, price, availability)
- **6-ish amenities** (icon + title + description)
- **Nearby destinations** with drive times (for the Location section)
- **Investor highlights** (bullet list)
- **Images** — see below

### Images
Images live in `images/<Project Name>/`. **The folder name must have no leading or
trailing spaces** (a trailing space like `Fauchon Residences /` deploys but then breaks
`chmod` on the server and is a constant landmine). If the uploaded folder has stray
spaces, `git mv` it to the trimmed name and update every reference before continuing.
**All images on the page must be `.webp`.** The
user often uploads `.jpg`/`.jpeg`/`.png` — convert these to `.webp` and delete the
originals **before** building the page (see Step 1 below). The page needs:
- 1 hero main image + 2 hero sub-images
- 4 gallery carousel images (can reuse hero images if only a few exist)
- 1 listing-card thumbnail (used in the listing page)
Reference them with the exact relative path, e.g.
`images/One Development Laguna/bjgr7qilnqprlxpjnkas.webp`.

## Batch mode (multiple projects at once)

You can process several projects in one run. When the input covers more than one:

1. **First, list the projects** you parsed (name, region, slug, image folder) and show
   that short list back to the user before building, so mismatches are caught early. If
   any project is missing required fields or its image folder, flag just those.
2. **Process them one at a time**, fully completing Steps 1–5 for a project before moving
   to the next. This keeps each project's edits isolated and easy to review.
3. **Each project is independent**: a batch may mix Dubai and Noida — route each to its
   own region's template, listing page, sitemap block, and llms.txt section.
4. **Match images to projects** by folder name (`images/<Project Name>/`). Don't share or
   cross-wire images between projects. If a folder is missing, ask which folder belongs to
   that project rather than guessing.
5. **End with a summary table**: one row per project → slug, region, and the 4 files
   touched, so the user can verify the whole batch at a glance.

Do the work directly (no need to spawn sub-agents); just keep the projects clearly
separated in your edits and output.

## Procedure

### 0. Pick the region (Dubai vs Noida)
Both regions use the **same modern page structure** — only these values differ. Pick the
row that matches and use it throughout:

| | **Dubai (UAE)** | **Noida (India)** |
|---|---|---|
| Copy template from | `laguna-residence.html` | `sobharivana.html` |
| Listing page (Step 3) | `dubai-projects.html` | `properties.html` |
| Currency / price style | `AED 750K* Onwards` | `₹2 Cr* Onwards` / `₹87 Lacs Onwards` |
| Breadcrumb level-2 | "Dubai Projects" → `/dubai-projects` | "Noida Projects" → `/properties` |
| Geo tags | `geo.region` `AE-DU`, `geo.placename` `Dubai`, `content-language` `en-AE` | `geo.region` `IN-UP`, `geo.placename` `Noida`, `content-language` `en-IN` |
| llms.txt section (Step 5) | `## Dubai Property Projects (UAE)` | `## Noida Property Projects (India)` |

Copying the **same-region** template means the geo tags, breadcrumb, and currency are
already correct — you mainly swap content. Both listing pages use an identical
`#properties-grid` card grid, so the Step 3 card markup is the same for either region.

### 1. Convert any JPG/PNG images to .webp (and delete originals)
List the project's image folder first. If it contains any `.jpg`/`.jpeg`/`.png`, convert
each to `.webp` and remove the original (only after a successful convert). Requires
`cwebp` (install once with `brew install webp` if missing). Run from the repo root:

```bash
find "images/<Project Name>" -maxdepth 1 -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0 \
  | while IFS= read -r -d '' f; do
      cwebp -q 82 "$f" -o "${f%.*}.webp" && rm "$f"
    done
```

`-q 82` is a good size/quality balance. After this, the folder should contain only
`.webp` files — reference those in the page. Never link a `.jpg`/`.png` from the HTML.

### 2. Build `<slug>.html`
Copy the region's template file (Step 0) — they are the cleanest current examples. Copy
it and replace every project-specific value. Walk through these spots (all present in the
template):

- `<title>`, meta `description`, meta `keywords`, author stays "Aroraa Real Estate"
- Open Graph `og:title` / `og:description` / `og:url` and Twitter tags
- Canonical link `<link rel="canonical" href="https://aroraarealestate.in/<slug>"/>`
- BreadcrumbList JSON-LD (position-3 name + item = this project)
- Hero: badges, `<h1>` name + "BY <DEVELOPER>", location row, developer line
- Price bar: price, subtitle, status badge
- Project Configuration cards (4), "Why Invest" highlights
- Enquiry form `select` options (match the unit types)
- Project Overview heading + lead paragraph + 4 feature cards
- Property Configuration table rows (+ WhatsApp "Enquire" links with the project name
  URL-encoded in the `?text=` param)
- Gallery carousel (indicators count must match slide count) + captions
- Amenities cards, Location "Nearby Destinations", Investor highlights
- **Leave global blocks byte-for-byte identical**: nav, WhatsApp float, mobile CTA bar,
  contact form (`#contactForm` with hidden `token` field), footer, the two `<script>`
  tags at the end, and the analytics/Lucky Orange snippets in `<head>`.

Keep phone numbers, emails, and office addresses exactly as in the template.

### 3. Add the listing card to the region's listing page
Dubai → `dubai-projects.html`, Noida → `properties.html`. Both have the same
`<div ... id="properties-grid">`. Insert a new card at the **top** of that grid (newest
first), matching the existing card markup. Use the region's currency in the price span.

**IMPORTANT FOR DUBAI:**
For `dubai-projects.html`, the card must include the `developer-card` class and a `data-developer="<slug-of-developer>"` attribute on the outer `div`. Check the `<select id="developer-filter">` block above the grid. If the developer is not already listed there, add a new `<option value="<slug-of-developer>">Developer Name</option>` to the dropdown in alphabetical order.

Pattern for Dubai (see Laguna cards in dubai-projects.html):

```html
<!-- <Project Name> Card -->
<div class="col-lg-3 col-md-6 mb-4 developer-card" data-developer="<developer-slug>">
<div class="property-card bg-white rounded-4 overflow-hidden shadow-sm h-100">
<div class="position-relative">
<img alt="<Project Name>" class="img-fluid w-100 property-img" loading="lazy" src="<card-thumbnail>" style="height: 200px; object-fit: cover;"/>
<div class="position-absolute top-0 start-0 m-3">
<span class="badge bg-primary px-3 py-2 rounded-pill shadow-sm"><Exclusive|Premium|New></span>
</div>
</div>
<div class="p-4">
<div class="d-flex justify-content-between align-items-center mb-3">
<span class="text-primary fw-bold fs-5"><AED price* Onwards></span>
<span class="text-muted small"><i class="fas fa-map-marker-alt me-1"></i><Area></span>
</div>
<h3 class="h5 fw-bold mb-3 text-dark"><Project Name></h3>
<div class="d-flex gap-3 mb-4 text-muted small">
<span><i class="fas fa-star me-2"></i><Tag></span>
<span><i class="fas fa-building me-2"></i><Type></span>
</div>
<a class="btn btn-outline-primary w-100 rounded-pill" href="<slug>">
                  View Details <i class="fas fa-arrow-right ms-2"></i>
</a>
</div>
</div>
</div>
```

### 4. Add to `sitemap.xml`
Dubai → add at the end of the `<!-- Dubai Property Pages -->` block (just before the
`<!-- Noida Property Pages -->` comment). Noida → add at the end of the
`<!-- Noida Property Pages -->` block (before `</urlset>`). Use today's date for
`lastmod` and the extensionless `<loc>`:

```xml
  <url>
    <loc>https://aroraarealestate.in/<slug></loc>
    <lastmod>YYYY-MM-DD</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
```

### 5. Add to `llms.txt`
Add an entry at the end of the region's section (Step 0) — Dubai →
`## Dubai Property Projects (UAE)`, Noida → `## Noida Property Projects (India)` — before
the next `##` heading. Note: the `Page` URL here **includes `.html`** (the only link that
does):

```
### <Project Name>
- **Location**: <Area, City>
- **Type**: <Type>
- **Price**: <price> onwards
- **Developer**: <Developer>
- **Page**: https://aroraarealestate.in/<slug>.html
```

## Finish
- Report the 4 files touched and the new page's path.
- Quick sanity check: gallery indicator count == slide count; canonical/OG URLs use the
  slug; WhatsApp links carry the right project name; no leftover template text from the
  source project.
- Do **not** commit or push unless the user asks.
