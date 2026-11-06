"""Service landing pages: one page per thing people actually search for.

The home pages are a portfolio - one page per language that has to be about
everything at once. Google ranks pages for queries, and nothing on the site was
about "AI filmmaker" or "AI video editor"; neither phrase appeared in visible
text at all. Each page here answers one of those queries in full.

Content lives as data so the English and Spanish versions share one template
(nav, footer, schema, hreflang) and cannot drift apart. Every claim in the copy
is something the portfolio itself shows - no invented prices, turnaround times,
client names or credentials.

Rendered by tools/build-seo.py.
"""
import html
import json

SITE = "https://www.vladgrigorov.com"
EMAIL = "vladgrigorov1@gmail.com"

# YouTube ids already on the portfolio, with their titles and credit lines.
WORK = {
    "buna":     ("e-ywKlbDZRI", "Buna Vestire"),
    "habar":    ("kg4jw54vQUQ", "Habar N-ai"),
    "brr_ai":   ("9l3zFDCcYqc", "BRR"),
    "majolie":  ("N71k6MbbMSY", "Ma Jolie"),
    "rome":     ("kv9llYpDRjU", "Rome"),
    "romania":  ("MnMlt_aLOOM", "Romania 1791"),
    "brr_live": ("hFRKruQS8IY", "BRR — Orange Session"),
    "fiveguys": ("ihdG-vf8djE", "Five Guys — Green Session"),
    "delacard": ("Ok7JcE1aQVM", "De La Card"),
    "meet1":    ("8ajCsesQskk", "Meetings.ro — Spot I"),
}

# Pairs of pages that are the same page in two languages (hreflang).
PAIRS = {
    "filmmaker": {"en": "/ai-filmmaker/", "es": "/es/cineasta-ia/"},
    "editor":    {"en": "/ai-video-editor/", "es": "/es/editor-de-video-ia/"},
}

UI = {
    "en": {
        "home": "/", "work": "/#work", "contact": "/#contact",
        "nav_work": "Work", "nav_contact": "Contact",
        "nav": {"filmmaker": "AI Filmmaker", "editor": "AI Video Editor"},
        "lang_label": "Language", "home_crumb": "Home",
        "cta_title": "Have a project?", "cta_text": "Send the brief, the references and the deadline. You get a reply with a plan and a fixed quote.",
        "cta_portfolio": "See the full portfolio",
        "footer_role": "AI Filmmaker · Video Editor · Barcelona",
        "watch": "Watch on YouTube", "selected": "Selected work", "faq": "Questions",
        "locale": "en_US",
    },
    "es": {
        "home": "/es/", "work": "/es/#work", "contact": "/es/#contact",
        "nav_work": "Trabajos", "nav_contact": "Contacto",
        "nav": {"filmmaker": "Cineasta IA", "editor": "Editor de vídeo IA"},
        "lang_label": "Idioma", "home_crumb": "Inicio",
        "cta_title": "¿Tienes un proyecto?", "cta_text": "Envía el brief, las referencias y la fecha de entrega. Te respondo con un plan y un presupuesto cerrado.",
        "cta_portfolio": "Ver el portfolio completo",
        "footer_role": "Cineasta IA · Editor de vídeo · Barcelona",
        "watch": "Ver en YouTube", "selected": "Trabajos seleccionados", "faq": "Preguntas",
        "locale": "es_ES",
    },
}

