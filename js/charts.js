/* ═══════════════════════════════════════════════════════════
   SOF-APPENDIX · charts.js
   Coverage constellation (hero) + three real-data charts computed
   client-side from repo CSVs. Each chart is an independent IIFE
   with its own host div — one failure does not cascade.
   Palette discipline: ink scale + electric-blue family inside
   charts; muted theme chips only in the constellation lanes.
   ═══════════════════════════════════════════════════════════ */
"use strict";

/* ── Shared CSV plumbing ─────────────────────────────────── */
window.SOFCsv = (() => {
  function parse(text) {
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    const rows = [];
    let row = [], field = "", inQ = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQ) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQ = false;
        } else field += c;
      } else {
        if (c === '"') inQ = true;
        else if (c === ",") { row.push(field); field = ""; }
        else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
        else if (c !== "\r") field += c;
      }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
  }
  async function fetchRows(file) {
    const res = await fetch("./" + encodeURIComponent(file));
    if (!res.ok) throw new Error("HTTP " + res.status);
    return parse(await res.text());
  }
  /* header index lookup, whitespace/case tolerant */
  function col(header, re) {
    for (let i = 0; i < header.length; i++) {
      if (re.test((header[i] || "").trim())) return i;
    }
    return -1;
  }
  return { parse, fetchRows, col };
})();

/* ── Shared SVG helpers ──────────────────────────────────── */
const SVGNS = "http://www.w3.org/2000/svg";
function el(tag, attrs, parent) {
  const n = document.createElementNS(SVGNS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
}
const MONO = "Menlo, Consolas, monospace";
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const AXIS_INK = "#051c2c", GRID = "#e8e1d2", PAPER = "#f4eee6";
const INK_MD = "#42566a", INK_LO = "#8595a6", BLUE = "#2251ff", BLUE_HI = "#1233b8";
const EASE = "cubic-bezier(0.25,1,0.5,1)";

function degrade(body, file, note) {
  const d = document.createElement("p");
  d.className = "degrade-note";
  d.textContent = "Live chart unavailable — the data file could not be fetched" +
    (location.protocol === "file:" ? " over file://" : "") + ". " +
    (note || "") + " Source file: " + file + " (download it from the catalog below).";
  body.appendChild(d);
}

/* IO-triggered one-shot build; reduced-motion builds immediately */
function entrance(target, build) {
  if (REDUCED || !("IntersectionObserver" in window)) { build(); return; }
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { io.disconnect(); build(); } });
  }, { threshold: 0.12 });
  io.observe(target);
}

/* animate a set of nodes from scaleX(0) to scaleX(1) */
function growIn(nodes) {
  if (REDUCED) return;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    nodes.forEach(n => { n.style.transform = "scaleX(1)"; });
  }));
}

/* ═══════════════════════════════════════════════════════════
   HERO · coverage constellation, 1920 → 2026
   One lane per theme; dataset spans as chips; linkage arcs for
   the documented cross-dataset joins. Fully data-driven from
   window.RPT (spans + linkages), no hard-coded pixels.
   ═══════════════════════════════════════════════════════════ */
