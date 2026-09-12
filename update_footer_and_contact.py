import re
import glob

# 1. Update all footers
footer_pattern = re.compile(r'(<i class="fas fa-phone me-3 mt-1 text-white-50"></i>\s*<span class="text-white-50">)\+971-506 884518(</span>)', re.IGNORECASE)

# Or maybe some files have the phone as link already, but we didn't touch the footer in the previous step. Wait! 
# In previous step we touched "Call Us" and "Email" blocks in the "Schedule Consultation" section, not the footer!
# The footer has `<span class="text-white-50">+971-506 884518</span>`. 
# We should also make them clickable!

footer_repl = r'\1<a href="tel:+971506884518" class="text-white-50 text-decoration-none">+971-506 884518</a> / <a href="tel:+971505559467" class="text-white-50 text-decoration-none">+971 50 555 9467</a>\2'

count_footer = 0
for f in glob.glob("*.html"):
    with open(f, "r") as file:
        content = file.read()
    
    new_content, n = footer_pattern.subn(footer_repl, content)
    if n > 0:
        with open(f, "w") as file:
            file.write(new_content)
        count_footer += 1

print(f"Updated footer in {count_footer} files.")

# 2. Update contact.html
with open("contact.html", "r") as f:
    contact_content = f.read()

# Call Us Directly Box:
call_us_box = """<a class="btn rounded-pill mb-2" href="tel:+971506884518" style="font-size: 0.85rem; border: 1px solid #c9a55f; color: #0b1c3c; background: rgba(201,165,95,0.08); font-weight: 600;">
              <i class="fas fa-phone me-2" style="color: #c9a55f;"></i>+971-506 884518
            </a>"""
call_us_new = call_us_box + """\n            <a class="btn rounded-pill mb-2" href="tel:+971505559467" style="font-size: 0.85rem; border: 1px solid #c9a55f; color: #0b1c3c; background: rgba(201,165,95,0.08); font-weight: 600;">
              <i class="fas fa-phone me-2" style="color: #c9a55f;"></i>+971 50 555 9467
            </a>"""
contact_content = contact_content.replace(call_us_box, call_us_new)

# Dubai Head Office Box:
office_box = """<a class="btn btn-outline-info rounded-pill w-100" href="tel:+971506884518" style="font-size: 0.85rem; max-width: 220px; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                <i class="fas fa-phone"></i> +971-506 884518
              </a>"""
office_new = office_box + """\n              <a class="btn btn-outline-info rounded-pill w-100" href="tel:+971505559467" style="font-size: 0.85rem; max-width: 220px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; margin-top: 8px;">
                <i class="fas fa-phone"></i> +971 50 555 9467
              </a>"""
contact_content = contact_content.replace(office_box, office_new)

with open("contact.html", "w") as f:
    f.write(contact_content)

print("Updated contact.html buttons.")
