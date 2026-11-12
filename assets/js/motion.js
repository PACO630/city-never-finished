/* 城市不是完成品：動態層
   - 首屏：幾何碎片從角落炸開、可拖曳、會避開游標；往下捲時收回角落
   - 大字逐字進場、mono 標題亂碼解碼
   - 章節舞台：捲動時盒子從闔起到翻開（scrub，不鎖捲軸），背景大數字視差
   - 章節跳轉與換頁：盒子翻轉轉場，結束時飛回左下角立方體
   全部在「減少動畫」或系統偏好開啟時停用。 */
(function () {
  "use strict";
  var CITY = window.CITY;
  var doc = document.documentElement;
  if (!CITY || !window.gsap) return;
  var gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
  if (window.Draggable) gsap.registerPlugin(window.Draggable);
  var ST = window.ScrollTrigger;

  // 切換「減少動畫」時重新載入，讓整個動態層一致地開或關
  var mt = document.querySelector(".motion-toggle");
  if (mt) mt.addEventListener("click", function () { setTimeout(function () { location.reload(); }, 120); });

  var PAGE = doc.getAttribute("data-page");
  var isHome = PAGE === "home";
  var reduced = CITY.reduceMotion();

  /* ---------- 轉場盒子（減少動畫時也保留結構，但不播放） ---------- */
  var TONES = { ch01: "#111111", ch02: "#3F6B4A", ch03: "#1F4E6B", ch04: "#111111", ch05: "#CF3F2B", ch06: "#2A2A2A" };
  var warp = document.createElement("div");
  warp.className = "warp"; warp.setAttribute("aria-hidden", "true");
  warp.innerHTML = '<div class="warp-bg"></div><div class="warp-card"><div class="warp-top"><span data-wn></span><span>城市不是完成品</span></div>' +
    '<div><div class="warp-t" data-wt></div><div class="warp-en" lang="en" data-we></div></div><div class="warp-iso" data-wi></div></div>';
  document.body.appendChild(warp);
  var wBg = warp.querySelector(".warp-bg"), wCard = warp.querySelector(".warp-card");

  if (reduced) return;
  doc.classList.add("has-motion");

  /* ---------- 工具 ---------- */
  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  var GLYPHS = "↑↓←→ABXY01#/+*";
  function scramble(el, dur) {
    var text = el.getAttribute("data-text") || el.textContent;
    el.setAttribute("data-text", text);
    var o = { p: 0 };
    gsap.to(o, { p: 1, duration: dur || 0.7, ease: "none", onUpdate: function () {
      var n = Math.floor(o.p * text.length), out = text.slice(0, n);
      for (var i = n; i < text.length; i++) out += text[i] === " " ? " " : pick(GLYPHS);
      el.textContent = out;
    }, onComplete: function () { el.textContent = text; } });
  }
  function splitChars(el) {
    // 只切文字節點，保留子元素
    var chars = [];
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        Array.from(n.textContent).forEach(function (c) {
          var s = document.createElement("span"); s.className = "w"; s.textContent = c; s.setAttribute("aria-hidden", "true");
          frag.appendChild(s); chars.push(s);
        });
        n.parentNode.replaceChild(frag, n);
      }
    });
    return chars;
  }

  /* ---------- 首屏大字 ---------- */
  var hero = document.querySelector(".en-title");
  if (hero) {
    hero.setAttribute("aria-label", "THE CITY IS NEVER FINISHED");
    var heroChars = [];
    hero.querySelectorAll(":scope > span").forEach(function (line) {
      var t = line.textContent; line.textContent = ""; line.className = "ln"; line.setAttribute("aria-hidden", "true");
      Array.from(t).forEach(function (c) { var s = document.createElement("span"); s.className = "ch"; s.textContent = c === " " ? " " : c; line.appendChild(s); heroChars.push(s); });
    });
    var intro = gsap.timeline({ delay: 0.15 });
    intro.from(heroChars, { yPercent: 115, rotate: 10, duration: 1.1, ease: "expo.out", stagger: 0.028 })
      .from(".tc-title", { y: 30, opacity: 0, duration: 0.8, ease: "expo.out" }, "-=0.8")
      .from(".subtitle, .entry-note", { y: 20, opacity: 0, duration: 0.7, ease: "expo.out", stagger: 0.08 }, "-=0.6")
      .from(".home .right > *", { y: 40, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.1 }, "-=0.9")
      .from(".home .ph", { clipPath: "inset(0 100% 0 0)", duration: 1.1, ease: "expo.inOut" }, "-=0.9");
  }
  // 子頁標題
  document.querySelectorAll(".page-head h1").forEach(function (h) {
    gsap.from(h, { y: 50, opacity: 0, duration: 1, ease: "expo.out", delay: 0.1 });
    gsap.from(".page-head p, .page-head .chips li", { y: 20, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.05, delay: 0.3 });
  });

  /* ---------- mono 標籤解碼 ---------- */
  document.querySelectorAll(".kicker, .stage-meta span, .page .row-top span").forEach(function (el) {
    if (el.children.length) return;
    if (ST) ST.create({ trigger: el, start: "top 92%", once: true, onEnter: function () { scramble(el, 0.8); } });
  });

  /* ---------- 進場 ---------- */
  if (ST) {
    ST.batch(".reveal", {
      start: "top 90%", once: true,
      onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.12, overwrite: true }); }
    });
    document.querySelectorAll(".question, .closing").forEach(function (q) {
      gsap.fromTo(q, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.4, ease: "expo.inOut",
        scrollTrigger: { trigger: q, start: "top 85%", once: true } });
    });
    gsap.utils.toArray(".index li").forEach(function (li, i) {
      gsap.from(li, { x: -60, opacity: 0, duration: 0.9, ease: "expo.out", delay: i * 0.06, scrollTrigger: { trigger: li, start: "top 95%", once: true } });
    });
    gsap.utils.toArray(".ref-card, .layer-table .cell, .brand-stack li, .assets .ph, .qcard li").forEach(function (c) {
      gsap.from(c, { y: 50, rotationX: -25, transformPerspective: 800, transformOrigin: "50% 0%", opacity: 0, duration: 0.9, ease: "expo.out",
        scrollTrigger: { trigger: c, start: "top 92%", once: true } });
    });
    gsap.utils.toArray(".ch-body .ph, .tw, [data-scenario]").forEach(function (c) {
      gsap.from(c, { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "expo.inOut", scrollTrigger: { trigger: c, start: "top 88%", once: true } });
    });
  }

  /* ---------- 索引預覽翻面 ---------- */
  var pv = document.querySelector("[data-pv]"), lastPv = "ch01";
  document.querySelectorAll(".index a.row").forEach(function (a) {
    function flip() {
      var id = a.getAttribute("href").slice(1);
      if (id === lastPv || !pv) return; lastPv = id;
      gsap.fromTo(pv, { rotationY: -75, opacity: 0.2, transformPerspective: 900, transformOrigin: "0% 50%" }, { rotationY: 0, opacity: 1, duration: 0.7, ease: "expo.out" });
    }
    a.addEventListener("mouseenter", flip); a.addEventListener("focus", flip);
  });

  /* ---------- 章節舞台：盒子由闔到開 ---------- */
  if (ST) {
    var mm = gsap.matchMedia();
    document.querySelectorAll(".chapter").forEach(function (ch) {
      var stage = ch.querySelector(".stage");
      if (!stage) return;
      var n = document.createElement("div"); n.className = "stage-num"; n.setAttribute("aria-hidden", "true");
      n.textContent = ch.id.replace("ch", ""); stage.insertBefore(n, stage.firstChild);
      gsap.fromTo(n, { yPercent: -70, rotation: -6 }, { yPercent: -30, rotation: 4, ease: "none", scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: true } });

      var booklet = stage.querySelector(".booklet"), pl = stage.querySelector(".page-l"), pr = stage.querySelector(".page-r"), peek = stage.querySelector(".peek");
      var h2 = stage.querySelector("h2"); var chars = h2 ? splitChars(h2) : [];
      if (h2) h2.setAttribute("aria-label", h2.textContent);

      mm.add("(min-width: 900px)", function () {
        var tl = gsap.timeline({ scrollTrigger: { trigger: stage, start: "top 85%", end: "top 10%", scrub: 0.9 } });
        tl.fromTo(booklet, { rotationX: 62, y: 160, scale: 0.66 }, { rotationX: 0, y: 0, scale: 1, ease: "power2.out", duration: 1 }, 0)
          .fromTo(pl, { rotationY: -94 }, { rotationY: -16, ease: "power3.out", duration: 0.8 }, 0.2)
          .fromTo(pr, { rotationY: 94 }, { rotationY: 16, ease: "power3.out", duration: 0.8 }, 0.2)
          .fromTo(peek, { y: 120, opacity: 0, scale: 0.6 }, { y: 0, opacity: 1, scale: 1, ease: "back.out(1.8)", duration: 0.5 }, 0.6)
          .fromTo(chars, { yPercent: 80, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.02, duration: 0.3, ease: "power2.out" }, 0.65);
        return function () { gsap.set([booklet, pl, pr, peek].concat(chars), { clearProps: "all" }); };
      });
      mm.add("(max-width: 899px)", function () {
        gsap.fromTo([pl, pr], { y: 80, rotationX: -35, opacity: 0, transformPerspective: 900, transformOrigin: "50% 0%" },
          { y: 0, rotationX: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.15, scrollTrigger: { trigger: stage, start: "top 75%", once: true } });
      });
    });
  }

  /* ---------- 碎片 ---------- */
  var defs = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<pattern id="fg-dots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1.5" fill="#9A9A9A"/></pattern>' +
    '<pattern id="fg-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="#8A8A8A" stroke-width="1.6"/></pattern></defs></svg>';
  var G = "#C9C9C9";
  var SHAPES = [
    '<path d="M0 40 40 0 40 40Z" fill="' + G + '"/>',
    '<path d="M0 0H40A40 40 0 0 1 0 40Z" fill="' + G + '"/>',
    '<rect width="40" height="40" fill="url(#fg-dots)"/>',
    '<path d="M14 0h12v14h14v12H26v14H14V26H0V14h14z" fill="' + G + '"/>',
    '<rect width="40" height="40" fill="url(#fg-hatch)"/>',
    '<path d="M20 2 37 11v19L20 39 3 30V11z" fill="#fff" stroke="#111" stroke-width="2"/><path d="M3 11l17 9 17-9M20 20v19" fill="none" stroke="#111" stroke-width="2"/>',
    '<circle cx="20" cy="20" r="20" fill="url(#fg-dots)"/>',
    '<path d="M0 0h20l20 20-20 20H0l20-20z" fill="' + G + '"/>',
    '<path d="M0 40a20 20 0 0 1 40 0z" fill="#111"/>',
    '<path d="M0 0h40v40H0z" fill="none" stroke="#111" stroke-width="2" stroke-dasharray="5 4"/>',
    '<path d="M0 0 40 40H0z" fill="url(#fg-hatch)"/>'
  ];
  var desktop = window.matchMedia("(min-width: 1100px)").matches;
  var COUNT = desktop ? 30 : 14;
  var layer = document.createElement("div"); layer.className = "frags"; layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = defs;
  var pieces = [];
  for (var i = 0; i < COUNT; i++) {
    var size = Math.round(rand(desktop ? 20 : 16, desktop ? 54 : 36) / 4) * 4;
    var shape = i === 0 ? '<rect width="40" height="40" fill="#CF3F2B"/>' : SHAPES[i % SHAPES.length];
    var d = document.createElement("div"); d.className = "frag";
    d.style.width = size + "px"; d.style.height = size + "px";
    d.innerHTML = '<svg viewBox="0 0 40 40">' + shape + '</svg>';
    layer.appendChild(d);
    // 角落堆疊位置（左上三角形）
    var gx = rand(0, 96), gy = rand(0, Math.max(4, 96 - gx));
    pieces.push({ el: d, size: size, gx: gx, gy: gy, gr: pick([0, 90, 180, 270]), sx: 0, sy: 0, sr: 0 });
  }
  document.body.appendChild(layer);
  var fbtn = document.createElement("button");
  fbtn.className = "box frag-btn"; fbtn.type = "button"; fbtn.textContent = "收回碎片";
  document.body.appendChild(fbtn);

  function layoutScatter() {
    var W = window.innerWidth, H = window.innerHeight;
    pieces.forEach(function (p) {
      p.sx = rand(W * 0.04, W - p.size - 20);
      p.sy = rand(H * 0.12, H - p.size - 20);
      p.sr = p.gr + pick([-180, -90, 90, 180]);
    });
  }
  layoutScatter();
  var scattered = false, manual = false;
  pieces.forEach(function (p) { gsap.set(p.el, { x: p.gx, y: p.gy, rotation: p.gr }); });

  function scatter(delay) {
    scattered = true; fbtn.classList.add("show");
    pieces.forEach(function (p, i) {
      gsap.to(p.el, { x: p.sx, y: p.sy, rotation: p.sr, duration: rand(1.1, 1.6), ease: "expo.out", delay: (delay || 0) + i * 0.018, overwrite: true });
    });
  }
  function gather() {
    scattered = false; fbtn.classList.remove("show");
    pieces.forEach(function (p, i) {
      gsap.to(p.el, { x: p.gx, y: p.gy, rotation: p.gr, duration: 0.9, ease: "power3.inOut", delay: i * 0.012, overwrite: true });
    });
  }
  fbtn.addEventListener("click", function () { manual = true; gather(); });
  layer.addEventListener("click", function (e) {
    if (!scattered && e.target.closest(".frag")) { manual = true; layoutScatter(); scatter(0); }
  });

  // 首頁一開始炸開；往下捲收回；回到頂端再散開
  if (isHome && window.scrollY < window.innerHeight * 0.5) scatter(0.6);
  window.addEventListener("scroll", function () {
    if (manual) return;
    var y = window.scrollY;
    if (scattered && y > window.innerHeight * 0.55) gather();
    else if (!scattered && isHome && y < 40) { layoutScatter(); scatter(0); }
  }, { passive: true });
  window.addEventListener("resize", function () { if (scattered) { layoutScatter(); scatter(0); } });

  // 游標靠近時推開
  var mx = -999, my = -999, queued = false;
  window.addEventListener("pointermove", function (e) {
    mx = e.clientX; my = e.clientY;
    if (queued || !scattered) return; queued = true;
    requestAnimationFrame(function () {
      queued = false;
      pieces.forEach(function (p) {
        if (p.dragging) return;
        var x = gsap.getProperty(p.el, "x"), y = gsap.getProperty(p.el, "y");
        var cx = x + p.size / 2, cy = y + p.size / 2, dx = cx - mx, dy = cy - my, dist = Math.hypot(dx, dy), R = 120;
        if (dist < R && dist > 0.1) {
          var push = (R - dist) / R * 70;
          gsap.to(p.el, { x: x + dx / dist * push, y: y + dy / dist * push, rotation: "+=" + (dx > 0 ? 25 : -25), duration: 0.35, ease: "power3.out", overwrite: "auto" });
        }
      });
    });
  }, { passive: true });

  if (window.Draggable) {
    pieces.forEach(function (p) {
      window.Draggable.create(p.el, {
        type: "x,y", zIndexBoost: true,
        onPress: function () { p.dragging = true; gsap.killTweensOf(p.el); },
        onRelease: function () { p.dragging = false; },
        onDragEnd: function () {
          if (!scattered) { scattered = true; manual = true; fbtn.classList.add("show"); }
          gsap.to(p.el, { rotation: "+=90", duration: 0.5, ease: "back.out(2)" });
        }
      });
    });
  }

  /* ---------- 秘技：↑↑↓↓←→←→BA ---------- */
  var KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"], kp = 0;
  window.addEventListener("keydown", function (e) {
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kp = k === KONAMI[kp] ? kp + 1 : (k === KONAMI[0] ? 1 : 0);
    if (kp === KONAMI.length) {
      kp = 0; manual = true; layoutScatter();
      pieces.forEach(function (p, i) {
        gsap.fromTo(p.el, { x: window.innerWidth / 2, y: window.innerHeight / 2, scale: 0 }, { x: p.sx, y: p.sy, scale: 1, rotation: "+=720", duration: 1.6, ease: "expo.out", delay: i * 0.01 });
      });
      scattered = true; fbtn.classList.add("show");
      var cube = document.querySelector(".cube");
      if (cube) gsap.fromTo(cube, { rotationY: 0 }, { rotationY: 1080, duration: 2, ease: "expo.out", clearProps: "transform" });
      CITY.announce("秘技成功：城市碎片全部散開");
    }
  });

  /* ---------- 轉場盒子 ---------- */
  function railTarget() {
    var el = document.querySelector(".cube-wrap");
    if (!el || !el.offsetParent) el = document.querySelector(".chapbtn");
    if (!el || !el.offsetParent) return { x: 40, y: window.innerHeight - 40 };
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  function fillCard(n, t, en, iso) {
    warp.querySelector("[data-wn]").textContent = n;
    warp.querySelector("[data-wt]").textContent = t;
    warp.querySelector("[data-we]").textContent = en || "";
    warp.querySelector("[data-wi]").innerHTML = iso || "";
  }
  var busy = false;
  function warpIn(o, mid, done) {
    busy = true;
    wBg.style.background = o.tone || "#111111";
    fillCard(o.n, o.t, o.en, CITY.isoSVG([{ x: 0, y: 0, w: 3, d: 3, h: 2.4, style: "frame" }, { x: 0.5, y: 0.5, w: 3, d: 3, h: 2.4, style: "hypo" }], { scale: 16 }));
    var cx = o.x != null ? o.x : window.innerWidth / 2, cy = o.y != null ? o.y : window.innerHeight / 2;
    var tl = gsap.timeline({ onComplete: function () { busy = false; if (done) done(); } });
    tl.set(warp, { visibility: "visible" }).add(function () { warp.classList.add("on"); })
      .fromTo(wBg, { clipPath: "circle(0% at " + cx + "px " + cy + "px)", opacity: 1 }, { clipPath: "circle(150% at " + cx + "px " + cy + "px)", duration: 0.65, ease: "power3.in" })
      .fromTo(wCard, { rotationY: -110, rotationX: 25, scale: 0.5, opacity: 0, x: 0, y: 0, z: -400 },
        { rotationY: 0, rotationX: 0, scale: 1, opacity: 1, z: 0, duration: 0.7, ease: "back.out(1.3)" }, "-=0.3")
      .add(function () { if (mid) mid(); });
    return tl;
  }
  function warpOut() {
    var r = railTarget(), cr = wCard.getBoundingClientRect();
    var tl = gsap.timeline({ onComplete: function () { gsap.set(warp, { visibility: "hidden" }); warp.classList.remove("on"); gsap.set(wCard, { clearProps: "all" }); } });
    tl.to(wCard, { duration: 0.25 })
      .to(wCard, { x: r.x - (cr.left + cr.width / 2), y: r.y - (cr.top + cr.height / 2), scale: 0.05, rotationY: 160, rotationX: -40, duration: 0.75, ease: "power3.in" })
      .to(wBg, { opacity: 0, duration: 0.45, ease: "power2.out" }, "-=0.4");
    return tl;
  }

  // 同頁章節跳轉
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]");
    if (!a || busy || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    var href = a.getAttribute("href");
    var m = href.match(/^#(ch0[1-6])$/);
    if (m && isHome) {
      var target = document.getElementById(m[1]);
      var c = CITY.CHAPTERS.filter(function (x) { return x.id === m[1]; })[0];
      if (!target || !c) return;
      e.preventDefault();
      var sh = document.querySelector(".sheet.open"); if (sh) sh.classList.remove("open");
      warpIn({ n: "CHAPTER " + c.n + "／06", t: c.tc, en: c.en, tone: TONES[c.id], x: e.clientX, y: e.clientY }, function () {
        target.scrollIntoView({ behavior: "instant", block: "start" });
        history.replaceState(null, "", "#" + c.id);
        if (ST) ST.refresh();
        target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true });
        warpOut();
      });
      return;
    }
    // 換頁
    if (a.target || a.hasAttribute("download") || href.charAt(0) === "#") return;
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin || url.pathname === location.pathname) return;
    e.preventDefault();
    var label = (a.textContent || "").replace(/[→↓]/g, "").trim().slice(0, 24) || "城市不是完成品";
    try { sessionStorage.setItem("city-warp", JSON.stringify({ t: label, hash: url.hash })); } catch (err) {}
    warpIn({ n: "→", t: label, en: "", tone: "#111111", x: e.clientX, y: e.clientY }, function () { location.href = url.href; });
  });

  // 從別頁轉場進來
  var incoming = null;
  try { incoming = JSON.parse(sessionStorage.getItem("city-warp") || "null"); sessionStorage.removeItem("city-warp"); } catch (err) {}
  if (incoming) {
    wBg.style.background = "#111111";
    fillCard("→", incoming.t, "", "");
    gsap.set(warp, { visibility: "visible" }); gsap.set(wBg, { opacity: 1 });
    gsap.timeline({ delay: 0.05, onComplete: function () { gsap.set(warp, { visibility: "hidden" }); gsap.set([wCard, wBg], { clearProps: "all" }); } })
      .to(wCard, { rotationY: 100, rotationX: -15, z: -300, opacity: 0, duration: 0.7, ease: "power3.in" })
      .to(wBg, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "expo.inOut" }, "-=0.35");
  }

  // 返回上一頁（bfcache）時把遮罩清掉
  window.addEventListener("pageshow", function (e) { if (e.persisted) { gsap.set(warp, { visibility: "hidden" }); warp.classList.remove("on"); busy = false; } });
})();