# ---------------------------------------------------------------------------
# Copy. Blocks: ("p", text) ("h2", text) ("ul", [items]) ("steps", [(title, text)])
# ("work", [(key, credit)]) ("faq", [(q, a)]). Text may hold <a>/<strong>.
# ---------------------------------------------------------------------------
PAGES = {
    ("filmmaker", "en"): {
        "title": "AI Filmmaker in Barcelona — Vlad Grigorov",
        "description": "Vlad Grigorov is an AI filmmaker in Barcelona: AI music videos, AI commercials and generative short films, directed shot by shot and finished like film.",
        "eyebrow": "Barcelona · Spain · Remote",
        "h1": "AI Filmmaker",
        "lede": "I write, direct and edit films made with generative video models — music videos, commercials and short films. I shoot live action too, so the AI work is held to the same standard as footage that came off a camera.",
        "service_type": "AI filmmaking",
        "blocks": [
            ("h2", "What an AI filmmaker actually does"),
            ("p", "The model renders the frames. Everything that makes them a film is still a decision someone has to make: who is on screen and how they stay the same person from shot to shot, the look, the lens, where the camera sits and how it moves, what each shot is for, and where it cuts. That is the job."),
            ("p", "Without it you get clips — impressive for three seconds, unusable together. With it you get a sequence that holds up as one piece of work, with a consistent character, a consistent world and an edit that carries the story."),
            ("h2", "What I make"),
            ("ul", [
                "<strong>AI music videos</strong> — full videos built around the track, with the artist or a consistent character carried through every shot.",
                "<strong>AI commercials and brand spots</strong> — promos for events, products and brands, directed and cut to length for each platform.",
                "<strong>Generative short films</strong> — narrative pieces, including historical recreations that would be impossible to shoot.",
                "<strong>AI VFX inside live action</strong> — generated shots and effects cut into footage shot on camera, as in <em>Habar N-ai</em>.",
            ]),
            ("work", [
                ("buna", "AI promo · Festivalul Buna Vestire · Directed & edited"),
                ("habar", "Music video · Kashmir Luchiano ft. Codrin Donciu · Directed, AI VFX"),
                ("brr_ai", "AI music video · Kashmir Luchiano"),
                ("majolie", "AI music video · Kashmir Luchiano"),
                ("rome", "Generative short · The Birth of Corruption"),
                ("romania", "Generative short · Romania at 1791"),
            ]),
            ("h2", "How a project runs"),
            ("steps", [
                ("Brief", "What it is for, where it will be seen, how long it runs, and the references you already like."),
                ("Treatment and look", "The idea, the visual direction and the shot list, agreed before anything is generated."),
                ("Character and world", "Recurring people are built as trained identity models so the same face holds across every shot; locations and wardrobe are fixed the same way."),
                ("Shots", "Each shot is directed and generated on its own — framing, camera move, light — and redone until it is usable, not until it is merely interesting."),
                ("Edit, sound and grade", "Cut in Premiere Pro, then sound and a single colour grade across everything, so generated and filmed shots sit together."),
                ("Delivery", "Masters in the formats you need — 16:9, and 9:16 for TikTok, Reels and Shorts."),
            ]),
            ("h2", "Tools"),
            ("p", "Kling, Seedance and Higgsfield for video; trained character models for consistent faces; Nano Banana and image models for stills and start frames; Premiere Pro for the edit. The tools change every few months. The decisions above do not, which is why the work is organised around them and not around any one model."),
            ("faq", [
                ("Can AI video keep the same person across shots?",
                 "Yes, if the person is built properly first. I train an identity model from reference photos and generate every shot from it. It is not automatic — some shots drift and get regenerated — but the finished film shows one consistent person."),
                ("Do you only work with AI?",
                 "No. I also shoot and edit live-action music videos, and I mix the two: real footage with generated shots inside it. The full range is on the <a href=\"/\">portfolio</a>."),
                ("Do you work outside Barcelona?",
                 "Yes. I'm based in Barcelona and work with clients in Spain, Romania and elsewhere. Most AI projects run remotely from brief to delivery."),
                ("How much does an AI film cost?",
                 "It depends on the length, the number of shots and whether a character or world has to be built first. Send the brief and you get a fixed quote before anything starts."),
            ]),
        ],
    },
    ("editor", "en"): {
        "title": "AI Video Editor in Barcelona — Vlad Grigorov",
        "description": "AI video editor in Barcelona: editing, colour grading and AI-generated shots and VFX for music videos, commercials and vertical content. Vlad Grigorov.",
        "eyebrow": "Barcelona · Spain · Remote",
        "h1": "AI Video Editor",
        "lede": "I edit footage shot on camera and footage made with AI — and increasingly both in the same timeline. Cut in Premiere Pro, graded as one film, with generated shots and effects added where the footage needs them.",
        "service_type": "AI video editing",
        "blocks": [
            ("h2", "Editing with AI, not by AI"),
            ("p", "AI doesn't decide the cut. Rhythm, performance, what stays and what goes — that is still editing. What AI changes is what the editor can do with the material: generate the insert you didn't get on the day, add a VFX shot that would have needed a 3D team, extend a shot, or build an entire sequence that was never filmed."),
            ("p", "So the edit is no longer limited to what was shot. That is the part of the job I specialise in: making generated material and real footage cut together so nobody can tell where one ends."),
            ("h2", "What I edit"),
            ("ul", [
                "<strong>Music videos</strong> — live-action sessions and full productions, cut to the track.",
                "<strong>Commercials and brand spots</strong> — from a single hero film to a set of cut-downs.",
                "<strong>Vertical content</strong> — 9:16 edits for TikTok, Instagram Reels and YouTube Shorts.",
                "<strong>AI-generated shots and VFX</strong> — added to your footage, matched in light, grain and colour.",
                "<strong>Colour grading</strong> — one consistent look across filmed and generated shots.",
            ]),
            ("work", [
                ("habar", "Music video · Directed, edited, AI VFX shots"),
                ("brr_live", "Live session · Kashmir Luchiano · Cinematography & editing"),
                ("fiveguys", "Live session · Kashmir Luchiano · Cinematography & editing"),
                ("delacard", "Music video · Kashmir Luchiano · Cinematography & editing"),
                ("buna", "AI promo · Festivalul Buna Vestire · Directed & edited"),
                ("meet1", "Commercial spot · Meetings.ro"),
            ]),
            ("h2", "How it works"),
            ("steps", [
                ("Material", "You send the footage, the music and any references. If there is no footage yet, the shots can be generated."),
                ("First cut", "A full cut of the piece, so the structure is agreed before the detail work."),
                ("AI shots and VFX", "Missing inserts, effects and extra shots are generated to match the footage around them."),
                ("Sound and grade", "Sound pass and one colour grade across everything."),
                ("Versions", "Final master plus the cut-downs and aspect ratios each platform needs."),
            ]),
            ("faq", [
                ("Can you add AI shots to footage I've already filmed?",
                 "Yes — that is exactly what was done in <em>Habar N-ai</em>: a live-action music video with AI-generated VFX shots cut in. The generated shots are matched to the footage in light, colour and grain."),
                ("What do you need from me?",
                 "The footage (or the brief, if it is all to be generated), the music or voice-over, the deadline, and two or three references for the feel you want."),
                ("Do you edit vertical videos?",
                 "Yes. Every project can be delivered in 9:16 for TikTok, Reels and Shorts alongside the 16:9 master."),
                ("Do you work remotely?",
                 "Yes. I'm based in Barcelona and edit for clients in Spain, Romania and elsewhere; footage is exchanged online."),
            ]),
        ],
    },
    ("filmmaker", "es"): {
        "title": "Cineasta IA en Barcelona — Vlad Grigorov",
        "description": "Vlad Grigorov, cineasta IA en Barcelona: videoclips con IA, anuncios y cortometrajes generativos, dirigidos plano a plano y acabados como cine.",
        "eyebrow": "Barcelona · España · Remoto",
        "h1": "Cineasta IA",
        "lede": "Escribo, dirijo y monto películas hechas con modelos de vídeo generativo: videoclips, anuncios y cortometrajes. También ruedo con cámara, así que el trabajo con IA se mide con el mismo nivel que un rodaje real.",
        "service_type": "Cine con inteligencia artificial",
        "blocks": [
            ("h2", "Qué hace realmente un cineasta IA"),
            ("p", "El modelo genera los fotogramas. Todo lo que los convierte en una película sigue siendo una decisión de alguien: quién aparece en pantalla y cómo sigue siendo la misma persona de un plano a otro, el look, el objetivo, dónde va la cámara y cómo se mueve, para qué sirve cada plano y dónde se corta. Ese es el trabajo."),
            ("p", "Sin eso tienes clips: impresionantes durante tres segundos, inservibles juntos. Con eso tienes una secuencia que funciona como una sola pieza, con un personaje coherente, un mundo coherente y un montaje que sostiene la historia."),
            ("h2", "Qué hago"),
            ("ul", [
                "<strong>Videoclips con IA</strong>: piezas completas construidas sobre la canción, con el artista o un personaje coherente en cada plano.",
                "<strong>Anuncios y spots de marca con IA</strong>: promos para eventos, productos y marcas, dirigidos y montados para cada plataforma.",
                "<strong>Cortometrajes generativos</strong>: piezas narrativas, incluidas recreaciones históricas imposibles de rodar.",
                "<strong>VFX con IA dentro de rodajes reales</strong>: planos y efectos generados integrados en material rodado con cámara, como en <em>Habar N-ai</em>.",
            ]),
            ("work", [
                ("buna", "Promo IA · Festivalul Buna Vestire · Dirección y montaje"),
                ("habar", "Videoclip · Kashmir Luchiano ft. Codrin Donciu · Dirección, VFX IA"),
                ("brr_ai", "Videoclip IA · Kashmir Luchiano"),
                ("majolie", "Videoclip IA · Kashmir Luchiano"),
                ("rome", "Corto generativo · El nacimiento de la corrupción"),
                ("romania", "Corto generativo · Rumanía en 1791"),
            ]),
            ("h2", "Cómo funciona un proyecto"),
            ("steps", [
                ("Brief", "Para qué es, dónde se va a ver, cuánto dura y las referencias que ya te gustan."),
                ("Tratamiento y look", "La idea, la dirección visual y la lista de planos, acordadas antes de generar nada."),
                ("Personaje y mundo", "Las personas que se repiten se crean como modelos de identidad entrenados, para que la misma cara se mantenga en cada plano; localizaciones y vestuario se fijan igual."),
                ("Planos", "Cada plano se dirige y se genera por separado —encuadre, movimiento de cámara, luz— y se rehace hasta que sirve, no hasta que simplemente llama la atención."),
                ("Montaje, sonido y etalonaje", "Montaje en Premiere Pro, sonido y un único etalonaje para todo, de modo que los planos generados y los rodados encajen."),
                ("Entrega", "Másters en los formatos que necesites: 16:9 y 9:16 para TikTok, Reels y Shorts."),
            ]),
            ("h2", "Herramientas"),
            ("p", "Kling, Seedance y Higgsfield para vídeo; modelos de personaje entrenados para caras coherentes; Nano Banana y modelos de imagen para fotogramas iniciales; Premiere Pro para el montaje. Las herramientas cambian cada pocos meses. Las decisiones de arriba no, y por eso el trabajo se organiza en torno a ellas y no en torno a un modelo concreto."),
            ("faq", [
                ("¿Puede un vídeo con IA mantener a la misma persona en todos los planos?",
                 "Sí, si la persona se crea bien primero. Entreno un modelo de identidad con fotos de referencia y genero cada plano a partir de él. No es automático —algunos planos se desvían y se vuelven a generar—, pero la película terminada muestra a una sola persona coherente."),
                ("¿Solo trabajas con IA?",
                 "No. También ruedo y monto videoclips reales, y mezclo las dos cosas: material rodado con planos generados dentro. Todo está en el <a href=\"/es/\">portfolio</a>."),
                ("¿Trabajas fuera de Barcelona?",
                 "Sí. Estoy en Barcelona y trabajo con clientes de España, Rumanía y otros países. La mayoría de proyectos con IA se hacen en remoto, del brief a la entrega."),
                ("¿Cuánto cuesta una película con IA?",
                 "Depende de la duración, del número de planos y de si hay que crear antes un personaje o un mundo. Envía el brief y recibes un presupuesto cerrado antes de empezar."),
            ]),
        ],
    },
    ("editor", "es"): {
        "title": "Editor de vídeo con IA en Barcelona — Vlad Grigorov",
        "description": "Editor de vídeo con IA en Barcelona: montaje, etalonaje y planos y VFX generados con IA para videoclips, anuncios y vídeo vertical. Vlad Grigorov.",
        "eyebrow": "Barcelona · España · Remoto",
        "h1": "Editor de vídeo IA",
        "lede": "Monto material rodado con cámara y material hecho con IA, y cada vez más los dos en la misma línea de tiempo. Montaje en Premiere Pro, etalonado como una sola película, con planos y efectos generados donde el material los necesita.",
        "service_type": "Edición de vídeo con inteligencia artificial",
        "blocks": [
            ("h2", "Editar con IA, no que edite la IA"),
            ("p", "La IA no decide el montaje. El ritmo, la interpretación, qué se queda y qué se va: eso sigue siendo montar. Lo que cambia la IA es lo que el montador puede hacer con el material: generar el inserto que no se rodó, añadir un plano de VFX que antes necesitaba un equipo de 3D, alargar un plano o construir una secuencia entera que nunca se grabó."),
            ("p", "Así, el montaje ya no está limitado a lo que se rodó. Esa es la parte del trabajo en la que me especializo: que el material generado y el rodado se monten juntos sin que se note dónde acaba uno y empieza el otro."),
            ("h2", "Qué monto"),
            ("ul", [
                "<strong>Videoclips</strong>: sesiones en directo y producciones completas, montadas sobre la canción.",
                "<strong>Anuncios y spots de marca</strong>: desde una pieza principal hasta un set de versiones cortas.",
                "<strong>Vídeo vertical</strong>: montajes 9:16 para TikTok, Instagram Reels y YouTube Shorts.",
                "<strong>Planos y VFX generados con IA</strong>: añadidos a tu material, igualados en luz, grano y color.",
                "<strong>Etalonaje</strong>: un mismo look para planos rodados y generados.",
            ]),
            ("work", [
                ("habar", "Videoclip · Dirección, montaje, planos VFX con IA"),
                ("brr_live", "Sesión en directo · Kashmir Luchiano · Fotografía y montaje"),
                ("fiveguys", "Sesión en directo · Kashmir Luchiano · Fotografía y montaje"),
                ("delacard", "Videoclip · Kashmir Luchiano · Fotografía y montaje"),
                ("buna", "Promo IA · Festivalul Buna Vestire · Dirección y montaje"),
                ("meet1", "Spot publicitario · Meetings.ro"),
            ]),
            ("h2", "Cómo funciona"),
            ("steps", [
                ("Material", "Me envías el material rodado, la música y las referencias. Si todavía no hay material, los planos se pueden generar."),
                ("Primer montaje", "Un montaje completo de la pieza, para cerrar la estructura antes del trabajo de detalle."),
                ("Planos IA y VFX", "Los insertos que faltan, los efectos y los planos extra se generan para que encajen con el material que los rodea."),
                ("Sonido y etalonaje", "Pase de sonido y un único etalonaje para todo."),
                ("Versiones", "Máster final más las versiones cortas y los formatos que pide cada plataforma."),
            ]),
            ("faq", [
                ("¿Puedes añadir planos con IA a un material que ya he rodado?",
                 "Sí, es exactamente lo que se hizo en <em>Habar N-ai</em>: un videoclip rodado con planos de VFX generados con IA integrados en el montaje. Los planos generados se igualan con el material en luz, color y grano."),
                ("¿Qué necesitas de mí?",
                 "El material rodado (o el brief, si todo se va a generar), la música o la voz en off, la fecha de entrega y dos o tres referencias del tono que buscas."),
                ("¿Montas vídeos verticales?",
                 "Sí. Cada proyecto se puede entregar en 9:16 para TikTok, Reels y Shorts además del máster 16:9."),
                ("¿Trabajas en remoto?",
                 "Sí. Estoy en Barcelona y monto para clientes de España, Rumanía y otros países; el material se intercambia online."),
            ]),
        ],
    },
}


