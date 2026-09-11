import json

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

# Make sure we don't duplicate
if "const aroraaProjects =" in content:
    print("Already updated.")
    exit(0)

# Run extract_properties logic again to get the python dict directly
import os, glob
from bs4 import BeautifulSoup

properties = []

for file in glob.glob("*.html"):
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()
    
    if 'id="compareRoiModal"' not in html:
        continue
        
    soup = BeautifulSoup(html, 'html.parser')
    region_meta = soup.find('meta', attrs={'name': 'geo.placename'})
    region = region_meta['content'] if region_meta else 'Unknown'
    
    title_tag = soup.find('h1', class_='project-title-gradient')
    if title_tag:
        title = title_tag.text.strip()
    else:
        title = soup.title.string.split('|')[0].strip() if soup.title else file
        
    location = ""
    loc_icon = soup.find('i', class_='fa-map-marker-alt')
    if loc_icon and loc_icon.parent and loc_icon.parent.name == 'span':
        location = loc_icon.parent.text.strip()
        
    properties.append({
        'id': file,
        'title': title,
        'region': region,
        'location': location
    })

js_code = f"""
// --- Auto-generated ROI Compare Modal Logic ---
const aroraaProjects = {json.dumps(properties, indent=2)};

document.addEventListener("DOMContentLoaded", function() {{
  const roiModal = document.getElementById('compareRoiModal');
  if (!roiModal) return;

  const modalBody = roiModal.querySelector('.modal-body');
  if (modalBody && !document.getElementById('roiCompareSelect')) {{
    
    const projectName = document.title.split('|')[0].trim();
    
    let location = "";
    const locIcon = document.querySelector('.fa-map-marker-alt');
    if (locIcon && locIcon.parentElement && locIcon.parentElement.tagName === 'SPAN') {{
        location = locIcon.parentElement.textContent.trim();
    }}
    
    const currentProj = aroraaProjects.find(p => p.title === projectName) || {{ region: 'Dubai' }};
    const region = currentProj.region;
    
    const regionalProjects = aroraaProjects.filter(p => p.region === region && p.title !== projectName);
    let optionsHtml = '<option value="">✓ Choose a project...</option>';
    regionalProjects.forEach(p => {{
        optionsHtml += `<option value="${{p.title}}">${{p.title}}</option>`;
    }});

    const newHtml = `
<button aria-label="Close" class="btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" type="button"></button>
<div class="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle" style="width:60px; height:60px; font-size:24px; color:#c9a55f; background: rgba(201,165,95,0.1);">
  <i class="fas fa-balance-scale"></i>
</div>
<h3 class="fw-bold mb-2" style="color: #333;">Compare Investment ROI</h3>
<p class="text-muted mb-4 px-2" style="font-size:0.95rem;">Select a property to compare with ${{projectName}} to find your perfect investment.</p>
<form class="text-start" id="compareRoiForm">
  <div class="row mb-4 gx-3">
    <div class="col-md-6 mb-3 mb-md-0">
       <div class="p-3 border rounded text-center h-100 d-flex flex-column justify-content-center" style="background: #fff; border-color: rgba(0,0,0,0.08) !important; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
         <div><span class="badge mb-2 px-3 py-1" style="background:#0b1c3c; color:#fff; font-size:0.75rem; font-weight:600; border-radius:12px;">Selected Property</span></div>
         <h5 class="fw-bold mb-1" style="color:#0b1c3c; font-size:1.1rem;">${{projectName}}</h5>
         <div class="text-muted small" style="font-size:0.8rem;">${{location}}</div>
       </div>
    </div>
    <div class="col-md-6">
       <div class="p-3 border rounded text-center h-100 d-flex flex-column justify-content-center" style="background: #fff; border: 2px dashed rgba(201,165,95,0.4) !important; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
         <label class="form-label fw-bold mb-2" style="font-size:0.85rem; color:#0b1c3c;">Compare With:</label>
         <select class="form-select form-select-sm shadow-none" name="compare_with" id="roiCompareSelect" required style="border-radius:8px; border:1px solid #c9a55f; font-size:0.9rem; padding:8px 12px; font-weight:500;">
           ${{optionsHtml}}
         </select>
       </div>
    </div>
  </div>
  <div class="row mb-4 gx-3">
    <div class="col-md-6 mb-3 mb-md-0">
      <label class="form-label fw-semibold" style="font-size:0.85rem; color:#333;">Full Name <span class="text-danger">*</span></label>
      <input class="form-control py-2 shadow-none" name="full_name" placeholder="John Doe" required="" type="text" style="border-radius:8px; border-color:#dee2e6;"/>
    </div>
    <div class="col-md-6">
      <label class="form-label fw-semibold" style="font-size:0.85rem; color:#333;">WhatsApp Number <span class="text-danger">*</span></label>
      <input class="form-control py-2 shadow-none" name="phone" placeholder="+971..." required="" type="tel" style="border-radius:8px; border-color:#dee2e6;"/>
    </div>
  </div>
  <input name="interested_in" type="hidden" value="Compare ROI"/>
  <input class="roi-source-project" name="source" type="hidden" value="${{projectName}}"/>
  <button class="btn w-100 fw-bold py-2 shadow-sm d-flex align-items-center justify-content-center gap-2" style="background: #198754; color: #fff; border-radius:8px; border:none; transition: all 0.3s;" type="submit">
    <i class="fas fa-file-pdf"></i> Generate Comparison Report
  </button>
</form>
    `;
    modalBody.innerHTML = newHtml;

    const roiForm = document.getElementById("compareRoiForm");
    if (roiForm) {{
      roiForm.addEventListener("submit", function(e) {{
        e.preventDefault();
        if (!roiForm.checkValidity()) {{
          roiForm.classList.add('was-validated');
          return;
        }}
        if (typeof submitViaIframe === 'function') {{
          submitViaIframe(roiForm, "Thank you! Your ROI Comparison Report is being generated.");
        }}
      }});
    }}
  }}
}});
"""

with open("script.js", "a", encoding="utf-8") as f:
    f.write("\n" + js_code)

print("Updated script.js successfully!")
