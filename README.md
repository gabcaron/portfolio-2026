# Gabin Caron — Portfolio

Personal portfolio of **Gabin Caron**, French web developer.
Designed and developed from scratch: a drifting wall of travel polaroids rendered in WebGL, editorial case studies, and content managed through a headless CMS.

🔗 **Live:** [www.gabincaron.com](https://www.gabincaron.com)

<!-- Ajoute une capture ou un GIF de l'accueil ici, ex. : ![Homepage](./docs/preview.gif) -->

---

## Highlights

- **WebGL gallery** — an infinite, draggable wall of polaroids built with [OGL](https://github.com/oframe/ogl) and custom GLSL shaders (auto-drifting and non-interactive on mobile).
- **Smooth scrolling & motion** — custom scroll engine with touch support, GSAP page transitions and scroll-triggered reveals.
- **Headless CMS** — every page (projects, about, navigation, availability…) is driven by [Prismic](https://prismic.io); new projects appear automatically, case study pages included.
- **Case studies** — dynamic `/projects/:slug` pages with challenge / approach / outcome and a "next project" link.
- **Responsive** — dedicated mobile layouts, fullscreen menu and contact panel.
- **SEO** — per-page meta & canonical URLs, Open Graph / X cards, dynamic `sitemap.xml`, `robots.txt`, schema.org `Person` data.
- **Security & privacy** — CSP and security headers in production, sanitized CMS HTML, self-hosted fonts (no third-party font requests), no tracking cookies.
- **Custom error page** — split-flap airport board adapting to any HTTP status code.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | [Nuxt 4](https://nuxt.com) (Vue 3, SSR) |
| WebGL | [OGL](https://github.com/oframe/ogl), GLSL shaders (`vite-plugin-glsl`) |
| Animation | [GSAP](https://gsap.com) |
| CMS | [Prismic](https://prismic.io) |
| State | [Pinia](https://pinia.vuejs.org) |
| Styles | SCSS, [include-media](https://eduardoboucas.github.io/include-media/) |
| Fonts | Noto Sans & Noto Serif Display (self-hosted, SIL OFL) |
| Hosting | [Vercel](https://vercel.com) |

## Project structure

```
app/
├── app.vue                 # Layout, preloader, page transitions, render loop
├── error.vue               # Split-flap error page (404, 500…)
├── pages/                  # index, about, projects, detail/[uid] (→ /projects/:slug), legal
├── components/             # Navigation, Preloader, Footer, ContactCta
├── composables/            # useCanvas, useGL, useScroll, usePageScroll, useReveal, useSEO…
├── webgl/Home/             # WebGL gallery (OGL)
├── assets/styles/          # SCSS (base, shared, layouts, pages)
├── assets/shaders/         # GLSL shaders
└── utils/                  # safeHtml (CMS sanitizer)
server/
├── api/                    # Prismic endpoints: home, about, layout, projects
├── routes/sitemap.xml.js   # Dynamic sitemap
└── utils/                  # Prismic client, slugify
public/                     # Favicons, fonts, robots.txt
```

## Getting started

**Requirements:** Node.js 20+ and a Prismic repository.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# then fill in PRISMIC_ENDPOINT (and PRISMIC_ACCESS_TOKEN if the repository is private)

# 3. Start the dev server on http://localhost:3000
npm run dev
```

### Environment variables

| Variable | Description |
| --- | --- |
| `PRISMIC_ENDPOINT` | Prismic API endpoint, e.g. `https://your-repo.cdn.prismic.io/api/v2` |
| `PRISMIC_ACCESS_TOKEN` | Prismic access token (only for private repositories) |

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally (security headers & caching enabled) |
| `npm run generate` | Static generation |

## Content (Prismic)

| Custom type | Used for |
| --- | --- |
| `home` | Homepage gallery images |
| `about` | About page (slices: title, me, skills, skills_list, philosophy) |
| `project` | Projects list and case studies (name, year, category, description, image, tags, link, type, client, summary, focus, tagline, challenge, approach, outcome) |
| `navigation` | Menu links, location and availability status |
| `meta` | Site title and default share image |
| `preloader` | Preloader text |

Projects are sorted by year (oldest first) and their URL slug is generated from the project name.

## License

The source code is shared for reference and learning purposes.
All content — texts, images, design and branding — belongs to Gabin Caron and may not be reused without permission.
Fonts are licensed under the [SIL Open Font License](./public/fonts/OFL.txt).

---

Made by **Gabin Caron** — [GitHub](https://github.com/gabcaron) · [LinkedIn](https://linkedin.com/in/gab-caron/)