(() => {
  const host = document.getElementById("constellation-chart");
  if (!host || !window.RPT) return;
  const R = window.RPT;
  const body = U.frame(host, {
    title: "One archive, 1920–2026",
    sub: "TEMPORAL COVERAGE BY THEME LANE · EACH MARK = ONE DATASET SPAN · DASHED ARCS = DOCUMENTED CROSS-DATASET JOINS · CLICK A SPAN TO OPEN ITS REGISTER ENTRY",
    src: "SOF-APPENDIX registry (this repository), spans as catalogued"
  });

  const Y0 = 1920, Y1 = 2026;
  const W = 1180, mL = 178, mR = 24, mT = 30, mB = 46;
  const lanes = R.themeOrder;
  const laneH = 54, laneGap = 16;
  const H = mT + lanes.length * (laneH + laneGap) + mB;
  const x = yr => mL + (yr - Y0) / (Y1 - Y0) * (W - mL - mR);
  const laneY = i => mT + i * (laneH + laneGap);

  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img",
    "aria-label": "Coverage constellation: dataset time spans per theme lane, 1920 to 2026" }, body);

  /* axis */
  const axisY = mT + lanes.length * (laneH + laneGap) + 6;
  el("line", { x1: mL, y1: axisY, x2: W - mR, y2: axisY, stroke: AXIS_INK, "stroke-width": 1 }, svg);
  for (let yr = 1920; yr <= 2020; yr += 20) {
    el("line", { x1: x(yr), y1: axisY, x2: x(yr), y2: axisY + 5, stroke: AXIS_INK, "stroke-width": 1 }, svg);
    const t = el("text", { x: x(yr), y: axisY + 20, "text-anchor": "middle",
      "font-size": 10, fill: INK_LO, "font-family": MONO }, svg);
    t.textContent = yr;
  }
  const tNow = el("text", { x: x(2026), y: axisY + 20, "text-anchor": "end",
    "font-size": 10, fill: INK_MD, "font-family": MONO }, svg);
  tNow.textContent = "2026";

  /* lanes + spans */
  const spanNodes = [];
  lanes.forEach((th, li) => {
    const theme = R.themes[th];
    const cy = laneY(li);
    /* lane chip + label */
    el("circle", { cx: mL - 14, cy: cy + laneH / 2, r: 4, fill: theme.chip }, svg);
    const lab = el("text", { x: mL - 26, y: cy + laneH / 2 + 3, "text-anchor": "end",
      "font-size": 9.5, fill: INK_MD, "font-family": MONO, "letter-spacing": ".1em" }, svg);
    lab.textContent = theme.label.toUpperCase();
    /* lane hairline */
    el("line", { x1: mL, y1: cy + laneH, x2: W - mR, y2: cy + laneH, stroke: GRID, "stroke-width": 1 }, svg);

    /* assign sub-rows greedily to avoid x-overlap */
    const ds = R.datasets.filter(d => d.theme === th && d.span);
    const rowsEnd = [];
    ds.forEach(d => {
      let r = rowsEnd.findIndex(end => d.span[0] > end + 1.5);
      if (r === -1) { rowsEnd.push(-Infinity); r = rowsEnd.length - 1; }
      rowsEnd[r] = d.span[1];
      d._row = r;
    });
    const nRows = Math.max(1, rowsEnd.length);
    ds.forEach(d => {
      const rowH = Math.min(11, (laneH - 8) / nRows - 3);
      const yy = cy + laneH - 5 - (d._row + 1) * (rowH + 3);
      const x1 = x(Math.max(Y0, d.span[0])), x2 = x(Math.min(Y1, d.span[1]));
      let node;
      if (d.span[0] === d.span[1] || x2 - x1 < 7) {
        /* single-year → diamond marker */
        const cx = (x1 + x2) / 2, r = Math.max(4.5, rowH / 2 + 1);
        node = el("path", {
          d: `M ${cx} ${yy + rowH / 2 - r} L ${cx + r} ${yy + rowH / 2} L ${cx} ${yy + rowH / 2 + r} L ${cx - r} ${yy + rowH / 2} Z`,
          fill: theme.chip, stroke: PAPER, "stroke-width": 1,
          cursor: "pointer", "data-drill-keep": ""
        }, svg);
      } else {
        node = el("rect", {
          x: x1, y: yy, width: x2 - x1, height: rowH, rx: Math.min(3, rowH / 2),
          fill: theme.chip, "fill-opacity": 0.88, cursor: "pointer", "data-drill-keep": ""
        }, svg);
        if (!REDUCED) {
          node.style.transformOrigin = `${x1}px ${yy}px`;
          node.style.transform = "scaleX(0)";
          node.style.transition = `transform .8s ${EASE} ${spanNodes.length * 50}ms`;
        }
      }
      const tipText = `${d.title} · ${d.period}`;
      const tEl = el("title", {}, node); tEl.textContent = tipText;
      node.addEventListener("mouseenter", e => U.showTip(tipText, e.clientX, e.clientY));
      node.addEventListener("mousemove", e => U.showTip(tipText, e.clientX, e.clientY));
      node.addEventListener("mouseleave", U.hideTip);
      node.addEventListener("click", () => {
        const tgt = document.getElementById(d.id);
        if (tgt) tgt.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
      });
      spanNodes.push(node);
    });
  });

  /* linkage arcs between lanes at anchor years */
  R.linkages.forEach(lk => {
    const ia = lanes.indexOf(lk.a), ib = lanes.indexOf(lk.b);
    if (ia < 0 || ib < 0) return;
    const ya = laneY(ia) + laneH / 2, yb = laneY(ib) + laneH / 2;
    const xx = x(lk.anchor);
    const midY = (ya + yb) / 2, bow = 26;
    const p = el("path", {
      d: `M ${xx} ${ya} C ${xx + bow} ${midY - 18}, ${xx + bow} ${midY + 18}, ${xx} ${yb}`,
      fill: "none", stroke: BLUE, "stroke-width": 1.2, "stroke-dasharray": "4 4",
      "stroke-opacity": 0.75, cursor: "pointer", "data-drill-keep": ""
    }, svg);
    el("circle", { cx: xx, cy: ya, r: 3, fill: BLUE }, svg);
    el("circle", { cx: xx, cy: yb, r: 3, fill: BLUE }, svg);
    const lt = el("text", { x: xx + bow + 6, y: midY + 3, "font-size": 9,
      fill: BLUE_HI, "font-family": MONO, "letter-spacing": ".06em",
      "paint-order": "stroke", stroke: PAPER, "stroke-width": 4 }, svg);
    lt.textContent = lk.title.toUpperCase();
    p.addEventListener("click", e => U.showDrill({
      title: "Cross-dataset join", value: lk.title,
      sub: lk.text, source: "SOF-APPENDIX registry · linkage documented in archive notes",
      x: e.clientX, y: e.clientY
    }));
  });

  entrance(body, () => growIn(spanNodes));
})();

