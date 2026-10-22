import os, glob
import pymupdf
from PIL import Image

pdf_dir = r"C:\Users\HP\Desktop\abc\MAGAZINE PDF"
base_out = r"C:\Users\HP\Desktop\abc\magazines_data"

os.makedirs(os.path.join(base_out, "covers"), exist_ok=True)

mapping = [
    {
        "id": "numero-03",
        "number": "N° 03",
        "season": "2025-2026",
        "title": "TP Mazembe · Le 16e Sacre Historique",
        "date": "Saison 2025-2026",
        "theme": "Édition Spéciale Championnat",
        "filename": "Magazine Illicocash les coulisses de la ligue 1 TP Mazembe 16e 2026.pdf"
    },
    {
        "id": "numero-02",
        "number": "N° 02",
        "season": "2024-2025",
        "title": "Les Aigles du Congo · L'Ascension Fulgurante",
        "date": "Saison 2024-2025",
        "theme": "Révélation & Parcours d'Élite",
        "filename": "Magazine Illicocash les coulisses de la ligue Les Aigles du Congo 2025.pdf"
    },
    {
        "id": "numero-01",
        "number": "N° 01",
        "season": "2023-2024",
        "title": "TP Mazembe · La Conquête de la 15e Étoile",
        "date": "Saison 2023-2024",
        "theme": "Rétrospective & Archives",
        "filename": "Magazine Illicocash les coulisses de la ligue TP Mazembe 15e 2024.pdf"
    }
]

import json

manifest = []

for item in mapping:
    pdf_path = os.path.join(pdf_dir, item["filename"])
    if not os.path.exists(pdf_path):
        print("Missing file:", pdf_path)
        continue
    
    doc = pymupdf.open(pdf_path)
    total_pages = len(doc)
    print(f"Processing {item['id']} ({total_pages} pages)...")
    
    pages_dir = os.path.join(base_out, item["id"])
    os.makedirs(pages_dir, exist_ok=True)
    
    # 1. Export cover (first page) at high quality
    pix_cover = doc[0].get_pixmap(dpi=130)
    img_cover = Image.frombytes("RGB", [pix_cover.width, pix_cover.height], pix_cover.samples)
    cover_rel = f"magazines_data/covers/{item['id']}_cover.webp"
    img_cover.save(os.path.join(base_out, "covers", f"{item['id']}_cover.webp"), "WEBP", quality=82)
    
    # 2. Export all pages
    page_urls = []
    for i in range(total_pages):
        page = doc[i]
        pix = page.get_pixmap(dpi=120)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        page_file = f"p_{i+1:03d}.webp"
        img.save(os.path.join(pages_dir, page_file), "WEBP", quality=80)
        page_urls.append(f"magazines_data/{item['id']}/{page_file}")
    
    doc.close()
    
    manifest.append({
        "id": item["id"],
        "number": item["number"],
        "season": item["season"],
        "title": item["title"],
        "date": item["date"],
        "theme": item["theme"],
        "cover": cover_rel,
        "totalPages": total_pages,
        "pages": page_urls,
        "intro": f"Édition complète officielle Illicocash Les Coulisses de la Ligue ({total_pages} pages de reportages exclusifs, analyses et archives)."
    })

with open(os.path.join(base_out, "manifest.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print("Export completed successfully!")
