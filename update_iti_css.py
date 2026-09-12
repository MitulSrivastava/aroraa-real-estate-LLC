import re
import glob

old_css = """<style>
  .iti { width: 100%; display: block; }
  .iti__flag {background-image: url("https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/img/flags.png");}
  @media (min-resolution: 2x) {
    .iti__flag {background-image: url("https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/img/flags@2x.png");}
  }
</style>"""

new_css = """<style>
  .iti { width: 100%; display: block; }
  .iti__selected-dial-code { color: #333 !important; }
  .iti-dark .iti__selected-dial-code { color: #fff !important; }
  .iti__country { color: #333 !important; }
  .iti__flag {background-image: url("https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/img/flags.png");}
  @media (min-resolution: 2x) {
    .iti__flag {background-image: url("https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/img/flags@2x.png");}
  }
</style>"""

count = 0
for f in glob.glob("*.html"):
    with open(f, "r") as file:
        content = file.read()
    
    if old_css in content:
        content = content.replace(old_css, new_css)
        with open(f, "w") as file:
            file.write(content)
        count += 1
    elif ".iti__selected-dial-code" not in content:
        # Fallback if old_css wasn't matched exactly
        pass

print(f"Updated CSS in {count} files.")
