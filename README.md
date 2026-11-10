# ramidev20.github.io

Portfolio site with a home page and a download page for each project, hosted on GitHub Pages.

```
index.html                       → ramidev20.github.io
config.js                        ← edit this: your info + every project
assets/                          styles and scripts
projects/daily-dz.html           → ramidev20.github.io/daily-dz/
projects/fascia.html             → ramidev20.github.io/fascia/
projects/medsync.html            → ramidev20.github.io/medsync/
projects/medical-image-classifier.html → …/medical-image-classifier/
projects/tripway.html            → ramidev20.github.io/tripway/
_layouts/project.html            the shared template for every project page
_config.yml                      GitHub Pages build settings
```

All project pages live in `projects/`, but each one is published straight at
`/<slug>/` (no `/projects/` in the address). That's done by the `permalink`
line at the top of each file — GitHub Pages' built-in Jekyll build reads it.

## Put it online

1. Create a **public** repo named exactly `ramidev20.github.io`.
2. Upload everything in this folder (keep the folders), then commit.
3. **Settings → Pages** → *Deploy from a branch* → `main`, `/ (root)` → Save.
4. After a minute: `https://ramidev20.github.io` and `https://ramidev20.github.io/daily-dz/`.

## Project pages

Each project page shows the project, a big download button (it picks the right
file for the visitor's device, e.g. the `.apk` on Android), and **every version**
with its files, sizes, download counts and release notes.

The versions come from **GitHub Releases**. There are three ways to feed them:

| Your code repo is… | Do this in `config.js` |
|---|---|
| **Public** | `autoRelease: true` — done. Publish releases in that repo. |
| **Private** (MedSync, Fascia, DailyDZ) | Make a small **public** repo just for builds, e.g. `ramidev20/daily-dz-releases`. Publish your releases there (no code needed), and set `releasesRepo: "ramidev20/daily-dz-releases"`. |
| Hosted elsewhere | Fill `versions: [...]` by hand (example at the top of `config.js`). |

> GitHub can't hand out files from a private repo to visitors, which is why
> private projects need a public releases repo (or manual links).

### Publish a version

In the releases repo: **Releases → Draft a new release** → tag `v1.2.0` →
write what changed (Markdown lists and **bold** show on the page) → attach the
files (`.apk`, `.exe`, `.msi`, `.dmg`, `.AppImage`, `.deb`, …) → **Publish**.
The page updates by itself. Tick *Set as a pre-release* for betas; they get a
"Pre-release" badge and don't replace the main download.

### Add a new project page

1. Add the project to `projects` in `config.js` with a `slug`, e.g. `slug: "my-app"`.
2. Create `projects/my-app.html` containing only:

   ```
   ---
   layout: project
   title: My App
   slug: my-app
   permalink: /my-app/
   ---
   ```

   The `slug` must match the one in `config.js`; `permalink` is the address.

## Tips

- **Filters:** `platforms` can be `"Mobile"`, `"Web"`, `"Desktop"`.
- **Headline:** `*word*` = heavier pixels, `~word~` = purple-to-pink colour. The
  first two `stickers` sit by the `~coloured~` word, the third (lime) by the `*bold*` word.
- **Colours:** `--purple` (main), `--violet`, `--pink`, `--lime` at the top of
  `assets/style.css` (once for dark, once for light).
- **Profile photo:** `avatar: ""` uses your GitHub picture.
- GitHub's API allows 60 lookups per hour per visitor; results are cached per
  browser session, so normal browsing never reaches that.
- Keep **Deploy from a branch** in Settings → Pages, and don't add a `.nojekyll`
  file: the project addresses rely on GitHub's Jekyll build.
- To preview everything on your computer, install Jekyll and run
  `jekyll serve` in this folder, then open `http://localhost:4000`. (A plain file
  server shows the home page but not the `/<slug>/` addresses.)
