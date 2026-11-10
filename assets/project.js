/* Project page: yoursite/<slug>/ — details, the recommended download and every version */
const SLUG = document.body.dataset.project;
const P = CONFIG.projects.find(p => slugOf(p) === SLUG);
const app = $("#app");

app.innerHTML = `
<header class="nav">
  <div class="wrap">
    <a class="logo" href="${ROOT}" aria-label="Home">
      <span class="avatar-slot" data-size="34"></span>
      <span class="logo-text caps"><span>${esc(CONFIG.shortName || CONFIG.name)}</span><span>Portfolio</span></span>
    </a>
    <nav class="links caps" aria-label="Main">
      <a href="${ROOT}">Home</a>
      <a href="${ROOT}#projects" aria-current="true">Projects</a>
      <a href="${ROOT}#services">Skills</a>
      <a href="${ROOT}#contact">Contact</a>
    </nav>
    <div class="nav-right">
      <button class="icon-btn" id="themeBtn" type="button">${ICONS.moon}${ICONS.sun}</button>
      <a class="btn caps talk" href="${ROOT}#contact">Let's talk</a>
    </div>
  </div>
</header>
<main id="main"></main>
<footer>
  <div class="wrap caps">
    <span>© ${new Date().getFullYear()} ${esc(CONFIG.name)}</span>
    <span>Hosted on GitHub Pages</span>
  </div>
</footer>`;
initTheme($("#themeBtn"));
fillAvatars();

// Static underline under "Projects"
(() => {
  const box = $(".links"), cur = box.querySelector('[aria-current="true"]');
  const ind = el("span", { class: "nav-ind", "aria-hidden": "true" });
  box.appendChild(ind);
  const place = () => { ind.style.width = cur.offsetWidth + "px"; ind.style.transform = `translateX(${cur.offsetLeft}px)`; ind.style.opacity = "1"; };
  place();
  window.addEventListener("resize", place);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
})();

const main = $("#main");

if (!P) {
  document.title = `Not found — ${CONFIG.name}`;
  main.innerHTML = `<section class="hero p-hero"><div class="wrap"><div>
    <a class="crumb caps" href="${ROOT}#projects">${ICONS.back}<span>All projects</span></a>
    <h1>Project not found</h1>
    <p class="lede">There's no project called “${esc(SLUG || "")}” in config.js. Check that the folder name matches a project's <code>slug</code>.</p>
  </div></div></section>`;
} else {
  renderProject(P);
}

function renderProject(p) {
  document.title = `${p.name} — Downloads · ${CONFIG.name}`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta && p.description) meta.setAttribute("content", p.description);

  main.innerHTML = `
  <section class="hero p-hero">
    <div class="wrap">
      <div>
        <a class="crumb caps reveal" href="${ROOT}#projects">${ICONS.back}<span>All projects</span></a>
        <div class="p-title reveal d2">
          <span id="pIcon"></span>
          <div>
            <h1>${esc(p.name)}</h1>
            <p class="p-sub caps">${esc(p.note || p.category || "")}</p>
          </div>
        </div>
        ${p.description ? `<p class="lede reveal d2">${esc(p.description)}</p>` : ""}
        <ul class="tags reveal d3" aria-label="Platforms and tools">${[...(p.platforms || []), ...(p.tags || [])].map(t => `<li>${esc(t)}</li>`).join("")}</ul>
        <div class="hero-actions reveal d3" id="pActions"></div>
        <p class="rec-note" id="recNote" hidden></p>
      </div>
      <aside class="latest reveal d3" id="latestCard" aria-label="Latest version" hidden></aside>
    </div>
  </section>

  <section class="section" id="versions" aria-labelledby="versionsTitle">
    <div class="wrap">
      <div class="section-head">
        <div>
          <span class="caps eyebrow">Downloads</span>
          <h2 id="versionsTitle">All <span class="hl">versions</span></h2>
        </div>
        <p>Every published build, newest first. Older versions stay here in case you need to go back.</p>
      </div>
      <div class="releases" id="releases"><p class="loading caps">Loading versions</p></div>
    </div>
  </section>`;

  // No releases set up (e.g. a website): skip the versions section
  if (!releaseSource(p) && !(p.versions && p.versions.length)) $("#versions").remove();

  const iconBox = projectIcon(p);
  iconBox.classList.add("big");
  $("#pIcon").replaceWith(iconBox);

  const actions = $("#pActions");
  const baseActions = () => {
    if (p.website) actions.appendChild(el("a", { class: "btn accent big caps", href: p.website, target: "_blank", rel: "noopener" }, `<span>Open app</span>${ICONS.arrow}`));
    if (p.repo) actions.appendChild(el("a", { class: "btn big caps", href: `https://github.com/${p.repo}`, target: "_blank", rel: "noopener" }, `${ICONS.code}<span>Source code</span>`));
  };

  loadVersions(p).then(list => {
    actions.replaceChildren();
    const latest = list.find(v => !v.prerelease) || list[0];

    if (latest && latest.files.length) {
      // Recommend the file that matches the visitor's device
      const os = visitorOS();
      const pick = pickForVisitor(downloadLabel(latest.files));
      if (pick) {
        actions.appendChild(downloadButton({ ...pick, title: `Download v${cleanTag(latest.tag)}` }, true));
        const note = $("#recNote");
        note.hidden = false;
        note.textContent = pick.platform && pick.platform === os
          ? `Picked the ${pick.platform} build for your device.`
          : `${pick.platform ? `${pick.platform} · ` : ""}${pick.name}`;
      }
      actions.appendChild(el("a", { class: "btn big caps", href: "#versions" }, `${ICONS.versions}<span>${pick ? "Other downloads" : "Choose a download"}</span>`));
    }
    baseActions();
    renderLatest(latest, list);
    if ($("#releases")) renderReleases(p, list, latest);
  });
}

