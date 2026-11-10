# ramidev20.github.io

Portfolio site with a home page and a download page for each project, hosted on GitHub Pages.

```
index.html                         → ramidev20.github.io
config.js                          ← edit this: your info + every project
assets/                            styles and scripts
projects/daily-dz/index.html       → ramidev20.github.io/daily-dz/
projects/daily-dz/releases/        ← the app's builds (.apk, .exe, …), one folder per version
projects/fascia/…  projects/medsync/…  projects/tripway/…  projects/medical-image-classifier/…
_layouts/project.html              the shared template for every project page
_config.yml                        GitHub Pages build settings
```

Each project has one folder in `projects/`. Its page is still published straight at
`/<slug>/` (no `/projects/` in the address), thanks to the `permalink` line at the
top of its `index.html` — GitHub Pages' built-in Jekyll build reads it.

## Put it online

1. Create a **public** repo named exactly `ramidev20.github.io`.
2. Upload everything in this folder (keep the folders), then commit.
3. **Settings → Pages** → *Deploy from a branch* → `main`, `/ (root)` → Save.
4. After a minute: `https://ramidev20.github.io` and `https://ramidev20.github.io/daily-dz/`.

## Project pages

Each project page shows the project, a big download button (it picks the right
file for the visitor's device, e.g. the `.apk` on Android), and **every version**
with its files, sizes, download counts and release notes.

### Adding a build (MedSync, Fascia, DailyDZ)

Put the files in the project's `releases` folder, inside a folder named after the version:

```
projects/daily-dz/releases/1.0.0/DailyDZ-1.0.0.apk
projects/daily-dz/releases/1.1.0/DailyDZ-1.1.0.apk
projects/daily-dz/releases/1.1.0/notes.txt          ← optional
projects/daily-dz/releases/1.2.0-beta/DailyDZ-1.2.0-beta.apk
```

Commit and push. About a minute later `/daily-dz/` lists the versions newest first,
the newest normal version becomes the main download, and folders with `-beta`,
`-alpha` or `-rc` show as pre-releases. Nothing to change in `config.js`.

`notes.txt` becomes the release notes. An optional first line sets the date:

```
Date: 2026-11-10
- Offline mode for the daily feed
- **Faster** startup
```

The device is recognised from the file extension: `.apk` = Android,
`.exe`/`.msi` = Windows, `.dmg` = macOS, `.AppImage`/`.deb` = Linux.

**Size limits for files in the repo**

- Uploading in the browser (Add file → Upload files): **25 MB per file**.
- With `git push` or GitHub Desktop: **100 MB per file** (GitHub warns above 50 MB).
- Keep the whole site under **1 GB**. Old builds stay in the git history even after
  you delete them, so the repo only grows. For big or frequent builds, GitHub
  Releases (below) avoid these limits.

### Other ways to provide versions

- `autoRelease: true` — reads GitHub Releases of the project's own (public) repo
  (used by the Medical Image Classifier).
- `releasesRepo` + `tagPrefix` — reads GitHub Releases from another public repo,
  e.g. this site repo with tags like `daily-dz-v1.1.0` (files up to 2 GB, no repo growth).
- `versions: [...]` — list versions and links by hand (example at the top of `config.js`).

### Add a new project page

1. Add the project to `projects` in `config.js` with a `slug`, e.g. `slug: "my-app"`
   (and `releasesFolder: true` if you'll put builds in the repo).
2. Create `projects/my-app/index.html` containing only:

   ```
   ---
   layout: project
   title: My App
   slug: my-app
   permalink: /my-app/
   ---
   ```

3. Put builds in `projects/my-app/releases/<version>/`.

## Tips

- **Branch:** the file lookup reads the `main` branch (`site.branch` in `config.js`).
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