/* ═══════════════════════════════════════════════════════════
   CHART A · Units established per decade
   File: Units_March_20262.csv · column "Year Established"
   ═══════════════════════════════════════════════════════════ */
(() => {
  const host = document.getElementById("units-decades-chart");
  if (!host) return;
  const FILE = "Units_March_20262.csv";
  const body = U.frame(host, {
    title: "Unit creation crested in the late twentieth century",
    sub: "UNITS ESTABLISHED PER DECADE · COUNT OF ROWS WITH A PARSEABLE YEAR ESTABLISHED · CLICK A BAR FOR BASIS",
    src: "SOF-APPENDIX · " + FILE + " (fetched and aggregated in-browser)"
  });
  entrance(body, async () => {
    let rows;
    try { rows = await SOFCsv.fetchRows(FILE); }
    catch (e) { degrade(body, FILE); return; }
    const header = rows[0] || [];
    const ci = SOFCsv.col(header, /^year\s+established$/i);
    if (ci < 0) { degrade(body, FILE, "Column “Year Established” not found."); return; }
    const buckets = new Map();
    let undated = 0, total = 0;
    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].some(c => (c || "").trim())) continue;
      const v = (rows[i][ci] || "").trim();
      const m = v.match(/(19|20)\d{2}/);
      if (!m) { undated++; continue; }
      const y = +m[0];
      if (y < 1900 || y > 2030) { undated++; continue; }
      const dec = Math.floor(y / 10) * 10;
      buckets.set(dec, (buckets.get(dec) || 0) + 1);
      total++;
    }
    const decs = [];
    for (let d = 1920; d <= 2020; d += 10) decs.push(d);
    const maxV = Math.max(1, ...decs.map(d => buckets.get(d) || 0));

    const W = 880, H = 320, mL = 46, mR = 12, mT = 26, mB = 44;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, style: "width:100%;height:auto;display:block",
      role: "img", "aria-label": "Bar chart: units established per decade, 1920s to 2020s" }, body);
    const bw = (W - mL - mR) / decs.length;
    const y = v => mT + (1 - v / maxV) * (H - mT - mB);

    for (let g = 0; g <= 4; g++) {
      const gv = Math.round(maxV * g / 4);
      el("line", { x1: mL, y1: y(gv), x2: W - mR, y2: y(gv), stroke: g ? GRID : AXIS_INK, "stroke-width": g ? 1 : 1.5 }, svg);
      const t = el("text", { x: mL - 8, y: y(gv) + 3, "text-anchor": "end", "font-size": 9.5, fill: INK_LO, "font-family": MONO }, svg);
      t.textContent = gv;
    }
    const bars = [];
    decs.forEach((d, i) => {
      const v = buckets.get(d) || 0;
      const bx = mL + i * bw + bw * 0.16, bwid = bw * 0.68;
      const fullY = y(v), fullH = Math.max(1, y(0) - y(v));
      const bar = el("rect", {
        x: bx, y: (REDUCED || !v) ? fullY : y(0), width: bwid,
        height: (REDUCED || !v) ? fullH : 1,
        fill: BLUE, "fill-opacity": v ? 0.9 : 0.12, cursor: v ? "pointer" : "default",
        "data-drill-keep": ""
      }, svg);
      if (!REDUCED && v) {
        bar.style.transition = `y .7s ${EASE} ${i * 60}ms, height .7s ${EASE} ${i * 60}ms`;
        bars.push({ bar, fullY, fullH });
      }
      const vt = el("text", { x: bx + bwid / 2, y: fullY - 6, "text-anchor": "middle",
        "font-size": 10, "font-weight": 700, fill: v ? AXIS_INK : INK_LO, "font-family": MONO,
        "paint-order": "stroke", stroke: PAPER, "stroke-width": 3 }, svg);
      vt.textContent = v || "·";
      const dt = el("text", { x: mL + i * bw + bw / 2, y: H - mB + 18, "text-anchor": "middle",
        "font-size": 9.5, fill: INK_MD, "font-family": MONO }, svg);
      dt.textContent = d + "s";
      if (v) bar.addEventListener("click", e => U.showDrill({
        title: "Units established · " + d + "s",
        value: v,
        sub: `Rows in ${FILE} whose “Year Established” falls in ${d}–${d + 9}. Basis: ${total} dated rows parsed in-browser; ${undated} rows undated or unparseable (excluded).`,
        source: FILE + " · column “Year Established” · as catalogued March 2026",
        x: e.clientX, y: e.clientY
      }));
    });
    if (bars.length) requestAnimationFrame(() => requestAnimationFrame(() => {
      bars.forEach(({ bar, fullY, fullH }) => { bar.setAttribute("y", fullY); bar.setAttribute("height", fullH); });
    }));
    const note = el("text", { x: mL, y: H - 6, "font-size": 9, fill: INK_LO, "font-family": MONO }, svg);
    note.textContent = `${total} dated rows · ${undated} undated rows excluded`;
  });
})();

