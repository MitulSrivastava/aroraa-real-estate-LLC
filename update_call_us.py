import re
import glob

pattern = re.compile(r'(<h6[^>]*>Call Us</h6>\s*<p[^>]*>)([^<]+)(</p>)', re.IGNORECASE)

count = 0
for f in glob.glob("*.html"):
    with open(f, "r") as file:
        content = file.read()
    
    def replacer(match):
        prefix = match.group(1)
        phones_str = match.group(2)
        suffix = match.group(3)
        
        # Get the first phone number
        first_phone = phones_str.split('/')[0].strip()
        
        # Construct the new string
        new_phones_str = first_phone + " / +971 50 555 9467"
        
        return prefix + new_phones_str + suffix

    new_content, num_subs = pattern.subn(replacer, content)
    
    if num_subs > 0:
        with open(f, "w") as file:
            file.write(new_content)
        count += 1

print(f"Updated {count} files.")
