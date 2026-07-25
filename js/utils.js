// Shared utilities
window.U = (() => {
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = t => t * t * (3 - 2 * t);
  const ease = (cur, tgt, dt, dur) => cur + (tgt - cur) * (1 - Math.exp(-dt / dur));

  /* HTML-escape helper for interpolating untrusted (CSV-derived) strings */
  const esc = s => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  // Professional palette — white surface, deep-navy ink, electric-blue accent.
  // NOTE key semantics: `red` is the LEGACY ACCENT SLOT (now electric blue) so existing
  // accent usages recolor automatically; true negatives (declines/crashes/missing)
  // must use PAL.neg — audited per chart.
  const PAL = {
    paper: "#ffffff", hi: "#f7f9fc", ink: "#051c2c", inkMd: "#42566a", inkLo: "#8595a6",
    line: "#dbe2ea", lineLo: "#eef1f6", red: "#2251ff", redHi: "#1233b8",
    copper: "#b07a10", green: "#008a6d", gold: "#b07a10",
    neg: "#c22f4e", accent: "#2251ff", navy: "#051c2c",
  };

  // ── Count-up (ease-out cubic; writes via innerHTML when html:true) ──
  function countUp(el, { from = 0, to = 1, dur = 1100, html = false, fmt = v => Math.round(v).toLocaleString("en-US") } = {}) {
    let raf = 0, t0 = null;
    const tick = ts => {
      if (t0 == null) t0 = ts;
      const t = clamp((ts - t0) / dur, 0, 1);
      const e = 1 - Math.pow(1 - t, 3);
      if (html) el.innerHTML = fmt(lerp(from, to, e));
      else el.textContent = fmt(lerp(from, to, e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }

  const fmt = {
    pct: v => (v > 0 ? "+" : "") + v.toFixed(v % 1 ? 1 : 0) + "%",
    n: v => v.toLocaleString("en-US"),
  };

  // ── Drill-down data card ──
  const drill = document.getElementById("drill-card");
  let drillOpen = false;
  function showDrill({ title, value, delta, sub, source, x, y }) {
    drill.innerHTML = `<button class="d-close">✕</button>
      <div class="d-title">${esc(title)}</div>
      <div class="d-val">${esc(value)}${delta != null ? ` <span class="${delta >= 0 ? "pos" : "neg"}" style="font-size:15px">${fmt.pct(delta)}</span>` : ""}</div>
      ${sub ? `<div class="d-sub">${esc(sub)}</div>` : ""}
      ${source ? `<div class="d-src">Source · ${esc(source)}</div>` : ""}`;
    drill.hidden = false; drillOpen = true;
    const r = drill.getBoundingClientRect();
    let left = clamp(x + 14, 8, window.innerWidth - r.width - 8);
    let top = clamp(y - r.height - 14, 8, window.innerHeight - r.height - 8);
    if (y - r.height - 14 < 8) top = clamp(y + 18, 8, window.innerHeight - r.height - 8);
    drill.style.left = left + "px"; drill.style.top = top + "px";
    drill.querySelector(".d-close").onclick = hideDrill;
  }
  function hideDrill() { drill.hidden = true; drillOpen = false; }
  document.addEventListener("click", e => {
    if (drillOpen && !drill.contains(e.target)) {
      // let the triggering element handle it itself
      if (!e.target.closest("[data-drill-keep]")) hideDrill();
    }
  }, true);

  // ── Hover tooltip ──
  const tip = document.createElement("div");
  tip.className = "tip"; document.body.appendChild(tip);
  function showTip(text, x, y) {
    tip.textContent = text; tip.style.opacity = 1;
    tip.style.left = clamp(x + 12, 4, window.innerWidth - 220) + "px";
    tip.style.top = (y - 34) + "px";
  }
  function hideTip() { tip.style.opacity = 0; }

  // ── Chart frame ──
  function frame(el, { title, sub, src }) {
    const head = document.createElement("div");
    if (title) head.innerHTML = `<p class="chart-title">${title}</p>${sub ? `<p class="chart-sub">${sub}</p>` : ""}`;
    el.appendChild(head);
    const body = document.createElement("div");
    el.appendChild(body);
    if (src) {
      const s = document.createElement("p");
      s.className = "chart-src"; s.textContent = "Source · " + src;
      el.appendChild(s);
    }
    return body;
  }

  return { TAU, clamp, lerp, smooth, ease, esc, PAL, countUp, fmt, showDrill, hideDrill, showTip, hideTip, frame };
})();
