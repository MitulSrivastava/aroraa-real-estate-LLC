# How to add a new project page (Dubai or Noida)

Use the **`/make-project-page`** skill in Claude Code. It builds the full page and wires
it into every file that needs updating, so nothing gets forgotten.

## Quick steps

1. **Add the images.** Put the project's images in a folder:
   - `images/<Project Name>/`  (e.g. `images/One Development Laguna/`)
   - **JPG / PNG is fine** — the skill auto-converts them to `.webp` and deletes the
     originals for you. (No need to convert anything yourself.)
   - You need at least: 1 hero image, 2 small hero images, 4 gallery images, 1 card thumbnail
     (you can reuse images if you only have a few).

2. **Open Claude Code** in this project and type:
   ```
   /make-project-page
   ```

3. **Give it the project details** — either way works:
   - Paste/attach the **brochure** (PDF, image, or text), **or**
   - Paste your **details doc / notes**.
   - **Multiple projects at once is fine** — paste a doc with several listings (or several
     brochures). It builds each page and lists them back when done. A batch can mix Dubai
     and Noida projects. Just make sure each project's images are in their own
     `images/<Project Name>/` folder.

4. **Tell it the region** if it's not obvious from your details:
   - Say **"Dubai project"** or **"Noida project"**.

That's it. It will create the page and update the 3 other files automatically.

## What it changes for you

| Region | Page created | Listing card added to | Also updated |
|--------|--------------|------------------------|--------------|
| **Dubai** | `<slug>.html` | `dubai-projects.html` | `sitemap.xml`, `llms.txt` |
| **Noida** | `<slug>.html` | `properties.html` | `sitemap.xml`, `llms.txt` |

(`<slug>` = the kebab-case name, e.g. `laguna-residence`.)

## Details to have ready (it'll ask if any are missing)

- Project name + developer
- Location (area + city)
- Starting price — **Dubai = AED**, **Noida = ₹ (Cr/Lacs)**
- Property type (Apartments / Villas / Branded Residences…)
- Status badge (New Launch / Under Construction / Ready)
- A few amenities, nearby places with drive times, and investment highlights

> Tip: It will **not** invent prices or RERA numbers — give it those, or it leaves them out.

## After it runs

- Review the new page in a browser (just open `<slug>.html`).
- It does **not** commit or push — tell Claude "commit and push" when you're happy.

---
*The detailed rules live in `.claude/skills/make-project-page/SKILL.md` — you don't need
to read that; the skill follows it automatically.*
