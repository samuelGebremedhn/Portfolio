# Samuel Gebremedhn — Portfolio Website

A responsive personal portfolio for software, applied AI, research, and engineering projects. Built with plain HTML, CSS, and JavaScript for GitHub Pages.

## Features
- Restrained, professional layout with a readable Inter font and neutral slate palette
- Responsive desktop, tablet, and mobile navigation
- Selected project cards, research, about, skills, and contact sections
- Automatically loads up to 12 recent public repositories from `https://github.com/samuelGebremedhn` on page load
- Links selected project cards to matching GitHub repositories when names match
- No build step, API key, framework, or server required

## Run locally
Open `index.html` in a browser, or run `python -m http.server 8000` and visit `http://localhost:8000`.

## Automatic GitHub repositories
The page uses GitHub's public REST API. New public repositories can appear in the **More of my work** section on the next page load. The page excludes archived repositories, the Portfolio repository, and selected projects already shown above to avoid duplicate cards. It displays up to 12 other repositories, ordered by most recently updated. The anonymous GitHub API has rate limits, so if the API is temporarily unavailable the page still links to the full profile.

To change the account, edit `GITHUB_USERNAME` in `script.js` and the profile links in `index.html`.

## Deploy on GitHub Pages
1. Create a public repository, for example `samuel-portfolio`.
2. Upload `index.html`, `styles.css`, `script.js`, `README.md`, and `LICENSE` to the repository root.
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**, select `main` and `/(root)`, then save.
5. Wait for GitHub Pages to show the published URL.

## Accuracy note
The selected-project cards describe prototypes and research work; they should not be interpreted as certified, production-ready, or flight-ready systems. Review the content and project repository names before publishing.


## Portfolio features

- Responsive navigation with active-section highlighting and a reading-progress indicator.
- Dark/light theme toggle. The first visit follows the visitor's system preference; a manual choice is saved in the browser for future visits.
- Filterable featured projects and automatically loaded public GitHub repositories.
- Education timeline, research highlights, technical skills, and contact links.
- Accessible focus states, skip-to-content link, and reduced-motion support.

The GitHub repository list uses the public GitHub REST API without a token. If the API is rate-limited or unavailable, the portfolio still works and links to the full profile.
