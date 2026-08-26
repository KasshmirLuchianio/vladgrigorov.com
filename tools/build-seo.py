#!/usr/bin/env python3
"""Regenerate the JSON-LD graph in both pages, plus sitemap.xml.

Both pages describe one entity graph, so the two blocks are generated from a
single source here rather than hand-edited twice - that is how the EN and RO
copies drifted apart the first time (the RO ProfilePage was claiming the EN
page's @id and url).

Video titles and credit lines are read back out of each page, so the markup can
never describe a project the page does not actually show.

lastmod comes from git rather than from today's date: Google only trusts the
value while it stays accurate, and a sitemap that claims every page changed on
every deploy teaches it to ignore the field.

Run after editing either page:  python3 tools/build-seo.py
"""
import html
import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://www.vladgrigorov.com"
HERO = ("https://d8j0ntlcm91z4.cloudfront.net/user_33Ej8t2gAxUeQ3elHCepqWYPaUg/"
        "hf_20260817_085751_3d36c25d-57e4-4869-bfc2-2057a5cad5e8.png")

# YouTube ids he is credited as directing, as opposed to the live-action videos
# where the page credits him with cinematography and editing only. Getting this
# wrong would put a director credit on somebody else's film.
DIRECTED = {
    "e-ywKlbDZRI", "kg4jw54vQUQ", "9l3zFDCcYqc", "N71k6MbbMSY",
    "8ajCsesQskk", "eHqC55RmyXU", "XL8gaRZOdhk",
    "kv9llYpDRjU", "gq95zkO9dfQ", "MnMlt_aLOOM", "O6s77wokJEU",
}

PAGES = {
    "index.html": {
        "lang": "en",
        "url": f"{SITE}/",
        "page_id": f"{SITE}/#page",
        "name": "Vlad Grigorov — AI Film Director & Cinematographer",
        "description": ("Portfolio of Vlad Grigorov, a film director and cinematographer based in "
                        "Bucharest, Romania: live-action music videos, AI-directed commercials and "
                        "generative short films."),
        "video_prefix": f"{SITE}/#video-",
        "job_titles": ["Film Director", "Cinematographer", "Video Editor", "AI Director"],
        "person_description": ("Film director, cinematographer and editor based in Bucharest. Shoots and "
                               "cuts live-action music videos, and directs commercials and short films "
                               "made with generative AI video models."),
        "knows_about": [
            "Film directing", "Cinematography", "Music video direction", "Video editing",
            "Colour grading", "Commercial and advertising production",
            "AI video generation", "Generative cinema", "Prompt-directed filmmaking",
        ],
        "image_caption": "Vlad Grigorov, film director and cinematographer, on a film set",
        "services": [
            ("Music video direction and cinematography",
             "Directing, shooting and cutting live-action music videos, from treatment to final grade."),
            ("AI-directed commercials and ad spots",
             "Commercials and brand spots built with generative video models and directed shot by shot."),
            ("Editing, colour grading and finishing",
             "Offline edit, sound, colour grade and delivery for live-action and generated footage alike."),
            ("Generative short films and branded content",
             "Cinematic short-form work made with AI image and video models, written and directed end to end."),
        ],
    },
    "ro/index.html": {
        "lang": "ro",
        "url": f"{SITE}/ro/",
        "page_id": f"{SITE}/ro/#page",
        "name": "Vlad Grigorov — Regizor videoclipuri și reclame AI",
        "description": ("Portofoliul lui Vlad Grigorov, regizor și videograf din București: videoclipuri "
                        "muzicale filmate, reclame și spoturi realizate cu AI, filme scurte generative."),
        "video_prefix": f"{SITE}/ro/#video-",
        "job_titles": ["Regizor", "Director de imagine", "Monteur video", "AI Director"],
        "person_description": ("Regizor, director de imagine și monteur din București. Filmează și montează "
                               "videoclipuri muzicale, și regizează reclame și filme scurte realizate cu "
                               "modele video generative."),
        "knows_about": [
            "Regie de film", "Imagine de film", "Regie videoclipuri muzicale", "Montaj video",
            "Color grading", "Producție de reclame și spoturi publicitare",
            "Generare video cu AI", "Cinema generativ", "Regie prin prompt",
        ],
        "image_caption": "Vlad Grigorov, regizor și director de imagine, pe un platou de filmare",
        "services": [
            ("Regie și imagine pentru videoclipuri muzicale",
             "Regie, filmare și montaj pentru videoclipuri muzicale, de la concept la cadrul final."),
            ("Reclame și spoturi publicitare realizate cu AI",
             "Reclame și spoturi de brand construite cu modele video generative și regizate cadru cu cadru."),
            ("Montaj, color grading și finisaj",
             "Montaj, sunet, color grading și livrare, atât pentru filmare reală cât și pentru material generat."),
            ("Filme scurte generative și content de brand",
             "Producții scurte cinematice realizate cu modele AI de imagine și video, scrise și regizate de la cap la coadă."),
        ],
    },
}


