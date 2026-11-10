/* Home page */
initTheme($("#themeBtn"));

/* ---------- Profile ---------- */
document.title = `${CONFIG.name} — Portfolio`;
$("#logoTop").textContent = CONFIG.shortName || CONFIG.name;
$("#status").textContent = CONFIG.status;
const STICKER_ICONS = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9zM9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  ICONS.versions
];
let boldDone = false;
let headHTML = esc(CONFIG.headline).replace(/\*(.+?)\*/g, (m, word) => {
  const third = CONFIG.stickers && CONFIG.stickers[2];
  if (boldDone || !third) return `<b>${word}</b>`;
  boldDone = true;
  return `<span class="b-wrap"><b>${word}</b><span class="sticker s3" aria-hidden="true">${STICKER_ICONS[2]}${esc(third)}</span></span>`;
});
let stickered = false;
headHTML = headHTML.replace(/~(.+?)~/g, (m, word) => {
  let stick = "";
  if (!stickered && CONFIG.stickers && CONFIG.stickers.length) {
    stick = CONFIG.stickers.slice(0, 2).map((t, i) => `<span class="sticker s${i + 1}" aria-hidden="true">${STICKER_ICONS[i]}${esc(t)}</span>`).join("");
    stickered = true;
  }
  return `<span class="hl-wrap"><span class="hl">${word}</span>${stick}</span>`;
});
$("#headline").innerHTML = headHTML;
$("#lede").textContent = CONFIG.lede;
$("#name").textContent = CONFIG.name;
$("#place").textContent = CONFIG.location;
$("#bio").textContent = CONFIG.bio;
$("#stackNote").textContent = CONFIG.stackNote;
$("#servicesNote").textContent = CONFIG.servicesNote;
$("#contactNote").textContent = CONFIG.contactNote;
$("#copy").textContent = `© ${new Date().getFullYear()} ${CONFIG.name}`;
if (!CONFIG.status) $("#status").remove();
if (!CONFIG.location) $("#place").remove();

CONFIG.skills.forEach(s => $("#skills").appendChild(el("li", { class: "pill caps" }, esc(s))));
CONFIG.stats.slice(0, 3).forEach(s => {
  const d = el("div");
  d.append(el("dt", { class: "caps" }, esc(s.label)), el("dd", { class: "caps" }, esc(s.value)));
  $("#stats").appendChild(d);
});
CONFIG.stack.forEach(s => $("#stack").appendChild(el("li", {}, esc(s))));
CONFIG.services.forEach(s => {
  const li = el("li");
  li.append(el("h3", { class: "caps" }, esc(s.title)), el("p", {}, esc(s.text)));
  $("#servicesList").appendChild(li);
});
fillAvatars();

const socials = socialLinks();
socials.forEach(s => {
  const a = el("a", { class: "icon-btn", href: s.url, "aria-label": s.label, rel: "noopener" }, ICONS[s.key]);
  if (!s.url.startsWith("mailto:")) a.target = "_blank";
  $("#heroSocials").appendChild(a);
});
if (CONFIG.socials.email) {
  $("#contactRow").appendChild(el("a", { class: "btn accent big caps", href: `mailto:${CONFIG.socials.email}` }, `${ICONS.email}<span>${esc(CONFIG.socials.email)}</span>`));
}
socials.filter(s => s.key !== "email").forEach(s => {
  $("#contactRow").appendChild(el("a", { class: "btn big caps", href: s.url, target: "_blank", rel: "noopener" }, `${ICONS[s.key]}<span>${s.label}</span>`));
});

/* ---------- Active nav link ----------
   One underline slides between links. While a menu click is scrolling the page,
   updates pause, so the underline doesn't flick across every section on the way. */
const linksBox = document.querySelector(".links");
const navLinks = [...linksBox.querySelectorAll("a")];
const ind = el("span", { class: "nav-ind", "aria-hidden": "true" });
linksBox.appendChild(ind);
let activeId = null, lockUntil = 0, lockTimer = null;

function moveIndicator(a) {
  if (!a || !a.offsetWidth) return;
  ind.style.width = a.offsetWidth + "px";
  ind.style.transform = `translateX(${a.offsetLeft}px)`;
  ind.style.opacity = "1";
}
function setCurrent(id) {
  if (id === activeId) return;
  activeId = id;
  navLinks.forEach(a => {
    const on = a.getAttribute("href") === "#" + id;
    a.setAttribute("aria-current", String(on));
    if (on) moveIndicator(a);
  });
}
function sectionAtScroll() {
  const y = window.scrollY + 120;
  let best = null;
  navLinks.forEach(a => {
    const sec = document.querySelector(a.getAttribute("href"));
    if (sec && sec.offsetTop <= y && (!best || sec.offsetTop > best.offsetTop)) best = sec;
  });
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
    best = document.querySelector(navLinks[navLinks.length - 1].getAttribute("href"));
  }
  return best ? best.id : navLinks[0].getAttribute("href").slice(1);
}
let ticking = false;
window.addEventListener("scroll", () => {
  if (Date.now() < lockUntil) {
    clearTimeout(lockTimer);
    lockTimer = setTimeout(() => { lockUntil = 0; setCurrent(sectionAtScroll()); }, 160);
    return;
  }
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { ticking = false; setCurrent(sectionAtScroll()); });
}, { passive: true });
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", () => {
  const id = a.getAttribute("href").slice(1);
  if (!id || !navLinks.some(n => n.getAttribute("href") === "#" + id)) return;
  lockUntil = Date.now() + 1500;
  setCurrent(id);
}));
window.addEventListener("resize", () => moveIndicator(navLinks.find(a => a.getAttribute("aria-current") === "true")));
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => moveIndicator(navLinks.find(a => a.getAttribute("aria-current") === "true")));
setCurrent(sectionAtScroll());

