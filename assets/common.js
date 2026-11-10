/* Shared helpers for the home page and the project pages. */

const ROOT = document.body.dataset.root || "";          // "" on the home page, "../" on project pages
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
function el(tag, attrs = {}, html = "") {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (html) e.innerHTML = html;
  return e;
}
// Paths in the config are written from the site root; fix them up on sub-pages
const fromRoot = (path) => (!path || /^(https?:|data:|\/)/.test(path)) ? path : ROOT + path;
const slugOf = (p) => p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const pageOf = (p) => `${ROOT}${slugOf(p)}/`;

const ICONS = {
  github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
  versions: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>',
  moon: '<svg class="theme-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
  sun: '<svg class="theme-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
};

/* ---------- Theme ---------- */
const root = document.documentElement;
function initTheme(btn) {
  const sync = () => btn.setAttribute("aria-label", root.dataset.theme === "light" ? "Switch to dark theme" : "Switch to light theme");
  btn.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    sync();
  });
  sync();
}

/* ---------- Pixel icons (generated from a name) ---------- */
function seeded(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; };
}
function pixelIcon(seed) {
  const cv = document.createElement("canvas");
  cv.width = 8; cv.height = 8;
  cv.setAttribute("aria-hidden", "true");
  const ctx = cv.getContext("2d");
  const rnd = seeded(seed);
  const css = getComputedStyle(root);
  const grad = ctx.createLinearGradient(0, 0, 8, 8);
  grad.addColorStop(0, css.getPropertyValue("--violet").trim() || "#a78bfa");
  grad.addColorStop(1, css.getPropertyValue("--pink").trim() || "#ec5fa8");
  const lime = css.getPropertyValue("--lime").trim() || "#c8f135";
  for (let y = 1; y < 7; y++) for (let x = 0; x < 4; x++) {
    if (rnd() < 0.45) continue;
    const r = rnd();
    ctx.globalAlpha = r < 0.25 ? 0.5 : 1;
    ctx.fillStyle = r > 0.93 ? lime : grad;
    ctx.fillRect(x, y, 1, 1);
    ctx.fillRect(7 - x, y, 1, 1);
  }
  return cv;
}
const pixelAvatarURL = () => pixelIcon(CONFIG.name).toDataURL();
function projectIcon(p) {
  const icon = el("div", { class: "icon" });
  if (p.icon) icon.appendChild(el("img", { src: fromRoot(p.icon), alt: "", class: "full" }));
  else { icon.dataset.pixelSeed = p.name; icon.appendChild(pixelIcon(p.name)); }
  return icon;
}
// Re-draw pixel icons when the theme flips so they stay visible
new MutationObserver(() => {
  document.querySelectorAll("[data-pixel-seed]").forEach(box => box.replaceChildren(pixelIcon(box.dataset.pixelSeed)));
  document.querySelectorAll("img.avatar.pixel").forEach(img => img.src = pixelAvatarURL());
}).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

// Avatar: your own image, else your GitHub picture, else a pixel icon
function fillAvatars() {
  const src = CONFIG.avatar ? fromRoot(CONFIG.avatar) : (CONFIG.github ? `https://github.com/${CONFIG.github}.png?size=160` : "");
  document.querySelectorAll(".avatar-slot").forEach(slot => {
    const size = slot.dataset.size;
    const img = el("img", { class: "avatar", alt: "", width: size, height: size });
    img.style.width = img.style.height = size + "px";
    const usePixel = () => { img.classList.add("pixel"); img.src = pixelAvatarURL(); };
    img.addEventListener("error", usePixel, { once: true });
    if (src) img.src = src; else usePixel();
    slot.replaceWith(img);
  });
}