def last_commit_date(path):
    """Date of the last commit touching path, or today if it is edited but not
    yet committed - otherwise a rebuild run before committing would stamp the
    sitemap with the date of the previous change."""
    dirty = subprocess.run(["git", "status", "--porcelain", "--", path],
                           cwd=ROOT, capture_output=True, text=True).stdout.strip()
    if dirty:
        return datetime.now(timezone.utc).date().isoformat()
    out = subprocess.run(["git", "log", "-1", "--format=%cs", "--", path],
                         cwd=ROOT, capture_output=True, text=True).stdout.strip()
    return out or datetime.now(timezone.utc).date().isoformat()


def read_projects(source):
    pattern = (r'<article class="project[^"]*"[^>]*data-yt="([^"]+)"[\s\S]*?'
               r'<h4 class="project__title">([^<]+)</h4>\s*'
               r'<span class="project__type">([^<]*)</span>')
    projects = []
    for yt, title, credit in re.findall(pattern, source):
        projects.append({
            "id": yt,
            "title": html.unescape(title).strip(),
            "credit": html.unescape(credit).strip(),
        })
    return projects


def person(cfg):
    return {
        "@type": "Person",
        "@id": f"{SITE}/#vlad",
        "name": "Vlad Grigorov",
        "url": f"{SITE}/",
        "image": {"@id": f"{SITE}/#vlad-photo"},
        "jobTitle": cfg["job_titles"],
        "description": cfg["person_description"],
        "address": {"@type": "PostalAddress", "addressLocality": "Bucharest", "addressCountry": "RO"},
        "email": "mailto:vladgrigorov1@gmail.com",
        "knowsAbout": cfg["knows_about"],
        "knowsLanguage": [
            {"@type": "Language", "name": "Romanian", "alternateName": "ro"},
            {"@type": "Language", "name": "English", "alternateName": "en"},
        ],
        "makesOffer": [
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": name,
                    "description": desc,
                    "provider": {"@id": f"{SITE}/#vlad"},
                    "areaServed": [
                        {"@type": "City", "name": "Bucharest"},
                        {"@type": "Country", "name": "Romania"},
                    ],
                },
            }
            for name, desc in cfg["services"]
        ],
        # Only profiles that are Vlad himself. The @andreeavaleriareal TikTok is a
        # virtual persona he operates, not another account belonging to him, so it
        # is linked from the page but deliberately kept out of sameAs.
        "sameAs": [
            "https://www.youtube.com/@vladgrigorow",
            "https://www.linkedin.com/in/vlad-grigorov/",
            "https://www.facebook.com/vlad.gabriel.14/",
        ],
    }