/* ---------- Project cards ---------- */
const hasVersions = (p) => !!(releaseSource(p) || (p.versions && p.versions.length));

function renderActions(p, box, latest) {
  box.replaceChildren();
  if (latest && latest.files.length) {
    const pick = pickForVisitor(downloadLabel(latest.files));
    if (pick) box.appendChild(downloadButton({ ...pick, title: pick.platform ? `Download for ${pick.platform}` : "Download" }, true));
  }
  if (p.website) box.appendChild(el("a", { class: "btn accent caps", href: p.website, target: "_blank", rel: "noopener" }, `<span>Open app</span>${ICONS.arrow}`));
  if (hasVersions(p)) box.appendChild(el("a", { class: "btn caps", href: pageOf(p) + "#versions" }, `${ICONS.versions}<span>All versions</span>`));
  if (p.repo) box.appendChild(el("a", { class: "btn caps", href: `https://github.com/${p.repo}`, target: "_blank", rel: "noopener" }, `${ICONS.code}<span>Source code</span>`));
}

const restingLabel = (p) => esc(p.note || p.category || "");
const cards = CONFIG.projects.map(p => {
  const card = el("article", { class: "card" });
  const top = el("div", { class: "card-top" });
  const titles = el("div");
  const ver = el("p", { class: "ver caps" }, restingLabel(p));
  titles.append(el("h3", {}, `<a href="${pageOf(p)}">${esc(p.name)}</a>`), ver);
  top.append(projectIcon(p), titles);

  const desc = p.description ? el("p", { class: "desc" }, esc(p.description)) : el("div", { class: "desc-gap" });
  const tags = el("ul", { class: "tags", "aria-label": "Platforms and tools" });
  [...(p.platforms || []), ...(p.tags || [])].forEach(t => tags.appendChild(el("li", {}, esc(t))));
  const actions = el("div", { class: "actions" });
  renderActions(p, actions, null);
  card.append(top, desc, tags, actions);

  if (hasVersions(p)) {
    if (releaseSource(p)) ver.textContent = "Checking latest version";
    loadVersions(p).then(list => {
      const latest = list.find(v => !v.prerelease) || list[0];
      ver.innerHTML = latest ? `Version ${esc(cleanTag(latest.tag))}${latest.date ? " · " + esc(formatDate(latest.date)) : ""}` : restingLabel(p);
      renderActions(p, actions, latest);
    });
  }
  return { p, card };
});

/* ---------- Filters & search ---------- */
const state = { platform: "All", q: "" };
const FILTERS = ["Mobile", "Web", "Desktop"];        // the filter buttons, in this order
const catsOf = p => p.platforms || [];
const filterBox = $("#filters");
["All", ...FILTERS].forEach(name => {
  const b = el("button", { class: "chip caps", type: "button", "aria-pressed": String(name === "All") }, esc(name));
  b.addEventListener("click", () => {
    state.platform = name;
    filterBox.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", String(c === b)));
    render();
  });
  filterBox.appendChild(b);
});

function render() {
  const grid = $("#grid");
  grid.replaceChildren();
  const q = state.q.toLowerCase();
  const shown = cards.filter(({ p }) => {
    const okPlat = state.platform === "All" || catsOf(p).includes(state.platform);
    const hay = [p.name, p.description, ...(p.tags || []), ...catsOf(p)].join(" ").toLowerCase();
    return okPlat && (!q || hay.includes(q));
  });
  shown.forEach(({ card }) => grid.appendChild(card));
  $("#empty").hidden = shown.length > 0;
  if (!shown.length) {
    $("#emptyText").textContent = state.q
      ? `No projects match "${state.q}"${state.platform !== "All" ? " in " + state.platform : ""}.`
      : `No ${state.platform} projects yet.`;
  }
}
$("#q").addEventListener("input", e => { state.q = e.target.value.trim(); render(); });
$("#clearBtn").addEventListener("click", () => {
  state.q = ""; state.platform = "All"; $("#q").value = "";
  filterBox.querySelectorAll(".chip").forEach((c, i) => c.setAttribute("aria-pressed", String(i === 0)));
  render();
});
render();
