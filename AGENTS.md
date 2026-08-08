# Aroraa Real Estate — Agent Guide

Static HTML property website (Bootstrap 5, no build step). Pages are plain `.html` files
served with **extensionless URLs** via `.htaccess` — so the file is `<slug>.html` but every
link uses `href="<slug>"` (never put `.html` in a link, canonical, OG url, breadcrumb, or
sitemap `<loc>`).

## Most common task: add a new project page

When the user wants to add a new **Dubai** or **Noida** property project, follow the full
checklist in **`.claude/skills/make-project-page/SKILL.md`**. It is the source of truth.

Short version:

0. **Normalize images first.** The user may upload `.jpg`/`.jpeg`/`.png` into
   `images/<Project Name>/`. Convert every one to `.webp` and delete the original before
   building the page (requires `cwebp`; `brew install webp` if missing):
   ```bash
   find "images/<Project Name>" -maxdepth 1 -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0 \
     | while IFS= read -r -d '' f; do cwebp -q 82 "$f" -o "${f%.*}.webp" && rm "$f"; done
   ```
   Only `.webp` may be linked from the HTML.

Then the new project touches **4 files**, never just one:

1. Create `<slug>.html` by copying the same-region template and swapping the content:
   - **Dubai** → copy `laguna-residence.html` (prices in **AED**)
   - **Noida** → copy `sobharivana.html` (prices in **₹ Cr/Lacs**)
2. Add a listing card to the region's grid (`#properties-grid`):
   - **Dubai** → `dubai-projects.html`
   - **Noida** → `properties.html`
3. Add a `<url>` entry to `sitemap.xml` (correct region block, extensionless `<loc>`).
4. Add an entry to `llms.txt` (correct region section; the Page URL here **does** keep
   `.html`).

Region differences (template, listing page, currency, breadcrumb, geo tags, sitemap/llms
sections) are tabulated in the SKILL.md "Step 0" table — read it before editing.

Inputs come as a **brochure** (PDF/image) or a **details doc** — accept either, and they
may cover **one project or several at once**. For a batch, first echo back the list of
projects parsed (name/region/slug), then process each one fully and independently (a
batch can mix Dubai + Noida), and finish with a per-project summary. Do not invent prices
or RERA numbers; omit anything unknown. Leave global blocks (nav, footer,
contact form, scripts, analytics) byte-for-byte identical to the template.

Do not commit or push unless asked.

See also `HOW-TO-ADD-PROJECT.md` for the human-facing quick start.
