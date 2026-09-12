import re
import glob

count = 0
for f in glob.glob("*.html"):
    with open(f, "r") as file:
        content = file.read()
    
    orig_content = content
    
    # Update Email
    # Look for: <h6 class="mb-0">Email</h6>\s*<p class="mb-0 text-white-50">\s*info@aroraarealestate.ae\s*</p>
    def email_repl(m):
        prefix = m.group(1)
        email_str = m.group(2).strip()
        suffix = m.group(3)
        if '<a' in email_str: return m.group(0) # Already a link
        return f'{prefix}<a href="mailto:{email_str}" class="text-white-50 text-decoration-none">{email_str}</a>{suffix}'
        
    content = re.sub(r'(<h6[^>]*>\s*Email\s*</h6>\s*<p[^>]*>)\s*([^<]+)\s*(</p>)', email_repl, content, flags=re.IGNORECASE)
    
    # Update Call Us
    def phone_repl(m):
        prefix = m.group(1)
        phones_str = m.group(2).strip()
        suffix = m.group(3)
        
        if '<a' in phones_str: return m.group(0) # Already linked
        
        parts = [p.strip() for p in phones_str.split('/')]
        
        new_parts = []
        for p in parts:
            clean_p = p.replace(' ', '').replace('-', '')
            new_parts.append(f'<a href="tel:{clean_p}" class="text-white-50 text-decoration-none">{p}</a>')
            
        return f'{prefix}{" / ".join(new_parts)}{suffix}'
        
    content = re.sub(r'(<h6[^>]*>\s*Call Us\s*</h6>\s*<p[^>]*>)\s*([^<]+)\s*(</p>)', phone_repl, content, flags=re.IGNORECASE)
    
    if content != orig_content:
        with open(f, "w") as file:
            file.write(content)
        count += 1

print(f"Updated {count} files.")
