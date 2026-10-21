// SVT Learn: client-side search over a links-only index (word -> [episode, second]).
const PLAY = "https://www.svtplay.se";
const NEAR = 20; // seconds: words of a multi-word search must be said this close together
const shards = new Map();
let episodes = [];

const $ = (id) => document.getElementById(id);
const shardName = (w) => [...w.slice(0, 2)].map((c) => c.codePointAt(0).toString(16)).join("");
const fmt = (s) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
};
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

async function shard(word) {
  const name = shardName(word);
  if (!shards.has(name)) {
    shards.set(name, fetch(`data/${name}.json`).then((r) => (r.ok ? r.json() : {})).catch(() => ({})));
  }
  return shards.get(name);
}

// Hits for one term: exact word, or every word starting with it.
async function hitsFor(term, prefix) {
  const words = await shard(term);
  if (!prefix || term.length < 2) return { matched: words[term] ? [term] : [], hits: words[term] || [] };
  const matched = Object.keys(words).filter((w) => w.startsWith(term)).sort((a, b) => words[b].length - words[a].length);
  return { matched, hits: matched.flatMap((w) => words[w]) };
}

async function search() {
  const terms = ($("q").value.toLowerCase().match(/[\p{L}]{2,}/gu) || []);
  const prog = $("prog").value;
  const prefix = $("prefix").checked;
  const params = new URLSearchParams();
  if ($("q").value) params.set("q", $("q").value);
  if (prog) params.set("p", prog);
  if (prefix) params.set("prefix", "1");
  history.replaceState(null, "", params.toString() ? `?${params}` : location.pathname);

  $("words").innerHTML = "";
  if (!terms.length) {
    $("results").innerHTML = "";
    $("status").textContent = `${episodes.length} episodes indexed. Type a Swedish word to start.`;
    return;
  }
  const parts = await Promise.all(terms.map((t) => hitsFor(t, prefix)));
  if (prefix && terms.length === 1 && parts[0].matched.length > 1) {
    $("words").innerHTML = parts[0].matched.slice(0, 30)
      .map((w) => `<button type="button" data-w="${esc(w)}">${esc(w)}</button>`).join("");
  }

  // Start from the first term's hits; keep those where every other term is said nearby.
  let found = parts[0].hits.map(([ep, t]) => [ep, t]);
  for (const other of parts.slice(1)) {
    const byEp = new Map();
    for (const [ep, t] of other.hits) (byEp.get(ep) || byEp.set(ep, []).get(ep)).push(t);
    found = found.filter(([ep, t]) => (byEp.get(ep) || []).some((u) => Math.abs(u - t) <= NEAR));
  }
  const grouped = new Map();
  for (const [ep, t] of found) {
    const e = episodes[ep];
    if (!e || (prog && e.p !== prog)) continue;
    (grouped.get(ep) || grouped.set(ep, new Set()).get(ep)).add(t);
  }
  const eps = [...grouped.keys()].sort((a, b) => a - b); // newest episodes first
  $("status").textContent = eps.length
    ? `${eps.length} episode${eps.length > 1 ? "s" : ""} with “${terms.join(" ")}”`
    : `No clips found for “${terms.join(" ")}”.` + (prefix ? "" : " Try “word starts with”.");
  $("results").innerHTML = eps.map((ep) => {
    const e = episodes[ep];
    const times = [...grouped.get(ep)].sort((a, b) => a - b).slice(0, 12)
      .map((t) => `<a href="${PLAY}${esc(e.u)}?position=${Math.max(0, t - 2)}" target="_blank" rel="noopener">▶ ${fmt(t)}</a>`)
      .join("");
    const until = e.to && e.to < "2050" ?`<span class="until">on SVT Play until ${esc(e.to)}</span>` : "";
    return `<div class="ep"><div class="prog">${esc(e.p)}</div><div class="name">${esc(e.n)}${until}</div><div class="times">${times}</div></div>`;
  }).join("");
}

let timer;
function schedule() { clearTimeout(timer); timer = setTimeout(search, 200); }

async function init() {
  const meta = await fetch("data/episodes.json").then((r) => r.json());
  episodes = meta.episodes;
  $("built").textContent = `Updated ${meta.built}.`;
  const progs = [...new Set(episodes.map((e) => e.p))].sort((a, b) => a.localeCompare(b, "sv"));
  $("prog").insertAdjacentHTML("beforeend", progs.map((p) => `<option>${esc(p)}</option>`).join(""));
  const params = new URLSearchParams(location.search);
  $("q").value = params.get("q") || "";
  $("prog").value = params.get("p") || "";
  $("prefix").checked = params.get("prefix") === "1";
  $("q").addEventListener("input", schedule);
  $("prog").addEventListener("change", search);
  $("prefix").addEventListener("change", search);
  $("f").addEventListener("submit", (ev) => { ev.preventDefault(); search(); });
  $("words").addEventListener("click", (ev) => {
    const w = ev.target.dataset?.w;
    if (w) { $("q").value = w; $("prefix").checked = false; search(); }
  });
  search();
}

init().catch(() => { $("status").textContent = "Couldn't load the index."; });
