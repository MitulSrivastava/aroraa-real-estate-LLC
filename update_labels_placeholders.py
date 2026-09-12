import re
import glob

# For HTML files
count_html = 0
for f in glob.glob("*.html"):
    with open(f, "r") as file:
        content = file.read()
    
    orig_content = content
    
    # Replace label text
    content = content.replace("WhatsApp Number", "Contact Number")
    
    # Remove placeholder from phone input
    # It can be placeholder="+971..." or placeholder="Phone Number" or placeholder="Mobile Number"
    # Wait, the user specifically mentioned: "in place holder its written the +971 i dont like it as well improve"
    # Actually, if I remove `placeholder="..."` completely from `type="tel"`, it's the safest.
    content = re.sub(r'(<input[^>]*?type="tel"[^>]*?)placeholder="[^"]*"([^>]*?>)', r'\1\2', content)
    # also handle if type="tel" comes after placeholder
    content = re.sub(r'(<input[^>]*?)placeholder="[^"]*"([^>]*?type="tel"[^>]*?>)', r'\1\2', content)
    
    if content != orig_content:
        with open(f, "w") as file:
            file.write(content)
        count_html += 1

print(f"Updated {count_html} HTML files.")

# For script.js
with open("script.js", "r") as file:
    content = file.read()

orig_content = content
content = content.replace("WhatsApp Number", "Contact Number")
content = re.sub(r'(<input[^>]*?type="tel"[^>]*?)placeholder="[^"]*"([^>]*?>)', r'\1\2', content)
content = re.sub(r'(<input[^>]*?)placeholder="[^"]*"([^>]*?type="tel"[^>]*?>)', r'\1\2', content)

if content != orig_content:
    with open("script.js", "w") as file:
        file.write(content)
    print("Updated script.js.")