def video_nodes(cfg, projects):
    nodes = []
    for p in projects:
        credit = re.sub(r"\s*·\s*", " · ", p["credit"]).strip(" ·")
        node = {
            "@type": "VideoObject",
            "@id": cfg["video_prefix"] + p["id"],
            "name": p["title"],
            "description": f"{p['title']} — {credit}." if credit else p["title"],
            "thumbnailUrl": [f"https://img.youtube.com/vi/{p['id']}/maxresdefault.jpg"],
            "embedUrl": f"https://www.youtube.com/embed/{p['id']}",
            "sameAs": f"https://www.youtube.com/watch?v={p['id']}",
            "inLanguage": cfg["lang"],
            "isFamilyFriendly": True,
        }
        if p["id"] in DIRECTED:
            node["director"] = {"@id": f"{SITE}/#vlad"}
            node["creator"] = {"@id": f"{SITE}/#vlad"}
        else:
            node["contributor"] = {"@id": f"{SITE}/#vlad"}
        nodes.append(node)
    return nodes


def build(cfg, projects, modified):
    videos = video_nodes(cfg, projects)
    graph = [
        person(cfg),
        {
            "@type": "ImageObject",
            "@id": f"{SITE}/#vlad-photo",
            "url": HERO,
            "contentUrl": HERO,
            "caption": cfg["image_caption"],
        },
        {
            "@type": "WebSite",
            "@id": f"{SITE}/#website",
            "url": f"{SITE}/",
            "name": "Vlad Grigorov",
            "alternateName": "Vlad Grigorov — Film Director & Cinematographer",
            "inLanguage": ["en", "ro"],
            "publisher": {"@id": f"{SITE}/#vlad"},
        },
        {
            "@type": "ProfilePage",
            "@id": cfg["page_id"],
            "url": cfg["url"],
            "name": cfg["name"],
            "description": cfg["description"],
            "inLanguage": cfg["lang"],
            "isPartOf": {"@id": f"{SITE}/#website"},
            "mainEntity": {"@id": f"{SITE}/#vlad"},
            "primaryImageOfPage": {"@id": f"{SITE}/#vlad-photo"},
            "dateModified": modified,
            "hasPart": [{"@id": v["@id"]} for v in videos],
        },
    ] + videos
    return {"@context": "https://schema.org", "@graph": graph}


SITEMAP = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
{entries}</urlset>
"""

SITEMAP_ENTRY = """  <url>
    <loc>{loc}</loc>
    <lastmod>{lastmod}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="{site}/"/>
    <xhtml:link rel="alternate" hreflang="ro" href="{site}/ro/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="{site}/"/>
    <changefreq>monthly</changefreq>
    <priority>{priority}</priority>
  </url>
"""


def write_sitemap(dates):
    entries = "".join(
        SITEMAP_ENTRY.format(loc=PAGES[f]["url"], lastmod=dates[f], site=SITE, priority=priority)
        for f, priority in (("index.html", "1.0"), ("ro/index.html", "0.9"))
    )
    (ROOT / "sitemap.xml").write_text(SITEMAP.format(entries=entries))
    print("sitemap.xml:", ", ".join(f"{f} {dates[f]}" for f in dates))


def main():
    dates = {}
    for filename, cfg in PAGES.items():
        path = ROOT / filename
        source = path.read_text()
        projects = read_projects(source)
        if not projects:
            raise SystemExit(f"{filename}: found no project cards to describe")
        modified = last_commit_date(filename)
        dates[filename] = modified
        payload = json.dumps(build(cfg, projects, modified), ensure_ascii=False, indent=2)
        block = f'<script type="application/ld+json">\n{payload}\n</script>'
        updated, count = re.subn(
            r'<script type="application/ld\+json">[\s\S]*?</script>', block, source, count=1)
        if count != 1:
            raise SystemExit(f"{filename}: expected exactly one JSON-LD block, replaced {count}")
        path.write_text(updated)
        print(f"{filename}: {len(projects)} videos, dateModified {modified}")
    write_sitemap(dates)


if __name__ == "__main__":
    main()