def esc(s):
    return html.escape(s, quote=True)


def url_of(page, lang):
    return SITE + PAIRS[page][lang]


def render_blocks(blocks, ui):
    out = []
    for kind, val in blocks:
        if kind == "p":
            out.append(f'      <p>{val}</p>')
        elif kind == "h2":
            out.append(f'      <h2>{esc(val)}</h2>')
        elif kind == "ul":
            items = "\n".join(f'        <li>{v}</li>' for v in val)
            out.append(f'      <ul class="page__list">\n{items}\n      </ul>')
        elif kind == "steps":
            items = "\n".join(
                f'        <li><h3>{esc(t)}</h3><p>{d}</p></li>' for t, d in val)
            out.append(f'      <ol class="page__steps">\n{items}\n      </ol>')
        elif kind == "faq":
            items = "\n".join(
                f'        <div class="page__qa"><h3>{esc(q)}</h3><p>{a}</p></div>' for q, a in val)
            out.append(f'      <h2>{esc(ui["faq"])}</h2>\n      <div class="page__faq">\n{items}\n      </div>')
        elif kind == "work":
            cards = []
            for key, credit in val:
                yt, title = WORK[key]
                cards.append(
                    f'''        <a class="project" href="https://www.youtube.com/watch?v={yt}" target="_blank" rel="noopener" aria-label="{esc(ui["watch"])}: {esc(title)}">
          <div class="project__media">
            <img class="project__thumb" loading="lazy" decoding="async" width="480" height="360"
                 src="https://img.youtube.com/vi/{yt}/hqdefault.jpg" alt="{esc(title)}" />
            <span class="project__play" aria-hidden="true"></span>
          </div>
          <div class="project__meta">
            <h3 class="project__title">{esc(title)}</h3>
            <span class="project__type">{esc(credit)}</span>
          </div>
        </a>''')
            out.append(f'      <h2>{esc(ui["selected"])}</h2>\n    </div>\n    <div class="work__grid page__work">\n'
                       + "\n".join(cards) + '\n    </div>\n    <div class="page__body">')
    return "\n".join(out)


