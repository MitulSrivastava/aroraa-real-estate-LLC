# Deploying Aroraa Real Estate to Hostinger

The whole site is static files. The only thing that has ever gone wrong is
**uploading to the wrong folder**: Hostinger's File Manager has two entry
points, and only one is the live document root for `aroraarealestate.in`.

There are two ways to deploy. Use **Option A** for a guaranteed correct
deploy; use **Option B** for a quick manual one.

---

## Option A — One command (recommended, repeatable)

This pushes your local files straight to the correct folder and **verifies**
it by checking the live URL, so you can't silently deploy to the wrong place.

### First-time setup (once)
```bash
brew install lftp            # the upload tool (macOS)
cp .env.example .env         # then edit .env with your FTP details
```
Get the FTP details from **hPanel → Websites → aroraarealestate.in →
Files → FTP Accounts** (create an FTP account for this website if needed).

### Every deploy
```bash
./deploy.sh
```
What it does:
1. Uploads a hidden test file and checks `https://aroraarealestate.in/...`
   to confirm `REMOTE_DIR` really is the live root. If not, it **stops** and
   tells you to fix `REMOTE_DIR` (usually `domains/aroraarealestate.in/public_html`).
2. Mirrors all new/changed files up.
3. Spot-checks the three Dubai project images and prints `200` when live.

Just want to test the folder is right? `./deploy.sh --verify`

---

## Option B — Manual upload via File Manager

1. **hPanel → File Manager → click "Access files of aroraarealestate.in"**
   (NOT "Access all files of Premium Web Hosting" — that's the wrong root and
   is what broke the images before).
2. Confirm you're in the right place: create `zztest.txt`, save, open
   `https://aroraarealestate.in/zztest.txt`. It must show your text.
3. Upload `deploy-clean.zip` into that `public_html`, then **Extract** it
   (overwrite when asked).
4. If the three project image folders already exist but are empty, **delete
   them first**, then extract — Hostinger does not overwrite into existing
   folders.

`deploy-clean.zip` is a junk-free copy of the whole site (no `.git`, no other
zips, no `.DS_Store`). Rebuild it anytime with:
```bash
zip -r deploy-clean.zip . -x '*.zip' -x '.git/*' -x '*/.DS_Store' \
  -x '.vscode/*' -x '*.pdf' -x 'deploy.sh' -x '.env' -x 'DEPLOY.md' -x '.gitignore'
```

---

## The recurring gotcha (read this)

- **Two folders look identical.** The live site serves from ONE specific
  `public_html`. Uploading to the other one does nothing visible.
- **Hostinger won't overwrite into an existing folder on extract.** If a
  folder is already there (even empty), delete it before re-extracting.
- **CDN/cache purge does NOT fix a wrong-folder upload** — the files simply
  aren't where the site reads from. Always verify with a test file + the live
  URL (Option A does this automatically).
