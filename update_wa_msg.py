import glob

old_str = 'href="https://wa.me/971505559467?text=Hi%20I%20am%20interested%20in%20your%20properties."'
new_str = 'href="https://wa.me/971505559467?text=Hello%2C%20I%20would%20like%20to%20request%20more%20information%20about%20your%20property%20listings."'

count = 0
for f in glob.glob("*.html"):
    with open(f, "r") as file:
        content = file.read()
    
    if old_str in content:
        content = content.replace(old_str, new_str)
        with open(f, "w") as file:
            file.write(content)
        count += 1

print(f"Updated WhatsApp message in {count} files.")