def schema(page, lang, data, modified):
    ui = UI[lang]
    url = url_of(page, lang)
    person = {"@type": "Person", "@id": f"{SITE}/#vlad", "name": "Vlad Grigorov", "url": f"{SITE}/"}
    graph = [
        person,
        {
            "@type": "WebPage",
            "@id": f"{url}#webpage",
            "url": url,
            "name": data["title"],
            "description": data["description"],
            "inLanguage": lang,
            "isPartOf": {"@id": f"{SITE}/#website"},
            "about": {"@id": f"{url}#service"},
            "breadcrumb": {"@id": f"{url}#breadcrumb"},
            "primaryImageOfPage": {"@type": "ImageObject", "url": f"{SITE}/assets/og-image.jpg"},
            "dateModified": modified,
        },
        {
            "@type": "Service",
            "@id": f"{url}#service",
            "name": data["h1"],
            "serviceType": data["service_type"],
            "description": data["lede"],
            "url": url,
            "provider": {"@id": f"{SITE}/#vlad"},
            "areaServed": [
                {"@type": "City", "name": "Barcelona"},
                {"@type": "Country", "name": "Spain"},
                {"@type": "Country", "name": "Romania"},
            ],
        },
        {
            "@type": "BreadcrumbList",
            "@id": f"{url}#breadcrumb",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": ui["home_crumb"], "item": SITE + ui["home"]},
                {"@type": "ListItem", "position": 2, "name": data["h1"], "item": url},
            ],
        },
    ]
    return json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=2)


