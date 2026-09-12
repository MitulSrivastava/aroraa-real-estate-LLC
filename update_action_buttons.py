import re
import glob

count_tel = 0
count_wa = 0

for f in glob.glob("*.html"):
    with open(f, "r") as file:
        content = file.read()
    
    orig_content = content
    
    # 1. Update tel links that have the dash (which targets the CTA bars and hidden links, but spares the contact page buttons which don't have the dash in href)
    # Actually to be safer, we can just replace 'href="tel:+971-506 884518"' exactly.
    content, n1 = re.subn(r'href="tel:\+971-506\s*884518"', 'href="tel:+971505559467"', content)
    count_tel += n1
    
    # 2. Update WhatsApp links
    # Look for href="https://wa.me/971506884518..."
    content, n2 = re.subn(r'href="https://wa\.me/971506884518[^"]*"', 'href="https://wa.me/971505559467?text=Hi%20I%20am%20interested%20in%20your%20properties."', content)
    count_wa += n2
    
    if content != orig_content:
        with open(f, "w") as file:
            file.write(content)

print(f"Updated {count_tel} tel links and {count_wa} WhatsApp links.")
