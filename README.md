# Jotham Raphael Banji · Portfolio

Personal portfolio of Jotham Raphael Banji, an Applied Artificial Intelligence student at VILNIUS TECH.

**Live site:** https://jothambanji.github.io/portfolio/

## What's inside

- `index.html`: the single-page site (hero, projects, experience, skills, about, contact)
- `styles.css`: all styling, no build step or framework
- `script.js`: scroll reveal, sticky navigation, back-to-top button
- `assets/projects/`: project screenshots (960×600 WebP)
- `cv/`: downloadable CV

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

## Deploy

GitHub Pages: Settings → Pages → Deploy from a branch → `main` / `(root)`.

## Adding a project

Copy one `<article class="project-card">` block in the Projects section, add a 960×600 screenshot to `assets/projects/`, and update the title, description, tags and links.