function renderLatest(latest, list) {
  const card = $("#latestCard");
  if (!latest) return;
  const total = list.reduce((n, v) => n + v.files.reduce((m, f) => m + (f.downloads || 0), 0), 0);
  const stats = [
    { label: "Released", value: latest.date ? formatDate(latest.date) : "—" },
    { label: "Files", value: String(latest.files.length) },
    total ? { label: "All-time downloads", value: total.toLocaleString() } : { label: "Versions", value: String(list.length) }
  ];
  card.innerHTML = `
    <span class="caps eyebrow">Latest version</span>
    <p class="big-ver">v${esc(cleanTag(latest.tag))}</p>
    <dl class="stats">${stats.map(s => `<div><dt class="caps">${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`).join("")}</dl>`;
  card.hidden = false;
}

function renderReleases(p, list, latest) {
  const box = $("#releases");
  box.replaceChildren();
  if (!list.length) {
    const msg = p.website && !releaseSource(p)
      ? `${esc(p.name)} runs in your browser, so there's nothing to download. <a href="${esc(p.website)}" target="_blank" rel="noopener">Open the app</a>.`
      : `No versions have been published yet. Check back soon${p.repo ? `, or follow the project on <a href="https://github.com/${esc(p.repo)}" target="_blank" rel="noopener">GitHub</a>` : ""}.`;
    box.innerHTML = `<div class="empty"><p>${msg}</p></div>`;
    return;
  }
  list.forEach(v => {
    const art = el("article", { class: "release" + (v === latest ? " is-latest" : "") });
    const side = el("div", { class: "rel-side" });
    side.innerHTML = `
      <h3>v${esc(cleanTag(v.tag))}</h3>
      ${v.name && cleanTag(v.name) !== cleanTag(v.tag) ? `<p class="rel-name">${esc(v.name)}</p>` : ""}
      <div>${v === latest ? '<span class="badge latest-b caps">Latest</span>' : ""}${v.prerelease ? '<span class="badge pre caps">Pre-release</span>' : ""}</div>
      ${v.date ? `<span class="rel-date caps">${esc(formatDate(v.date))}</span>` : ""}`;

    const body = el("div", { class: "rel-body" });
    if (v.files.length) {
      const ul = el("ul", { class: "files" });
      downloadLabel(v.files).forEach(f => {
        const li = el("li");
        const metaBits = [f.platform, formatSize(f.size), f.downloads ? `${f.downloads.toLocaleString()} downloads` : ""].filter(Boolean);
        li.innerHTML = `<div class="file-info"><span class="file-name">${esc(f.name)}</span><span class="file-meta caps">${esc(metaBits.join(" · "))}</span></div>`;
        li.appendChild(downloadButton({ ...f, title: "Download" }, v === latest));
        ul.appendChild(li);
      });
      body.appendChild(ul);
    } else {
      body.appendChild(el("p", { class: "no-files" }, "No files attached to this version."));
    }
    if (v.notes.trim()) {
      const d = el("details", { class: "notes" });
      if (v === latest) d.open = true;
      d.innerHTML = `<summary class="caps">Release notes</summary><div class="notes-body">${mdLite(v.notes)}</div>`;
      body.appendChild(d);
    }
    art.append(side, body);
    box.appendChild(art);
  });
}
