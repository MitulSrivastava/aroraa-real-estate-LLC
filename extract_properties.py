import os, glob
from bs4 import BeautifulSoup
import json

properties = []

for file in glob.glob("*.html"):
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # skip non-project files
    if 'id="compareRoiModal"' not in html:
        continue
        
    soup = BeautifulSoup(html, 'html.parser')
    
    # Region
    region_meta = soup.find('meta', attrs={'name': 'geo.placename'})
    region = region_meta['content'] if region_meta else 'Unknown'
    
    # Title
    title_tag = soup.find('h1', class_='project-title-gradient')
    if title_tag:
        title = title_tag.text.strip()
    else:
        title = soup.title.string.split('|')[0].strip() if soup.title else file
        
    # Location
    location = ""
    # Try to find the location in the top bar
    # Usually it's in a span next to <i class="fas fa-map-marker-alt">
    loc_icon = soup.find('i', class_='fa-map-marker-alt')
    if loc_icon and loc_icon.parent and loc_icon.parent.name == 'span':
        location = loc_icon.parent.text.strip()
        
    properties.append({
        'id': file,
        'title': title,
        'region': region,
        'location': location
    })

print(json.dumps(properties, indent=2))
