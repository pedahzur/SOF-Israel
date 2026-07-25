/* ═══════════════════════════════════════════════════════════
   SOF-APPENDIX · app.js
   Masthead stats, sticky TOC, dataset register (expandable rows,
   AND search + theme filters), lazy CSV previews, linkages,
   companion note, IO entrances. Vanilla JS, zero build.
   ═══════════════════════════════════════════════════════════ */
"use strict";
(() => {
  const R = window.RPT;
  if (!R) return;
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  /* Hebrew runs (e.g. שב״כ) wrapped in <span lang="he"> so the CSS
     italic guard (:lang(he)) applies; works on already-escaped HTML. */
  const escHe = s => esc(s).replace(/[֐-׿]+/g, m => `<span lang="he">${m}</span>`);
  /* textContent variant: appends text nodes + <span lang="he"> elements */
  function appendMixedLang(parent, text) {
    const re = /[֐-׿]+/g;
    let last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) parent.appendChild(document.createTextNode(text.slice(last, m.index)));
      const sp = document.createElement("span");
      sp.lang = "he";
      sp.textContent = m[0];
      parent.appendChild(sp);
      last = m.index + m[0].length;
    }
    if (last < text.length) parent.appendChild(document.createTextNode(text.slice(last)));
  }
  /* TOC/register label: strip extension; dual-format titles like
     "NSSC_Codebook.csv / .xlsx" render as "NSSC Codebook (CSV / XLSX)". */
  function tocLabel(title) {
    const dual = title.match(/^(.+?)\.([A-Za-z0-9]+)\s*\/\s*\.([A-Za-z0-9]+)$/);
    if (dual) return dual[1].replace(/_/g, " ") + " (" + dual[2].toUpperCase() + " / " + dual[3].toUpperCase() + ")";
    return title.replace(/_/g, " ").replace(/\.(csv|xlsx|pdf|docx|md)$/i, "");
  }
  const $ = sel => document.querySelector(sel);

  /* ── Masthead count-up stats ─────────────────────────────── */
  (function masthead() {
    const host = $("#mast-stats");
    if (!host) return;
    const nDatasets = R.datasets.length;
    /* Sum documented records over unique datasets only: format duplicates
       (dupOf, e.g. NSSC Complete.xlsx = NSSC CSV) counted once; narrative
       documents (countInTotal:false) excluded. */
    const nRecords = R.datasets.reduce((s, d) =>
      (d.n != null && !d.dupOf && d.countInTotal !== false) ? s + d.n : s, 0);
    const fmts = new Set();
    R.datasets.forEach(d => d.fmts.forEach(f => fmts.add(f)));
    const stats = [
      { to: nDatasets, k: "Catalogued datasets & documents", fmt: v => Math.round(v) },
      { to: nRecords, k: "Documented records across unique datasets · format variants counted once", fmt: v => Math.round(v).toLocaleString("en-US") },
      { to: 2026, k: "Coverage · 1920 through latest file", fmt: v => "1920–" + Math.round(v) },
      { to: fmts.size, k: "Formats · " + [...fmts].join(" · "), fmt: v => Math.round(v) }
    ];
    stats.forEach(s => {
      const cell = document.createElement("div");
      cell.className = "stat";
      cell.innerHTML = `<div class="v"></div><div class="k">${esc(s.k)}</div>`;
      host.appendChild(cell);
      const v = cell.querySelector(".v");
      if (REDUCED) v.textContent = s.fmt(s.to);
      else U.countUp(v, { to: s.to, dur: 1400, fmt: s.fmt });
    });
  })();

  /* ── IO entrances ────────────────────────────────────────── */
  const io = ("IntersectionObserver" in window && !REDUCED)
    ? new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }), { threshold: 0.08 })
    : null;
  function enter(node) {
    if (!io) { node.classList.add("in"); return; }
    node.classList.add("io-enter");
    io.observe(node);
  }

  /* ── Sticky TOC ──────────────────────────── */
  (function toc() {
    const nav = $("#toc");
    if (!nav) return;
    nav.innerHTML = '<p class="toc-h">Register</p>';
    R.themeOrder.forEach(t => {
      const theme = R.themes[t];
      const h = document.createElement("p");
      h.className = "toc-theme";
      h.textContent = theme.label;
      nav.appendChild(h);
      R.datasets.filter(d => d.theme === t).forEach(d => {
        const a = document.createElement("a");
        a.href = "#" + d.id;
        a.dataset.for = d.id;
        a.style.setProperty("--dot", theme.chip);
        appendMixedLang(a, tocLabel(d.title));
        nav.appendChild(a);
      });
    });
  })();

  /* ── Filter state (AND logic: text × theme) ──────────────── */
  const state = { q: "", theme: null };
  function applyFilter() {
    document.querySelectorAll("article.dataset").forEach(a => {
      const matchText = !state.q || a.textContent.toLowerCase().includes(state.q);
      const matchTheme = !state.theme || a.dataset.theme === state.theme;
      a.hidden = !(matchText && matchTheme);
    });
    /* hide empty theme groups */
    document.querySelectorAll(".theme-group").forEach(g => {
      const any = [...g.querySelectorAll("article.dataset")].some(a => !a.hidden);
      g.hidden = !any;
    });
  }

  /* ── Filter bar ──────────────────────────────────────────── */
  (function filters() {
    const bar = $("#filters");
    if (!bar) return;
    const input = document.createElement("input");
    input.type = "search";
    input.id = "search";
    input.placeholder = "Search the register…";
    input.setAttribute("aria-label", "Search datasets");
    input.addEventListener("input", () => { state.q = input.value.trim().toLowerCase(); applyFilter(); });
    bar.appendChild(input);
    R.themeOrder.forEach(t => {
      const theme = R.themes[t];
      const c = document.createElement("button");
      c.type = "button";
      c.className = "chip";
      c.dataset.theme = t;
      c.style.setProperty("--dot", theme.chip);
      c.setAttribute("aria-pressed", "false");
      c.textContent = theme.label;
      c.addEventListener("click", () => {
        const on = state.theme === t;
        state.theme = on ? null : t;
        bar.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", String(x === c && !on)));
        applyFilter();
      });
      bar.appendChild(c);
    });
  })();

  /* ── Lazy CSV preview (first 8 rows, on first expand) ────── */
  async function loadPreview(wrap, file) {
    wrap.innerHTML = "";
    const note = document.createElement("p");
    note.className = "preview-note";
    note.textContent = "Loading preview…";
    wrap.appendChild(note);
    let rows;
    try { rows = await SOFCsv.fetchRows(file); }
    catch (e) {
      note.remove();
      const err = document.createElement("p");
      err.className = "preview-err";
      err.textContent = "Preview unavailable — file could not be fetched" +
        (location.protocol === "file:" ? " over file://" : "") + ". Download instead.";
      wrap.appendChild(err);
      return;
    }
    const header = rows[0] || [];
    const dataRows = rows.slice(1).filter(r => r.some(c => (c || "").trim())).slice(0, 8);
    wrap.innerHTML = "";
    const scroll = document.createElement("div");
    scroll.className = "preview-scroll";
    const table = document.createElement("table");
    table.className = "dt";
    const thead = document.createElement("thead");
    const htr = document.createElement("tr");
    header.forEach(h => {
      if (!(h || "").trim()) return;
      const th = document.createElement("th");
      th.textContent = (h || "").trim();
      htr.appendChild(th);
    });
    thead.appendChild(htr);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    const nCols = htr.children.length;
    dataRows.forEach(r => {
      const tr = document.createElement("tr");
      let ci = 0;
      r.forEach(cell => {
        if (ci >= nCols) return;
        if (!((header[ci] || "").trim())) { ci++; return; }
        const td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
        ci++;
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    scroll.appendChild(table);
    wrap.appendChild(scroll);
    const cap = document.createElement("p");
    cap.className = "preview-note";
    cap.textContent = `First ${dataRows.length} rows · ${file} · UTF-8 (may contain Hebrew)`;
    wrap.appendChild(cap);
  }

  /* ── Dataset register ────────────────────────────────────── */
  (function register() {
    const container = $("#datasets");
    if (!container) return;
    R.themeOrder.forEach(t => {
      const theme = R.themes[t];
      const list = R.datasets.filter(d => d.theme === t);
      if (!list.length) return;
      const group = document.createElement("div");
      group.className = "theme-group";
      group.style.setProperty("--dot", theme.chip);
      group.innerHTML =
        `<h2 style="--dot:${theme.chip}"><span class="t-dot"></span>${esc(theme.label)}` +
        ` <span class="t-count">${list.length} ${list.length === 1 ? "entry" : "entries"}</span></h2>`;
      enter(group);

      list.forEach(d => {
        const art = document.createElement("article");
        art.className = "dataset";
        art.id = d.id;
        art.dataset.theme = d.theme;
        art.style.setProperty("--dot", theme.chip);

        /* head (button row) */
        const head = document.createElement("button");
        head.type = "button";
        head.className = "ds-head";
        head.setAttribute("aria-expanded", "false");
        head.setAttribute("aria-controls", d.id + "-body");
        const rec = d.n != null
          ? `<span class="rec">${d.n.toLocaleString("en-US")} records</span>`
          : `<span class="rec unknown">download to inspect</span>`;
        head.innerHTML =
          `<span class="ds-dot"></span>` +
          `<span class="ds-name">${escHe(d.title)}</span>` +
          `<span class="ds-meta">${rec} · ${esc(d.period)} · ${esc(d.size)}` +
          d.fmts.map(f => `<span class="fmt-badge">${esc(f)}</span>`).join("") +
          `<span class="ds-chev" aria-hidden="true">▸</span></span>`;

        /* body */
        const body = document.createElement("div");
        body.className = "ds-body";
        body.id = d.id + "-body";
        body.setAttribute("role", "region");
        body.setAttribute("aria-label", d.title);
        let html = `<h4>Summary</h4><p>${escHe(d.summary)}</p>`;
        html += `<h4>Methodology</h4><p>${esc(d.methodology)}</p>`;
        html += `<h4>Variables</h4><div class="vars">${esc(d.variables)}</div>`;
        html += `<h4>Suggested Statistical Analyses</h4><p>${esc(d.analyses)}</p>`;
        if (d.questions && d.questions.length) {
          html += `<h4>Example Research Questions</h4><ul>` +
            d.questions.map(q => `<li>${esc(q)}</li>`).join("") + `</ul>`;
        }
        html += `<h4>Code Snippet</h4><pre><span class="lang-tag">${esc(d.lang || "python")}</span>${esc(d.snippet)}</pre>`;
        body.innerHTML = html;

        /* actions: downloads + preview */
        const actions = document.createElement("div");
        actions.className = "ds-actions";
        d.downloads.forEach(dl => {
          const a = document.createElement("a");
          a.className = "dl-btn" + (dl.external ? " ghost" : "");
          a.href = dl.href;
          if (dl.external) { a.target = "_blank"; a.rel = "noopener"; }
          else a.setAttribute("download", dl.file);
          a.innerHTML = esc(dl.label) + (dl.size ? ` <span class="sz">${esc(dl.size)}</span>` : "");
          actions.appendChild(a);
        });
        body.appendChild(actions);

        let previewWrap = null;
        if (d.preview) {
          previewWrap = document.createElement("div");
          previewWrap.className = "preview-wrap";
          body.appendChild(previewWrap);
        }

        head.addEventListener("click", () => {
          const open = art.classList.toggle("open");
          head.setAttribute("aria-expanded", String(open));
          if (open && previewWrap && !previewWrap.dataset.loaded) {
            previewWrap.dataset.loaded = "1";
            loadPreview(previewWrap, d.preview);
          }
        });

        art.appendChild(head);
        art.appendChild(body);
        group.appendChild(art);
      });
      container.appendChild(group);
    });
  })();

  /* ── Linkages register ───────────────────────────────────── */
  (function linkages() {
    const host = $("#linkage-list");
    if (!host) return;
    R.linkages.forEach(lk => {
      const row = document.createElement("div");
      row.className = "link-row";
      const ca = R.themes[lk.a].chip, cb = R.themes[lk.b].chip;
      row.innerHTML =
        `<p class="lk-title"><span class="lk-dot" style="background:${ca}"></span>` +
        `<span class="lk-dot" style="background:${cb}"></span> ${esc(lk.title)}</p>` +
        `<p>${esc(lk.text)}</p>`;
      host.appendChild(row);
    });
  })();

  /* ── Companion note (Ch1 interactive HTML report) ────────── */
  (function companion() {
    const host = $("#companion-note");
    if (!host) return;
    const c = R.companion;
    const box = document.createElement("div");
    box.className = "note-box";
    box.innerHTML =
      `<p><b>Companion report.</b> ${esc(c.text)}</p>` +
      `<p><a href="${esc(c.href)}">${esc(c.title)}</a> ` +
      `<span class="muted">(HTML document · ${esc(c.size)} · opens or downloads as a standalone report)</span></p>`;
    host.appendChild(box);
  })();

  /* ── TOC active-state via IO ─────────────────────────────── */
  (function tocSpy() {
    if (!("IntersectionObserver" in window)) return;
    const links = new Map();
    document.querySelectorAll("#toc a[data-for]").forEach(a => links.set(a.dataset.for, a));
    const spy = new IntersectionObserver(es => {
      es.forEach(e => {
        const a = links.get(e.target.id);
        if (!a) return;
        if (e.isIntersecting) {
          links.forEach(x => x.classList.remove("active"));
          a.classList.add("active");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
    document.querySelectorAll("article.dataset").forEach(a => spy.observe(a));
  })();
})();