/* ═══════════════════════════════════════════════════════════
   CHART B · Reprisal operations per year
   File: reprisals.csv · column "Date" (fallback "Date - Translated")
   ═══════════════════════════════════════════════════════════ */
(() => {
  const host = document.getElementById("reprisals-year-chart");
  if (!host) return;
  const FILE = "reprisals.csv";
  const body = U.frame(host, {
    title: "Reprisal operations per year, 1952–1964",
    sub: "OPERATION EVENTS PER YEAR · YEAR PARSED FROM MIXED-FORMAT DATE COLUMNS · CLICK A BAR FOR BASIS",
    src: "SOF-APPENDIX · " + FILE + " (fetched and aggregated in-browser)"
  });
  function yearOf(row, cDate, cTr) {
    const blob = ((row[cTr] || "") + " " + (row[cDate] || "")).trim();
    let m = blob.match(/(19\d{2}|20\d{2})/);
    if (m) return +m[1];
    m = blob.match(/(\d{1,2})\s*[\/.\-]\s*(\d{1,2})\s*[\/.\-]\s*(\d{2})\b/);
    if (m) { const yy = +m[3]; return yy <= 30 ? 2000 + yy : 1900 + yy; }
    m = blob.match(/(?:^|[\/.\-\s])(\d{2})\s*$/);
    if (m) { const yy = +m[1]; if (yy >= 40 && yy <= 79) return 1900 + yy; }
    return null;
  }
  entrance(body, async () => {
    let rows;
    try { rows = await SOFCsv.fetchRows(FILE); }
    catch (e) { degrade(body, FILE); return; }
    const header = rows[0] || [];
    let cDate = SOFCsv.col(header, /^date$/i);
    let cTr = SOFCsv.col(header, /^date\s*-\s*translated$/i);
    if (cDate < 0 && cTr < 0) { degrade(body, FILE, "No date column found."); return; }
    if (cDate < 0) cDate = cTr;
    if (cTr < 0) cTr = cDate;
    const byYear = new Map();
    let undated = 0, total = 0, nonBlank = 0;
    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].some(c => (c || "").trim())) continue; /* skip blank padding rows */
      nonBlank++;
      const y = yearOf(rows[i], cDate, cTr);
      if (y == null || y < 1945 || y > 2026) { undated++; continue; }
      byYear.set(y, (byYear.get(y) || 0) + 1);
      total++;
    }
    const years = [...byYear.keys()].sort((a, b) => a - b);
    if (!years.length) { degrade(body, FILE, "No parseable years found."); return; }
    const seq = [];
    for (let y = years[0]; y <= years[years.length - 1]; y++) seq.push(y);
    const maxV = Math.max(1, ...seq.map(y => byYear.get(y) || 0));

    const W = 880, H = 320, mL = 46, mR = 12, mT = 26, mB = 44;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, style: "width:100%;height:auto;display:block",
      role: "img", "aria-label": "Bar chart: reprisal operations per year" }, body);
    const bw = (W - mL - mR) / seq.length;
    const y = v => mT + (1 - v / maxV) * (H - mT - mB);

    for (let g = 0; g <= 4; g++) {
      const gv = Math.round(maxV * g / 4);
      el("line", { x1: mL, y1: y(gv), x2: W - mR, y2: y(gv), stroke: g ? GRID : AXIS_INK, "stroke-width": g ? 1 : 1.5 }, svg);
      const t = el("text", { x: mL - 8, y: y(gv) + 3, "text-anchor": "end", "font-size": 9.5, fill: INK_LO, "font-family": MONO }, svg);
      t.textContent = gv;
    }
    const bars = [];
    seq.forEach((yr, i) => {
      const v = byYear.get(yr) || 0;
      const bx = mL + i * bw + Math.max(1, bw * 0.12), bwid = Math.max(2, bw * 0.76);
      const fullY = y(v), fullH = Math.max(1, y(0) - y(v));
      const bar = el("rect", {
        x: bx, y: (REDUCED || !v) ? fullY : y(0), width: bwid,
        height: (REDUCED || !v) ? fullH : 1,
        fill: BLUE, "fill-opacity": v ? 0.9 : 0.1, cursor: v ? "pointer" : "default",
        "data-drill-keep": ""
      }, svg);
      if (!REDUCED && v) {
        bar.style.transition = `y .6s ${EASE} ${i * 26}ms, height .6s ${EASE} ${i * 26}ms`;
        bars.push({ bar, fullY, fullH });
      }
      if (v && bw > 26) {
        const vt = el("text", { x: bx + bwid / 2, y: fullY - 5, "text-anchor": "middle",
          "font-size": 9.5, "font-weight": 700, fill: AXIS_INK, "font-family": MONO,
          "paint-order": "stroke", stroke: PAPER, "stroke-width": 3 }, svg);
        vt.textContent = v;
      }
      if (i % Math.ceil(seq.length / 9) === 0 || i === seq.length - 1) {
        const dt = el("text", { x: mL + i * bw + bw / 2, y: H - mB + 18, "text-anchor": "middle",
          "font-size": 9.5, fill: INK_MD, "font-family": MONO }, svg);
        dt.textContent = yr;
      }
      if (v) {
        bar.addEventListener("mouseenter", e => U.showTip(`${yr} · ${v} operations`, e.clientX, e.clientY));
        bar.addEventListener("mousemove", e => U.showTip(`${yr} · ${v} operations`, e.clientX, e.clientY));
        bar.addEventListener("mouseleave", U.hideTip);
        bar.addEventListener("click", e => U.showDrill({
          title: "Reprisal operations · " + yr,
          value: v,
          sub: `Event rows in ${FILE} whose parsed year is ${yr}. Basis: ${total} dated rows parsed in-browser from mixed-format date columns; ${undated} non-blank rows undated (excluded).`,
          source: FILE + " · columns “Date” / “Date - Translated” · " + nonBlank + " non-blank rows (blank padding rows excluded)",
          x: e.clientX, y: e.clientY
        }));
      }
    });
    if (bars.length) requestAnimationFrame(() => requestAnimationFrame(() => {
      bars.forEach(({ bar, fullY, fullH }) => { bar.setAttribute("y", fullY); bar.setAttribute("height", fullH); });
    }));
    const note = el("text", { x: mL, y: H - 6, "font-size": 9, fill: INK_LO, "font-family": MONO }, svg);
    note.textContent = `${total} dated events · ${undated} undated rows excluded`;
  });
})();

