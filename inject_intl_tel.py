import glob
import re

css_inject = """<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/css/intlTelInput.css"/>
<style>
  .iti { width: 100%; display: block; }
  .iti__flag {background-image: url("https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/img/flags.png");}
  @media (min-resolution: 2x) {
    .iti__flag {background-image: url("https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/img/flags@2x.png");}
  }
</style>
"""

js_inject = '<script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/intlTelInput.min.js"></script>\n<script src="script.js"></script>'

count = 0
for f in glob.glob("*.html"):
    with open(f, "r") as file:
        content = file.read()
    
    orig_content = content
    
    # Check if already injected
    if "intlTelInput" not in content:
        # Inject CSS before </head>
        content = re.sub(r'</head>', css_inject + '</head>', content, flags=re.IGNORECASE)
        
        # Inject JS before <script src="script.js"></script>
        content = re.sub(r'<script src="script.js"></script>', js_inject, content)
        
        if content != orig_content:
            with open(f, "w") as file:
                file.write(content)
            count += 1

print(f"Injected into {count} files.")