def render(page, lang, modified):
    data = PAGES[(page, lang)]
    ui = UI[lang]
    url = url_of(page, lang)
    depth = PAIRS[page][lang].strip("/").count("/") + 1
    up = "../" * depth
    other = "es" if lang == "en" else "en"
    alt_locale = UI[other]["locale"]

    nav_links = "\n".join(
        f'    <a href="{PAIRS[p][lang]}"' + (' aria-current="page"' if p == page else "") + f'>{esc(ui["nav"][p])}</a>'
        for p in ("filmmaker", "editor"))
    lang_items = []
    for code in ("en", "es"):
        if code == lang:
            lang_items.append(f'      <span class="lang__on" aria-current="true">{code.upper()}</span>')
        else:
            lang_items.append(f'      <a class="lang__off" href="{PAIRS[page][code]}" hreflang="{code}" lang="{code}">{code.upper()}</a>')

    return f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{esc(data["title"])}</title>
<meta name="description" content="{esc(data["description"])}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
<link rel="canonical" href="{url}" />
<link rel="alternate" hreflang="en" href="{url_of(page, "en")}" />
<link rel="alternate" hreflang="es" href="{url_of(page, "es")}" />
<link rel="alternate" hreflang="x-default" href="{url_of(page, "en")}" />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="Vlad Grigorov" />
<meta property="og:url" content="{url}" />
<meta property="og:locale" content="{ui["locale"]}" />
<meta property="og:locale:alternate" content="{alt_locale}" />
<meta property="og:title" content="{esc(data["title"])}" />
<meta property="og:description" content="{esc(data["description"])}" />
<meta property="og:image" content="{SITE}/assets/og-image.jpg" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="627" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{esc(data["title"])}" />
<meta name="twitter:description" content="{esc(data["description"])}" />
<meta name="twitter:image" content="{SITE}/assets/og-image.jpg" />
<meta name="theme-color" content="#0B0B0D" />

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="{up}css/style.css" />
<link rel="stylesheet" href="{up}css/page.css" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%230B0B0D'/%3E%3Ctext x='16' y='23' font-size='19' font-family='Arial' font-weight='bold' fill='%23E8A24C' text-anchor='middle'%3EVG%3C/text%3E%3C/svg%3E" />