/* ═══════════════════════════════════════════════════════════
   CHART C · IAF 1973 losses by weapon type, split by front
   File: IAF_1973_Losses.csv · columns "Front", "Weapon"
   ═══════════════════════════════════════════════════════════ */
(() => {
  const host = document.getElementById("iaf-losses-chart");
  if (!host) return;
  const FILE = "IAF_1973_Losses.csv";
  const body = U.frame(host, {
    title: "Ground fire, not MiGs, exacted most of the 1973 toll",
    sub: "LOSS EVENTS BY RECORDED WEAPON, SPLIT BY FRONT · WEAPON STRINGS NORMALIZED (E.G. “54-6” → SA-6) · CLICK A SEGMENT FOR BASIS",
    src: "SOF-APPENDIX · " + FILE + " (fetched and aggregated in-browser)"
  });
  function normWeapon(raw) {
    const w = (raw || "").trim();
    if (!w) return "Unknown / blank";
    const k = w.toUpperCase().replace(/[\s.\-]/g, "");
    if (k === "546" || k === "SA6") return "SA-6";
    if (k === "547" || k === "SA7") return "SA-7";
    if (k === "SA2") return "SA-2";
    if (k === "SA3") return "SA-3";
    if (k === "SAM") return "SAM (unspecified)";
    if (k === "AAA") return "AAA";
    if (k === "AAAORSA7") return "AAA / SA-7 (uncertain)";
    if (k.indexOf("MIG") === 0 && k.indexOf("OR") === -1) return "MiG";
    if (k === "MIG21ORSA3") return "MiG / SA-3 (uncertain)";
    if (k === "ACCIDENT") return "Accident";
    if (k === "FRIENDLYFIRE") return "Friendly fire";
    if (k === "SEAD") return "SEAD (mission)";
    return w;
  }
  function normFront(raw) {
    const f = (raw || "").trim().toLowerCase();
    if (f === "syria") return "Syria";
    if (f === "egypt") return "Egypt";
    return "Other / undetermined";
  }
  const FRONTS = ["Syria", "Egypt", "Other / undetermined"];
  const FCOLOR = { "Syria": BLUE, "Egypt": BLUE_HI, "Other / undetermined": INK_LO };
  entrance(body, async () => {
    let rows;
    try { rows = await SOFCsv.fetchRows(FILE); }
    catch (e) { degrade(body, FILE); return; }
    const header = rows[0] || [];
    const cF = SOFCsv.col(header, /^front$/i);
    const cW = SOFCsv.col(header, /^weapon$/i);
    if (cF < 0 || cW < 0) { degrade(body, FILE, "Columns “Front”/“Weapon” not found."); return; }
    const table = new Map(); /* weapon -> {front -> n} */
    let total = 0;
    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].some(c => (c || "").trim())) continue;
      const w = normWeapon(rows[i][cW]), f = normFront(rows[i][cF]);
      if (!table.has(w)) table.set(w, { Syria: 0, Egypt: 0, "Other / undetermined": 0 });
      table.get(w)[f]++;
      total++;
    }
    const sumW = w => FRONTS.reduce((s, f) => s + table.get(w)[f], 0);
    const weapons = [...table.keys()].sort((a, b) => sumW(b) - sumW(a));
    const maxV = Math.max(1, ...weapons.map(sumW));

    const W = 880, rowH = 30, mL = 178, mR = 60, mT = 34, mB = 34;
    const H = mT + weapons.length * rowH + mB;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, style: "width:100%;height:auto;display:block",
      role: "img", "aria-label": "Stacked bar chart: IAF 1973 losses by weapon type, split by front" }, body);
    const x = v => mL + v / maxV * (W - mL - mR);

    /* legend */
    FRONTS.forEach((f, i) => {
      el("rect", { x: mL + i * 196, y: 8, width: 10, height: 10, fill: FCOLOR[f], "fill-opacity": 0.9 }, svg);
      const t = el("text", { x: mL + i * 196 + 16, y: 17, "font-size": 9.5, fill: INK_MD, "font-family": MONO, "letter-spacing": ".06em" }, svg);
      t.textContent = f.toUpperCase();
    });
    /* gridlines */
    const step = Math.max(1, Math.round(maxV / 5));
    for (let g = 0; g <= maxV; g += step) {
      el("line", { x1: x(g), y1: mT - 6, x2: x(g), y2: H - mB + 6, stroke: GRID, "stroke-width": 1 }, svg);
      const t = el("text", { x: x(g), y: H - mB + 22, "text-anchor": "middle", "font-size": 9.5, fill: INK_LO, "font-family": MONO }, svg);
      t.textContent = g;
    }
    const segs = [];
    weapons.forEach((w, i) => {
      const yy = mT + i * rowH;
      const lab = el("text", { x: mL - 10, y: yy + rowH / 2 + 3, "text-anchor": "end",
        "font-size": 10.5, fill: AXIS_INK, "font-family": MONO }, svg);
      lab.textContent = w;
      let acc = 0;
      FRONTS.forEach(f => {
        const v = table.get(w)[f];
        if (!v) return;
        const seg = el("rect", {
          x: x(acc), y: yy + 4, width: Math.max(1, x(acc + v) - x(acc)), height: rowH - 9,
          fill: FCOLOR[f], "fill-opacity": 0.9, cursor: "pointer", "data-drill-keep": ""
        }, svg);
        if (!REDUCED) {
          seg.style.transformOrigin = `${x(acc)}px ${yy}px`;
          seg.style.transform = "scaleX(0)";
          seg.style.transition = `transform .6s ${EASE} ${i * 70}ms`;
          segs.push(seg);
        }
        if (x(acc + v) - x(acc) > 22) {
          const vt = el("text", { x: (x(acc) + x(acc + v)) / 2, y: yy + rowH / 2 + 3,
            "text-anchor": "middle", "font-size": 9.5, "font-weight": 700, fill: "#fff", "font-family": MONO }, svg);
          vt.textContent = v;
        }
        seg.addEventListener("mouseenter", e => U.showTip(`${w} · ${f}: ${v}`, e.clientX, e.clientY));
        seg.addEventListener("mousemove", e => U.showTip(`${w} · ${f}: ${v}`, e.clientX, e.clientY));
        seg.addEventListener("mouseleave", U.hideTip);
        seg.addEventListener("click", e => U.showDrill({
          title: `IAF losses · ${w} · ${f}`,
          value: v,
          sub: `Loss events in ${FILE} with normalized weapon “${w}” and front “${f}”. Basis: ${total} loss rows parsed in-browser; raw weapon strings normalized (e.g. “54-6”/“SA6” → SA-6, MiG-17/MiG-21 → MiG); fronts outside Syria/Egypt grouped as Other / undetermined.`,
          source: FILE + " · columns “Weapon”, “Front” · October 1973",
          x: e.clientX, y: e.clientY
        }));
        acc += v;
      });
      const tot = el("text", { x: x(acc) + 8, y: yy + rowH / 2 + 3, "font-size": 10,
        "font-weight": 700, fill: AXIS_INK, "font-family": MONO,
        "paint-order": "stroke", stroke: PAPER, "stroke-width": 3 }, svg);
      tot.textContent = acc;
    });
    growIn(segs);
    const note = el("text", { x: mL, y: H - 4, "font-size": 9, fill: INK_LO, "font-family": MONO }, svg);
    note.textContent = `${total} loss events · normalization disclosed in drill-down`;
  });
})();
