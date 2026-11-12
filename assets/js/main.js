/* 城市不是完成品：全站共用（導覽、章節進度、來源抽屜、減少動畫、等角線稿） */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.remove("no-js");
  var ROOT = doc.getAttribute("data-root") || "./";
  var PAGE = doc.getAttribute("data-page") || "home";

  /* ---------------- 內容資料 ---------------- */
  var CHAPTERS = [
    { id: "ch01", n: "01", tc: "你看見哪一刻", en: "Which Moment Do You See" },
    { id: "ch02", n: "02", tc: "日常如何繼續", en: "How Daily Life Goes On" },
    { id: "ch03", n: "03", tc: "哪一層留下來", en: "Which Layer Remains" },
    { id: "ch04", n: "04", tc: "設計怎樣遇見時間", en: "When Design Meets Time" },
    { id: "ch05", n: "05", tc: "城市的未定稿", en: "The City in Draft" },
    { id: "ch06", n: "06", tc: "把問題帶回街上", en: "Back to the Street" }
  ];
  var NAV = [
    { key: "home", tc: "閱讀展覽", href: "index.html#ch01" },
    { key: "explore", tc: "探索城市", href: "explore/" },
    { key: "references", tc: "案例索引", href: "references/" },
    { key: "sources", tc: "資料與方法", href: "sources/" },
    { key: "about", tc: "關於", href: "about/" }
  ];
  // 查閱日期：2026-11-13（Brief 第 13.1 節）
  var SOURCES = {
    S01: { org: "高雄市政府新聞局 高雄畫刊", title: "〈達人帶你逛！自由黃昏市場採買燃起主婦魂〉", use: "地方刊物對市場食材與熟食的介紹。", limit: "非長期營運調查；不據此推論管理形式、攤位數或沿革。", url: "https://takao.kcg.gov.tw/article/1198" },
    S02: { org: "交通部觀光署", title: "85 大樓相關景點頁", use: "旅遊敘事線索。", limit: "目前開放情形需另核實，不作觀眾指引。", url: "https://www.taiwan.net.tw/m1.aspx?id=9328&sNo=0001016" },
    S03: { org: "交通部鐵道局", title: "〈施工階段〉（頁面最後更新 2026-10-28）", use: "分辨高雄車站工程竣工及驗收後續事項。", limit: "工程節點不等於使用經驗，也不作設施好壞的證明。", url: "https://www.rb.gov.tw/zh-TW/main/main_28/20250505_152338/20251104_135332/20250505_153007/20250505_153007-3/" },
    S04: { org: "Mecanoo", title: "Kaohsiung Station 專案頁", use: "設計意圖與專案資料。", limit: "設計者自述，非獨立使用後評估。", url: "https://www.mecanoo.nl/Projects/project/170/Kaohsiung-Station?d=0&t=0" },
    S05: { org: "高雄捷運", title: "〈高雄輕軌乘車及票價 Q&A〉（頁面更新 2026-11-02）", use: "歷史營運節點：2024-01-01 試營運成圓、2024-02-26 全線正式營運。", limit: "不提供即時乘車保證；路線圖不證明任一場所可直接抵達。", url: "https://www.krtc.com.tw/Service/faq_more?id=10def821c28c4466a394be86edca7383" },
    S06: { org: "MVRDV", title: "Markthal 專案頁", use: "Rotterdam，2004 至 2014；市場與住宅等混合機能。", limit: "公共性與協同效益為設計者自述。", url: "https://www.mvrdv.com/projects/115/markthal" },
    S07: { org: "OMA", title: "Venice Biennale 2010 Cronocaos", use: "展覽官方陳述：保存範圍擴大與戰後建築遭消除的同時性。", limit: "官方展覽陳述不等於實證都市研究；不是反保存宣言。", url: "https://www.oma.com/projects/venice-biennale-2010-cronocaos" },
    S08: { org: "MoMA", title: "The Many Lives of the Nakagin Capsule Tower 新聞稿（2025-05-08）", use: "1972 年完成、2022 年拆解；原先膠囊替換構想未實現，使用轉換。", limit: "更換年限依此稿為 25 至 35 年，其他材料可能不同；拆解原因不歸於單一因素。", url: "https://press.moma.org/wp-content/uploads/2025/05/MoMA_TheManyLivesofNakaginCapsuleTower_PressRelease_Final-1.pdf" },
    S09: { org: "MoMA", title: "Cedric Price, Fun Palace for Joan Littlewood Project（館藏 1235.2000，1959–1961）", use: "未建成計畫；可容納重組活動的框架。", limit: "此件圖稿日期不等於整個計畫的唯一日期。", url: "https://www.moma.org/collection/works/846" },
    S10: { org: "Stewart Brand, Long Now", title: "Pace Layering: How Complex Systems Learn and Keep Learning", use: "作者回述 How Buildings Learn 與 Frank Duffy 層次觀點的脈絡。", limit: "建築六層與文明尺度的 Pace Layers 是不同框架；不作壽命法則。", url: "https://longnow.org/ideas/pace-layers/" },
    S11: { org: "M+", title: "中銀膠囊大樓單位 A806 館藏頁", use: "拆解後個別膠囊收藏的補充線索。", limit: "不推論整體保存成果。", url: "https://www.mplus.org.hk/en/collection/objects/unit-a806-nakagin-capsule-tower-19701972-tokyo-japan-2024104/" },
    S12: { org: "CCA", title: "1964 Fun Palace", use: "館藏材料與宣傳冊脈絡。", limit: "與 MoMA 圖稿年代不同，不合併為單一日期。", url: "https://www.cca.qc.ca/en/articles/issues/2/what-the-future-looked-like/32737/1964-fun-palace" },
    S13: { org: "W3C", title: "Web Content Accessibility Guidelines 2.2", use: "介面檢查依據。", limit: "本站以 AA 為檢查目標，未自稱通過認證。", url: "https://www.w3.org/TR/WCAG22/" },
    S14: { org: "Google Fonts", title: "Noto Sans TC（OFL）", use: "繁體中文主字體。", limit: "隨專案保留授權文字。", url: "https://github.com/google/fonts/tree/main/ofl/notosanstc" },
    S15: { org: "Google Fonts", title: "Noto Serif TC（OFL）", use: "敘事提問字體。", limit: "隨專案保留授權文字。", url: "https://github.com/google/fonts/tree/main/ofl/notoseriftc" },
    S16: { org: "rsms/inter", title: "Inter 授權檔（OFL）", use: "英文標題字體。", limit: "隨專案保留授權文字。", url: "https://github.com/rsms/inter/blob/master/LICENSE.txt" },
    S17: { org: "IBM", title: "IBM Plex 授權檔（OFL）", use: "日期、編號與模型層 ID。", limit: "隨專案保留授權文字。", url: "https://github.com/IBM/plex/blob/master/LICENSE.txt" },
    S18: { org: "MoMA", title: "The Many Lives of the Nakagin Capsule Tower 展覽頁", use: "展期與圖片重製聯絡說明。", limit: "本站日期晚於其列定展期，不寫為仍在展出。", url: "https://www.moma.org/calendar/exhibitions/5830" }
  };

  window.CITY = { CHAPTERS: CHAPTERS, SOURCES: SOURCES, ROOT: ROOT };

  /* ---------------- 減少動畫 ---------------- */
  var rmKey = "city-reduce-motion";
  function storedRM() { try { return localStorage.getItem(rmKey); } catch (e) { return null; } }
  var sysRM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var rm = storedRM() === "1" || (storedRM() === null && sysRM);
  doc.classList.toggle("reduce-motion", rm);
  window.CITY.reduceMotion = function () { return doc.classList.contains("reduce-motion"); };

  /* ---------------- 共用外框 ---------------- */
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }
  function href(p) { return ROOT + p; }
  function chHref(id) { return (PAGE === "home" ? "" : ROOT + "index.html") + "#" + id; }

  var markSVG = '<svg viewBox="0 0 26 26" aria-hidden="true"><path d="M3 9 13 4l10 5-10 5z" fill="none" stroke="currentColor"/><path d="M3 9v8l10 5V14M23 9v8l-10 5" fill="none" stroke="currentColor"/><path d="M13 14v8" stroke="currentColor" stroke-dasharray="2 2"/></svg>';

  var topnav = '<nav class="topnav" aria-label="主要導覽">' +
    '<a class="box mark" href="' + href("index.html") + '" aria-label="回到入口">' + markSVG + '</a>' +
    NAV.map(function (n) {
      var cur = n.key === PAGE ? ' aria-current="page"' : "";
      return '<a class="box" href="' + (n.key === "home" ? chHref("ch01") : href(n.href)) + '"' + cur + '>' + n.tc + '</a>';
    }).join("") + '</nav>';

  var rail = '<nav class="rail" aria-label="章節進度">' +
    '<a class="logo" href="' + href("index.html") + '"><b>城市不是完成品</b><span lang="en">THE CITY<br>IS NEVER<br>FINISHED</span></a>' +
    '<a class="cube-wrap" href="' + chHref("ch01") + '" aria-label="章節進度"><div class="cube" aria-hidden="true">' +
      '<div class="f f1"></div><div class="f f2"></div><div class="f f3"></div><div class="f f4"></div><div class="f f5"></div><div class="f f6"></div><div class="f fc"></div>' +
    '</div><span class="cube-count" data-count>— ／06</span></a>' +
    '<div class="chapgrid">' + CHAPTERS.map(function (c) {
      return '<a class="box" href="' + chHref(c.id) + '" data-chlink="' + c.id + '" title="第' + c.n + '章 ' + c.tc + '"><span class="sr-only">第</span>' + c.n + '<span class="sr-only">章 ' + c.tc + '</span></a>';
    }).join("") + '</div></nav>';

  var corner = '<svg class="corner" viewBox="0 0 64 64" aria-hidden="true"><defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#111111" stroke-width="1"/></pattern></defs><path d="M0 0H64L56 8 48 6 44 14 36 12 32 22 24 20 22 30 14 28 12 38 6 36 0 48Z" fill="url(#hatch)" stroke="#111111"/></svg>';

  var motion = '<button class="box motion-toggle" type="button" aria-pressed="' + rm + '">' +
    '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 15 15 1v14z" fill="none" stroke="currentColor"/><path d="M5 15 15 5" stroke="currentColor"/></svg><span class="lbl">減少動畫</span><span class="sr-only">（目前' + (rm ? "開啟" : "關閉") + '）</span></button>';

  var mbar = '<div class="mbar"><a class="title" href="' + href("index.html") + '">城市不是完成品</a>' +
    '<button class="box" type="button" data-open-sheet aria-haspopup="dialog">目錄</button></div>' +
    '<button class="box chapbtn" type="button" data-open-sheet aria-haspopup="dialog"><span data-chapbtn>目錄</span></button>';

  var sheet = '<div class="sheet" role="dialog" aria-modal="true" aria-label="目錄"><div class="panel">' +
    '<div class="close-row"><button class="box" type="button" data-close-sheet>關閉</button></div>' +
    '<h2>章節</h2><ul>' + CHAPTERS.map(function (c) {
      return '<li><a class="box" href="' + chHref(c.id) + '" data-chlink="' + c.id + '"><span>' + c.tc + '</span><span class="mono">' + c.n + '</span></a></li>';
    }).join("") + '</ul><h2>頁面</h2><ul>' + NAV.slice(1).map(function (n) {
      return '<li><a class="box" href="' + href(n.href) + '"' + (n.key === PAGE ? ' aria-current="page"' : '') + '><span>' + n.tc + '</span><span class="mono">→</span></a></li>';
    }).join("") + '<li><a class="box" href="' + href("places/") + '"><span>場所檔案</span><span class="mono">→</span></a></li></ul></div></div>';

  var drawer = '<div class="scrim" data-close-drawer></div><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" tabindex="-1">' +
    '<div class="d-head"><span class="kicker" id="drawer-title">這段話根據什麼？</span><button class="box" type="button" data-close-drawer>關閉</button></div>' +
    '<div class="d-body" data-drawer-body></div></aside>';

  var skip = '<a class="skip" href="#main">跳至正文</a>';

  document.body.insertAdjacentHTML("afterbegin", skip + '<div class="topband" aria-hidden="true"></div>' + corner + topnav + rail + mbar);
  document.body.insertAdjacentHTML("beforeend", motion + sheet + drawer);

  /* 減少動畫切換 */
  var mt = document.querySelector(".motion-toggle");
  mt.addEventListener("click", function () {
    var on = !doc.classList.contains("reduce-motion");
    doc.classList.toggle("reduce-motion", on);
    mt.setAttribute("aria-pressed", String(on));
    mt.querySelector(".sr-only").textContent = "（目前" + (on ? "開啟" : "關閉") + "）";
    try { localStorage.setItem(rmKey, on ? "1" : "0"); } catch (e) {}
    announce(on ? "已開啟減少動畫" : "已關閉減少動畫");
  });

  /* 狀態播報 */
  var live = el('<div class="sr-only" aria-live="polite" role="status"></div>');
  document.body.appendChild(live);
  function announce(msg) { live.textContent = ""; setTimeout(function () { live.textContent = msg; }, 30); }
  window.CITY.announce = announce;

  /* ---------------- 對話框（目錄、來源抽屜）焦點管理 ---------------- */
  function trap(container, e) {
    if (e.key !== "Tab") return;
    var f = container.querySelectorAll('a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  var sheetEl = document.querySelector(".sheet");
  var sheetTrigger = null;
  function openSheet(trigger) {
    sheetTrigger = trigger; sheetEl.classList.add("open");
    sheetEl.querySelector("[data-close-sheet]").focus();
  }
  function closeSheet() {
    sheetEl.classList.remove("open");
    if (sheetTrigger) sheetTrigger.focus();
  }
  document.querySelectorAll("[data-open-sheet]").forEach(function (b) { b.addEventListener("click", function () { openSheet(b); }); });
  sheetEl.addEventListener("click", function (e) {
    if (e.target === sheetEl || e.target.closest("[data-close-sheet]")) closeSheet();
    else if (e.target.closest("a")) sheetEl.classList.remove("open");
  });
  sheetEl.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSheet(); trap(sheetEl.querySelector(".panel"), e); });

  var drawerEl = document.querySelector(".drawer");
  var scrimEl = document.querySelector(".scrim");
  var drawerTrigger = null;
  function openSource(id, trigger) {
    var s = SOURCES[id];
    if (!s) return false;
    drawerTrigger = trigger;
    drawerEl.querySelector("[data-drawer-body]").innerHTML =
      '<p class="mono" style="color:var(--archive);margin-bottom:6px">' + id + '</p>' +
      '<h2 style="font-size:20px;line-height:1.5;margin-bottom:6px">' + s.title + '</h2>' +
      '<p class="muted" style="margin-bottom:0">' + s.org + '</p>' +
      '<dl><dt>本展用途</dt><dd>' + s.use + '</dd><dt>限制</dt><dd>' + s.limit + '</dd><dt>查閱</dt><dd>2026-11-13</dd>' +
      '<dt>連結</dt><dd><a href="' + s.url + '" target="_blank" rel="noopener">' + s.url + '</a></dd></dl>' +
      '<p style="font-size:15px" class="muted">可閱讀不代表可重新發布其圖片。連結若失效，請到 <a href="' + href("sources/#" + id) + '">資料與方法</a> 查看登錄。</p>';
    drawerEl.classList.add("open"); scrimEl.classList.add("open");
    drawerEl.focus();
    return true;
  }
  function closeDrawer() {
    drawerEl.classList.remove("open"); scrimEl.classList.remove("open");
    if (drawerTrigger) drawerTrigger.focus();
  }
  document.addEventListener("click", function (e) {
    var c = e.target.closest("[data-src]");
    if (c && !e.metaKey && !e.ctrlKey) {
      if (openSource(c.getAttribute("data-src"), c)) e.preventDefault();
    }
    if (e.target.closest("[data-close-drawer]")) closeDrawer();
  });
  drawerEl.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); trap(drawerEl, e); });
  window.CITY.openSource = openSource;

  /* 自動補齊引註連結 */
  document.querySelectorAll("a.cite[data-src]").forEach(function (a) {
    if (!a.getAttribute("href")) a.setAttribute("href", href("sources/#" + a.getAttribute("data-src")));
    if (!a.textContent.trim()) a.textContent = a.getAttribute("data-src");
    a.setAttribute("aria-label", "來源 " + a.getAttribute("data-src") + "，開啟來源說明");
  });

  /* ---------------- 章節進度 ---------------- */
  var cube = document.querySelector(".cube");
  var countEl = document.querySelector("[data-count]");
  var chapBtn = document.querySelector("[data-chapbtn]");
  var ROT = [
    "rotateX(-24deg) rotateY(36deg)", "rotateX(-24deg) rotateY(96deg)", "rotateX(-58deg) rotateY(156deg)",
    "rotateX(-24deg) rotateY(216deg)", "rotateX(-10deg) rotateY(276deg)", "rotateX(-40deg) rotateY(336deg)"
  ];
  function setChapter(idx) {
    if (idx < 0) {
      if (countEl) countEl.textContent = "— ／06";
      if (chapBtn) chapBtn.textContent = "目錄";
      document.querySelectorAll("[data-chlink]").forEach(function (a) { a.removeAttribute("aria-current"); });
      return;
    }
    var c = CHAPTERS[idx];
    if (cube) cube.style.transform = ROT[idx];
    if (countEl) countEl.textContent = c.n + "／06";
    if (chapBtn) chapBtn.textContent = "章節 " + (idx + 1) + "／6";
    document.querySelectorAll("[data-chlink]").forEach(function (a) {
      if (a.getAttribute("data-chlink") === c.id) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  var chapterEls = CHAPTERS.map(function (c) { return document.getElementById(c.id); }).filter(Boolean);
  if (chapterEls.length) {
    var onScroll = function () {
      var mid = window.innerHeight * 0.4, cur = -1;
      chapterEls.forEach(function (s, i) {
        var r = s.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) cur = CHAPTERS.findIndex(function (c) { return c.id === s.id; });
      });
      setChapter(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- 進場（只觸發顯示，不挾持捲動） ---------------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in", "open"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    document.querySelectorAll(".reveal, .booklet").forEach(function (n) { io.observe(n); });
  } else {
    document.querySelectorAll(".reveal, .booklet").forEach(function (n) { n.classList.add("in", "open"); });
  }

  /* ---------------- 等角線稿（原創抽象圖，不按比例） ---------------- */
  var C30 = Math.cos(Math.PI / 6), S30 = 0.5;
  function P(x, y, z, s) { return [(x - y) * C30 * s, (x + y) * S30 * s - z * s]; }
  function pts(arr) { return arr.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "); }
  var STY = {
    solid:  { stroke: "#111111", sw: 1.5, dash: "", fill: "#E2E2E2", top: "#FFFFFF", side: "#EDEDED" },
    paper:  { stroke: "#111111", sw: 1.5, dash: "", fill: "#FFFFFF", top: "#FFFFFF", side: "#F3F3F3" },
    dotted: { stroke: "#5C5C5C", sw: 1, dash: "1.5 3", fill: "none", top: "none", side: "none" },
    hypo:   { stroke: "#CF3F2B", sw: 2, dash: "5 4", fill: "rgba(207,63,43,0.12)", top: "rgba(207,63,43,0.16)", side: "rgba(207,63,43,0.08)" },
    ghost:  { stroke: "#CF3F2B", sw: 1, dash: "3 4", fill: "none", top: "none", side: "none" },
    memory: { stroke: "#3F6B4A", sw: 1.5, dash: "", fill: "rgba(63,107,74,0.14)", top: "rgba(63,107,74,0.18)", side: "rgba(63,107,74,0.1)" },
    archive:{ stroke: "#1F4E6B", sw: 1.5, dash: "", fill: "rgba(31,78,107,0.12)", top: "rgba(31,78,107,0.16)", side: "rgba(31,78,107,0.08)" },
    frame:  { stroke: "#111111", sw: 1, dash: "", fill: "none", top: "none", side: "none" },
    skin:   { stroke: "#111111", sw: 1, dash: "", fill: "rgba(255,255,255,0.35)", top: "rgba(255,255,255,0.45)", side: "rgba(255,255,255,0.3)" },
    wire:   { stroke: "#FFFFFF", sw: 1.2, dash: "", fill: "none", top: "none", side: "none" },
    wiredash:{ stroke: "#FFFFFF", sw: 1.2, dash: "4 4", fill: "none", top: "none", side: "none" }
  };
  function isoBox(b, s) {
    var st = STY[b.style || "solid"];
    var x = b.x, y = b.y, z = b.z || 0, w = b.w, d = b.d, h = b.h;
    var dash = st.dash ? ' stroke-dasharray="' + st.dash + '"' : "";
    var common = ' stroke="' + st.stroke + '" stroke-width="' + st.sw + '"' + dash + ' stroke-linejoin="round"';
    if (h === 0) {
      return '<polygon points="' + pts([P(x, y, z, s), P(x + w, y, z, s), P(x + w, y + d, z, s), P(x, y + d, z, s)]) + '" fill="' + st.top + '"' + common + '/>';
    }
    var top = [P(x, y, z + h, s), P(x + w, y, z + h, s), P(x + w, y + d, z + h, s), P(x, y + d, z + h, s)];
    var right = [P(x + w, y, z, s), P(x + w, y + d, z, s), P(x + w, y + d, z + h, s), P(x + w, y, z + h, s)];
    var left = [P(x, y + d, z, s), P(x + w, y + d, z, s), P(x + w, y + d, z + h, s), P(x, y + d, z + h, s)];
    var hidden = "";
    if (st.fill === "none") {
      hidden = '<polyline points="' + pts([P(x, y + d, z, s), P(x, y, z, s), P(x + w, y, z, s)]) + '" fill="none" stroke="' + st.stroke + '" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.6"/>' +
        '<line x1="' + P(x, y, z, s)[0] + '" y1="' + P(x, y, z, s)[1] + '" x2="' + P(x, y, z + h, s)[0] + '" y2="' + P(x, y, z + h, s)[1] + '" stroke="' + st.stroke + '" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.6"/>';
    }
    return '<g>' + hidden +
      '<polygon points="' + pts(right) + '" fill="' + st.fill + '"' + common + '/>' +
      '<polygon points="' + pts(left) + '" fill="' + st.side + '"' + common + '/>' +
      '<polygon points="' + pts(top) + '" fill="' + st.top + '"' + common + '/></g>';
  }
  function isoLine(l, s) {
    var a = P(l.x1, l.y1, l.z || 0, s), b = P(l.x2, l.y2, l.z || 0, s);
    var color = l.color || "#111111";
    return '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" stroke="' + color + '" stroke-width="' + (l.sw || 1.5) + '"' + (l.dash ? ' stroke-dasharray="' + l.dash + '"' : "") + ' stroke-linecap="round"/>';
  }
  function isoSVG(items, opt) {
    opt = opt || {};
    var s = opt.scale || 20;
    var sorted = items.slice().sort(function (a, b) {
      var ka = (a.x + (a.w || 0) / 2) + (a.y + (a.d || 0) / 2) + (a.z || 0) * 0.01 + (a.kind === "line" ? -100 : 0);
      var kb = (b.x + (b.w || 0) / 2) + (b.y + (b.d || 0) / 2) + (b.z || 0) * 0.01 + (b.kind === "line" ? -100 : 0);
      if (a.order != null || b.order != null) { ka = a.order != null ? a.order : ka; kb = b.order != null ? b.order : kb; }
      return ka - kb;
    });
    var ci = 0;
    var body = sorted.map(function (it) {
      var out = draw(it);
      return it.anim ? '<g class="chg" style="--i:' + (ci++) + '">' + out + '</g>' : out;
    }).join("");
    function draw(it) {
      if (it.kind === "line") return isoLine(it, s);
      if (it.kind === "hot") {
        var q = P(it.x, it.y, it.z || 0, s);
        var on = it.active ? "#CF3F2B" : "#111111";
        return '<g class="hot" data-hot="' + it.id + '" style="cursor:pointer"><circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="13" fill="transparent"/><circle class="pulse" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="9" fill="none" stroke="' + on + '" stroke-width="1.5"/><circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="9" fill="' + on + '" stroke="#FFFFFF" stroke-width="1.5"/><text x="' + q[0].toFixed(1) + '" y="' + (q[1] + 3.6).toFixed(1) + '" font-family="IBM Plex Mono, monospace" font-size="10" fill="#FFFFFF" text-anchor="middle">' + it.text + '</text></g>';
      }
      if (it.kind === "label") { var p = P(it.x, it.y, it.z || 0, s); return '<text x="' + p[0].toFixed(1) + '" y="' + p[1].toFixed(1) + '" font-family="IBM Plex Mono, monospace" font-size="' + (it.size || 11) + '" fill="' + (it.color || "#111111") + '" stroke="#FFFFFF" stroke-width="3" paint-order="stroke" text-anchor="middle">' + it.text + '</text>'; }
      return isoBox(it, s);
    }
    // 計算邊界
    var xs = [], ys = [];
    items.forEach(function (it) {
      var w = it.w || 0, d = it.d || 0, h = it.h || 0, z = it.z || 0;
      if (it.kind === "line") { [[it.x1, it.y1], [it.x2, it.y2]].forEach(function (q) { var p = P(q[0], q[1], it.z || 0, s); xs.push(p[0]); ys.push(p[1]); }); return; }
      if (it.kind === "hot" || it.kind === "label") { var pl = P(it.x, it.y, it.z || 0, s); xs.push(pl[0] - 30, pl[0] + 30); ys.push(pl[1] - 14, pl[1] + 10); return; }
      [[0, 0, 0], [w, 0, 0], [0, d, 0], [w, d, 0], [0, 0, h], [w, 0, h], [0, d, h], [w, d, h]].forEach(function (o) {
        var p = P(it.x + o[0], it.y + o[1], z + o[2], s); xs.push(p[0]); ys.push(p[1]);
      });
    });
    var pad = opt.pad != null ? opt.pad : 10;
    var minX = Math.min.apply(null, xs) - pad, maxX = Math.max.apply(null, xs) + pad;
    var minY = Math.min.apply(null, ys) - pad, maxY = Math.max.apply(null, ys) + pad;
    return '<svg viewBox="' + minX.toFixed(0) + " " + minY.toFixed(0) + " " + (maxX - minX).toFixed(0) + " " + (maxY - minY).toFixed(0) + '" ' +
      (opt.title ? 'role="img" aria-label="' + opt.title + '"' : 'aria-hidden="true"') + ' xmlns="http://www.w3.org/2000/svg">' + body + '</svg>';
  }
  window.CITY.isoSVG = isoSVG;

  /* 章節舞台上方露出的線稿物件 */
  var PEEKS = {
    ch01: [ { x: 0, y: 0, w: 3, d: 3, h: 2.4, style: "wire" }, { x: 0.5, y: 0.5, w: 3, d: 3, h: 2.4, style: "wiredash" }, { x: 1, y: 1, w: 3, d: 3, h: 2.4, style: "wiredash" } ],
    ch02: [ { x: 0, y: 0, w: 1.6, d: 1.2, h: 1, style: "wire" }, { x: 2, y: 0, w: 1.6, d: 1.2, h: 1, style: "wire" }, { x: 4, y: 0, w: 1.6, d: 1.2, h: 1, style: "wire" }, { x: 0, y: 2.2, w: 1.6, d: 1.2, h: 1, style: "wire" }, { x: 2, y: 2.2, w: 1.6, d: 1.2, h: 1, style: "wiredash" }, { x: 4, y: 2.2, w: 1.6, d: 1.2, h: 1, style: "wire" } ],
    ch03: [ { x: 0, y: 0, w: 3.2, d: 3.2, h: 0.4, style: "wire" }, { x: 0.2, y: 0.2, w: 2.8, d: 2.8, h: 0.4, z: 0.9, style: "wire" }, { x: 0.4, y: 0.4, w: 2.4, d: 2.4, h: 0.4, z: 1.8, style: "wiredash" }, { x: 0.6, y: 0.6, w: 2, d: 2, h: 0.4, z: 2.7, style: "wire" } ],
    ch04: [ { x: 1.1, y: 1.1, w: 1, d: 1, h: 5, style: "wire" }, { x: 0, y: 1.1, w: 1, d: 1, h: 1, z: 0.6, style: "wire" }, { x: 2.2, y: 1.1, w: 1, d: 1, h: 1, z: 1.6, style: "wire" }, { x: 1.1, y: 0, w: 1, d: 1, h: 1, z: 2.6, style: "wiredash" }, { x: 1.1, y: 2.2, w: 1, d: 1, h: 1, z: 3.4, style: "wire" }, { x: 0, y: 1.1, w: 1, d: 1, h: 1, z: 3.8, style: "wiredash" } ],
    ch05: [ { x: 0, y: 0, w: 6, d: 4, h: 0, style: "wire" }, { x: 0.5, y: 0.5, w: 1.5, d: 1, h: 1, style: "wire" }, { x: 2.5, y: 0.5, w: 1.5, d: 1, h: 1, style: "wiredash" }, { x: 4.2, y: 2.3, w: 1.4, d: 1.2, h: 1.4, style: "wiredash" }, { x: 0.5, y: 2.5, w: 1.5, d: 1, h: 1, style: "wire" } ],
    ch06: [ { kind: "line", x1: 0, y1: 2, x2: 7, y2: 2, color: "#FFFFFF", dash: "2 5", sw: 1.4 }, { x: 0.4, y: 0, w: 1.4, d: 1.4, h: 2.2, style: "wire" }, { x: 3, y: 2.8, w: 1.2, d: 1.2, h: 1.2, style: "wire" }, { x: 5.2, y: 0, w: 1.4, d: 1.4, h: 3, style: "wiredash" } ]
  };
  document.querySelectorAll("[data-peek]").forEach(function (n) {
    var k = n.getAttribute("data-peek");
    if (PEEKS[k]) n.innerHTML = isoSVG(PEEKS[k], { scale: 18 });
  });
})();
