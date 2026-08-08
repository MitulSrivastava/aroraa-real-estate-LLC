#!/usr/bin/env bash
#
# Aroraa Real Estate — one-command deploy to Hostinger over FTP.
#
# Why this exists: the live site serves from ONE specific document root.
# Uploading to the wrong public_html (the "Access all files" view in hPanel)
# silently does nothing. This script uploads to the dir you configure AND
# verifies it by checking a real URL on the live site, so a wrong folder
# fails loudly instead of wasting your afternoon.
#
# Usage:
#   1. cp .env.example .env   and fill in your FTP details
#   2. ./deploy.sh            (full sync)
#      ./deploy.sh --verify   (only run the docroot verification check)
#
set -euo pipefail

cd "$(dirname "$0")"

# ---- load config ----
if [[ ! -f .env ]]; then
  echo "ERROR: no .env file. Run:  cp .env.example .env   then edit it." >&2
  exit 1
fi
# shellcheck disable=SC1091
source .env

: "${FTP_HOST:?set FTP_HOST in .env}"
: "${FTP_USER:?set FTP_USER in .env}"
: "${FTP_PASS:?set FTP_PASS in .env}"
: "${REMOTE_DIR:?set REMOTE_DIR in .env}"
: "${SITE_URL:?set SITE_URL in .env}"

# ---- require lftp ----
if ! command -v lftp >/dev/null 2>&1; then
  echo "ERROR: 'lftp' is not installed. Install it once with:" >&2
  echo "   brew install lftp" >&2
  exit 1
fi

# ---- pre-flight: reject leading/trailing spaces in image paths ----
# A stray space in a folder name (e.g. "Fauchon Residences /") uploads fine but
# then breaks chmod on the server (550 No such file or directory) and is invisible
# in Finder. Catch it locally and fail loudly before touching the server.
bad_paths=$(find images \( -name '* ' -o -name ' *' \) 2>/dev/null || true)
if [[ -n "$bad_paths" ]]; then
  echo "ERROR: these image paths have a leading/trailing space — fix before deploying:" >&2
  echo "$bad_paths" | sed 's/^/   /' >&2
  echo "   Fix:  git mv \"images/Bad Name \" \"images/Bad Name\"   then update the HTML refs." >&2
  exit 1
fi

TOKEN="deploycheck-$(date +%s)"
CHECK_FILE="__deploycheck.txt"

verify_docroot() {
  echo "==> Verifying REMOTE_DIR ('$REMOTE_DIR') is the live document root..."
  echo "$TOKEN" > "/tmp/$CHECK_FILE"
  lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" <<EOF >/dev/null 2>&1
set ftp:ssl-allow no
set ftp:use-feat false
set ftp:passive-mode true
cd "$REMOTE_DIR"
put -O . "/tmp/$CHECK_FILE"
bye
EOF
  sleep 2
  local got
  got=$(curl -s -L "$SITE_URL/$CHECK_FILE" || true)
  if [[ "$got" == "$TOKEN" ]]; then
    echo "    OK — '$REMOTE_DIR' IS the live root. ($SITE_URL/$CHECK_FILE served the token)"
    # clean up the check file
    lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" <<EOF >/dev/null 2>&1
set ftp:ssl-allow no
set ftp:use-feat false
set ftp:passive-mode true
cd "$REMOTE_DIR"
rm -f "$CHECK_FILE"
bye
EOF
    return 0
  else
    echo "    FAIL — $SITE_URL/$CHECK_FILE did NOT return the token." >&2
    echo "    => '$REMOTE_DIR' is NOT the live document root for this site." >&2
    echo "    Fix: in .env set REMOTE_DIR to the real root and re-run." >&2
    echo "         Common value: domains/aroraarealestate.in/public_html" >&2
    return 1
  fi
}

if [[ "${1:-}" == "--verify" ]]; then
  verify_docroot
  exit $?
fi

# ---- verify first, refuse to deploy to the wrong place ----
verify_docroot || exit 1

echo "==> Mirroring local site -> $FTP_HOST:$REMOTE_DIR (uploading new/changed files)..."
lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" <<EOF
set ftp:ssl-allow no
set ftp:use-feat false
set ftp:passive-mode true
set mirror:parallel-transfer-count 3
cd "$REMOTE_DIR"
lcd "."
mirror --reverse --verbose --only-newer \
  --exclude-glob .git/ \
  --exclude-glob .git \
  --exclude-glob .DS_Store \
  --exclude-glob .vscode/ \
  --exclude-glob '*.zip' \
  --exclude-glob '*.pdf' \
  --exclude-glob .env \
  --exclude-glob .env.example \
  --exclude-glob deploy.sh \
  --exclude-glob .gitignore \
  --exclude-glob DEPLOY.md
# Safeguard: ensure all image folders are world-traversable (755).
# A folder uploaded as 700 returns 404 for the files inside because the
# web server runs as a different user and can't enter it. This bit us once.
chmod -R 755 images
bye
EOF

echo ""
echo "==> Deploy complete. Spot-checking the three Dubai images on the live site..."
for p in \
  images/greenz-danube/property-img-1.webp \
  images/serenz-danube/property-img-1.webp \
  images/river-cove-sobha/property-img-1.webp ; do
  code=$(curl -s -o /dev/null -w '%{http_code}' -L "$SITE_URL/$p")
  echo "   $code  $SITE_URL/$p"
done
echo "Done. (200 = live and serving)"