/* ---------- Releases ---------- */
function platformOf(fileName) {
  const n = fileName.toLowerCase();
  if (/\.(apk|aab)$/.test(n)) return "Android";
  if (/\.ipa$/.test(n)) return "iOS";
  if (/\.(exe|msi|msix|appx)$/.test(n)) return "Windows";
  if (/\.(dmg|pkg)$/.test(n)) return "macOS";
  if (/\.(appimage|deb|rpm|snap|flatpak)$/.test(n)) return "Linux";
  if (/(win|windows)/.test(n)) return "Windows";
  if (/(mac|darwin|osx)/.test(n)) return "macOS";
  if (/linux/.test(n)) return "Linux";
  return "";
}
function visitorOS() {
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Macintosh|Mac OS X/i.test(ua)) return "macOS";
  if (/Linux/i.test(ua)) return "Linux";
  return "";
}
function formatSize(bytes) {
  if (!bytes) return "";
  if (typeof bytes === "string") return bytes;
  return bytes > 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
function formatDate(iso) {
  const d = new Date(iso);
  return isNaN(d) ? String(iso || "") : d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}
const cleanTag = (t) => String(t || "").replace(/^v(?=\d)/i, "");

// One shape for both GitHub Releases and hand-written versions
function slimRelease(r) {
  return {
    tag: r.tag_name, name: r.name || "", date: r.published_at || r.created_at, prerelease: !!r.prerelease,
    notes: r.body || "", url: r.html_url,
    files: (r.assets || []).map(a => ({ name: a.name, url: a.browser_download_url, size: a.size, downloads: a.download_count, platform: platformOf(a.name) }))
  };
}
function manualVersions(p) {
  return (p.versions || []).map(v => ({
    tag: v.version, name: "", date: v.date, prerelease: !!v.prerelease, notes: v.notes || "", url: "",
    files: (v.files || []).map(f => ({ name: f.name || f.label || f.platform || "Download", url: f.url, size: f.size, platform: f.platform || platformOf(f.name || "") }))
  }));
}
const releaseSource = (p) => p.releasesRepo || (p.autoRelease ? p.repo : "");
const hasVersionSource = (p) => !!(p.releasesFolder || releaseSource(p) || (p.versions && p.versions.length));

/* ---------- Builds kept in the site repo: projects/<slug>/releases/<version>/<file> ----------
   A static site can't list a folder, so this asks GitHub for the repo's file list
   (one request per visit, shared by every project) and groups the files by version folder.
   An optional notes.txt in a version folder becomes the release notes; a first line
   "Date: 2026-11-10" sets the date. */
function compareVersions(a, b) {
  const pa = cleanTag(a).split(/-(.*)/), pb = cleanTag(b).split(/-(.*)/);
  const na = pa[0].split("."), nb = pb[0].split(".");
  for (let i = 0; i < Math.max(na.length, nb.length); i++) {
    const d = (parseInt(na[i], 10) || 0) - (parseInt(nb[i], 10) || 0);
    if (d) return d;
  }
  if (!!pa[1] !== !!pb[1]) return pa[1] ? -1 : 1;            // 1.2.0 is newer than 1.2.0-beta
  return String(pa[1] || "").localeCompare(String(pb[1] || ""), undefined, { numeric: true });
}
async function folderVersions(p) {
  const site = CONFIG.site || {};
  if (!p.releasesFolder || !site.repo) return [];
  const tree = await cachedJSON(`https://api.github.com/repos/${site.repo}/git/trees/${site.branch || "main"}?recursive=1`);
  const base = `projects/${slugOf(p)}/releases/`;
  const groups = {};
  (tree.tree || []).forEach(n => {
    if (n.type !== "blob" || !n.path.startsWith(base)) return;
    const parts = n.path.slice(base.length).split("/");
    if (parts.length !== 2 || parts[1].startsWith(".")) return;     // only releases/<version>/<file>
    const [ver, file] = parts;
    const g = groups[ver] || (groups[ver] = { files: [], notes: false });
    if (/^notes\.txt$/i.test(file)) { g.notes = true; return; }
    g.files.push({ name: file, url: ROOT + n.path.split("/").map(encodeURIComponent).join("/"),
                   size: n.size, platform: platformOf(file), local: true });
  });
  const list = Object.entries(groups).filter(([, g]) => g.files.length).map(([ver, g]) => ({
    tag: ver, name: "", date: "", prerelease: /-(alpha|beta|rc|pre|dev|test)/i.test(ver), notes: "", url: "",
    files: g.files, notesUrl: g.notes ? `${ROOT}${base}${encodeURIComponent(ver)}/notes.txt` : ""
  }));
  list.sort((a, b) => compareVersions(b.tag, a.tag));
  await Promise.all(list.map(async v => {
    if (!v.notesUrl) return;
    try {
      const res = await fetch(v.notesUrl);
      if (!res.ok) return;
      const text = await res.text();
      const m = text.match(/^\s*date:\s*(.+?)\s*(\n|$)/i);
      if (m) { v.date = m[1]; v.notes = text.slice(m[0].length); } else v.notes = text;
    } catch (e) {}
  }));
  return list;
}

async function cachedJSON(url) {
  const key = "gh:" + url;
  try { const c = sessionStorage.getItem(key); if (c) return JSON.parse(c); } catch (e) {}
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(res.status);
  const data = await res.json();
  try { sessionStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
  return data;
}
// Every version, newest first (GitHub first, then the hand-written list)
async function loadVersions(p) {
  if (p.releasesFolder) {
    try { const out = await folderVersions(p); if (out.length) return out; } catch (e) {}
  }
  const repo = releaseSource(p);
  if (repo) {
    try {
      const list = await cachedJSON(`https://api.github.com/repos/${repo}/releases?per_page=100`);
      // Several apps can share one releases repo: each keeps only tags starting with its tagPrefix
      const prefix = p.tagPrefix || "";
      const out = list
        .filter(r => !r.draft && r.tag_name.startsWith(prefix))
        .map(r => { const v = slimRelease(r); v.tag = v.tag.slice(prefix.length); return v; });
      if (out.length) return out;
    } catch (e) {}
  }
  return manualVersions(p);
}

function downloadLabel(files) {
  // Several files for one platform: show the file name so people can tell them apart
  const counts = {};
  files.forEach(f => counts[f.platform] = (counts[f.platform] || 0) + 1);
  return files.map(f => ({ ...f, title: f.platform && counts[f.platform] === 1 ? `Download for ${f.platform}` : `Download ${f.name}` }));
}
// The file that fits the visitor's device; else the only file, or the first when all share one platform
function pickForVisitor(files) {
  if (!files.length) return null;
  const os = visitorOS();
  const onePlatform = files.every(f => f.platform && f.platform === files[0].platform);
  return files.find(f => f.platform === os) || (files.length === 1 || onePlatform ? files[0] : null);
}
function downloadButton(f, accent) {
  const size = f.size ? ` <small>${esc(formatSize(f.size))}</small>` : "";
  const a = el("a", { class: `btn caps${accent ? " accent" : ""}`, href: f.url, rel: "noopener" }, `${ICONS.download}<span>${esc(f.title || "Download")}</span>${size}`);
  if (f.name) a.title = f.name;
  if (f.local) a.setAttribute("download", f.name || "");   // files on this site: save instead of opening
  return a;
}

/* ---------- Light markdown for release notes ---------- */
function mdLite(text) {
  const inline = (s) => esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  const out = []; let list = false;
  String(text).replace(/\r/g, "").split("\n").forEach(line => {
    const t = line.trim();
    const item = t.match(/^[-*+]\s+(.*)/);
    if (item) { if (!list) { out.push("<ul>"); list = true; } out.push(`<li>${inline(item[1])}</li>`); return; }
    if (list) { out.push("</ul>"); list = false; }
    if (!t) return;
    const h = t.match(/^#{1,6}\s+(.*)/);
    out.push(h ? `<p><strong>${inline(h[1])}</strong></p>` : `<p>${inline(t)}</p>`);
  });
  if (list) out.push("</ul>");
  return out.join("");
}

/* ---------- Social links ---------- */
function socialLinks() {
  const out = [];
  if (CONFIG.github) out.push({ key: "github", label: "GitHub", url: `https://github.com/${CONFIG.github}` });
  if (CONFIG.socials.linkedin) out.push({ key: "linkedin", label: "LinkedIn", url: CONFIG.socials.linkedin });
  if (CONFIG.socials.email) out.push({ key: "email", label: "Email", url: `mailto:${CONFIG.socials.email}` });
  return out;
}