<script type="application/ld+json">
{schema(page, lang, data, modified)}
</script>
</head>
<body class="page">

<header class="nav">
  <a href="{ui["home"]}" class="nav__brand" aria-label="Vlad Grigorov">VG<span class="nav__dot">.</span></a>
  <nav class="nav__links">
    <a href="{ui["work"]}">{esc(ui["nav_work"])}</a>
{nav_links}
    <a href="{ui["contact"]}" class="nav__cta">{esc(ui["nav_contact"])}</a>
    <span class="lang" role="group" aria-label="{esc(ui["lang_label"])}">
{chr(10).join(lang_items)}
    </span>
  </nav>
</header>

<main>
  <article>
    <header class="page__head">
      <nav class="page__crumbs" aria-label="Breadcrumb"><a href="{ui["home"]}">Vlad Grigorov</a> <span aria-hidden="true">/</span> <span>{esc(data["h1"])}</span></nav>
      <p class="page__eyebrow">{esc(data["eyebrow"])}</p>
      <h1 class="page__title">{esc(data["h1"])}</h1>
      <p class="page__lede">{data["lede"]}</p>
    </header>

    <div class="page__body">
{render_blocks(data["blocks"], ui)}
    </div>

    <section class="page__cta">
      <h2>{esc(ui["cta_title"])}</h2>
      <p>{esc(ui["cta_text"])}</p>
      <a class="contact__email" href="mailto:{EMAIL}">{EMAIL}</a>
      <p><a class="page__more" href="{ui["home"]}">{esc(ui["cta_portfolio"])} &rarr;</a></p>
    </section>
  </article>
</main>

<footer class="footer">
  <span>&copy; 2026 Vlad Grigorov</span>
  <span>{esc(ui["footer_role"])}</span>
  <a href="{ui["home"]}" class="footer__top">vladgrigorov.com</a>
</footer>

</body>
</html>
'''


def all_pages():
    """(relative path on disk, page key, lang) for every service page."""
    for page, langs in PAIRS.items():
        for lang, path in langs.items():
            yield path.strip("/") + "/index.html", page, lang


def sitemap_groups():
    """Each group: list of (url, hreflang) that are one page in several languages."""
    return [[(url_of(p, l), l) for l in ("en", "es")] for p in PAIRS]
