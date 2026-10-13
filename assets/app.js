const statusLabel = {
  watching: "观察中",
  graduated: "已毕业",
  archived: "归档",
};

const $ = (sel) => document.querySelector(sel);

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderCard(c) {
  const signals = (c.signals || [])
    .map(
      (s) =>
        `<li><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.label)}</a></li>`
    )
    .join("");
  const year = c.founded_year ? `${c.founded_year}` : "年份待核";
  return `
  <article class="card" data-region="${escapeHtml(c.region)}" data-sector="${escapeHtml(c.sector)}" data-status="${escapeHtml(c.status)}" data-text="${escapeHtml((c.name_zh + " " + c.name_en + " " + c.tagline + " " + c.sector).toLowerCase())}">
    <div class="card-top">
      <div class="names">
        <h2>${escapeHtml(c.name_zh)}</h2>
        <div class="en">${escapeHtml(c.name_en)}</div>
      </div>
      <span class="badge ${escapeHtml(c.status)}">${statusLabel[c.status] || c.status}</span>
    </div>
    <p class="tagline">${escapeHtml(c.tagline)}</p>
    <div class="meta">
      <span class="chip">${escapeHtml(year)} · ${escapeHtml(c.round)}</span>
      <span class="chip">${escapeHtml(c.region)}</span>
      <span class="chip">${escapeHtml(c.sector)}</span>
    </div>
    <p class="why"><strong>为何有潜力</strong> — ${escapeHtml(c.why_potential)}</p>
    <ul class="signals">${signals}</ul>
    <div class="card-foot">
      <span>收录 ${escapeHtml(c.listed_at)}</span>
      <a class="exhibit-link" href="${escapeHtml(c.website)}" target="_blank" rel="noopener noreferrer">访问产物</a>
    </div>
  </article>`;
}

function fillSelect(id, values) {
  const el = $(id);
  const sorted = [...values].sort((a, b) => a.localeCompare(b, "zh"));
  for (const v of sorted) {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    el.appendChild(opt);
  }
}

function applyFilters() {
  const q = ($("#q").value || "").trim().toLowerCase();
  const region = $("#region").value;
  const sector = $("#sector").value;
  const status = $("#status").value;
  let shown = 0;
  for (const card of document.querySelectorAll(".card")) {
    const okQ = !q || card.dataset.text.includes(q);
    const okR = !region || card.dataset.region === region;
    const okS = !sector || card.dataset.sector === sector;
    const okSt = !status || card.dataset.status === status;
    const show = okQ && okR && okS && okSt;
    card.hidden = !show;
    if (show) shown += 1;
  }
  const empty = $("#empty");
  if (empty) empty.hidden = shown > 0;
  $("#count-shown").textContent = String(shown);
}

async function main() {
  const res = await fetch("./data/companies.json", { cache: "no-store" });
  if (!res.ok) throw new Error("failed to load companies.json");
  const data = await res.json();
  const companies = data.companies || [];

  $("#count-total").textContent = String(companies.length);
  $("#updated-at").textContent = data.meta?.updated_at || "—";
  $("#disclaimer-text").textContent = data.meta?.disclaimer || "";

  const grid = $("#grid");
  if (!companies.length) {
    grid.innerHTML = `<div class="empty" id="empty">首批条目终审中。宁缺毋滥——通过门禁后才会出现在这里。</div>`;
  } else {
    grid.innerHTML =
      companies.map(renderCard).join("") +
      `<div class="empty" id="empty" hidden>没有匹配的公司。试试清空筛选。</div>`;
  }

  fillSelect("#region", new Set(companies.map((c) => c.region).filter(Boolean)));
  fillSelect("#sector", new Set(companies.map((c) => c.sector).filter(Boolean)));

  $("#q").addEventListener("input", applyFilters);
  $("#region").addEventListener("change", applyFilters);
  $("#sector").addEventListener("change", applyFilters);
  $("#status").addEventListener("change", applyFilters);
  applyFilters();
}

main().catch((err) => {
  console.error(err);
  $("#grid").innerHTML = `<div class="empty">数据加载失败。请检查 data/companies.json。</div>`;
});
