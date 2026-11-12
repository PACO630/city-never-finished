/* 城市的未定稿：情境比較元件（2D 等值版＋按需開啟的 CSS 3D 空間實驗）
   2D 與 3D 共用同一份資料（Brief 第 10.7 節）。所有畫面為假設情境、非預測、示意模型。 */
(function () {
  "use strict";
  var CITY = window.CITY;
  if (!CITY) return;

  /* ---------- 基底（概念基底，非現況模型；數量為示意） ---------- */
  function stall(id, x, y) { return { id: id, layer: "L40", x: x, y: y, w: 1.8, d: 1.2, h: 0.9, style: "solid" }; }
  var BASE = [
    { id: "ground", layer: "L00", x: -3, y: -0.6, w: 22.6, d: 9.6, h: 0, style: "paper", order: -1000 },
    { id: "shell", layer: "L10", x: 0.4, y: 0.5, w: 12.2, d: 7.4, h: 3.0, style: "frame" },
    { id: "canA", layer: "L20", x: 0.8, y: 0.8, w: 10.8, d: 2.0, z: 2.1, h: 0.08, style: "skin" },
    { id: "canB", layer: "L20", x: 0.8, y: 5.4, w: 10.8, d: 2.0, z: 2.1, h: 0.08, style: "skin" },
    stall("A1", 1, 1.2), stall("A2", 3.2, 1.2), stall("A3", 5.4, 1.2), stall("A4", 7.6, 1.2), stall("A5", 9.8, 1.2),
    stall("B1", 1, 5.6), stall("B2", 3.2, 5.6), stall("B3", 5.4, 5.6), stall("B4", 7.6, 5.6), stall("B5", 9.8, 5.6),
    { id: "e1", layer: "L30", x: 3.6, y: 0.7, w: 0.6, d: 0.35, h: 1.3, style: "archive" },
    { id: "e2", layer: "L30", x: 8.0, y: 6.85, w: 0.6, d: 0.35, h: 1.3, style: "archive" },
    { id: "e3", layer: "L30", x: 3.6, y: 6.85, w: 0.6, d: 0.35, h: 1.3, style: "archive" },
    { id: "c1", layer: "L50", x: 2.9, y: 2.55, w: 0.4, d: 0.4, h: 0.32, style: "paper" },
    { id: "c2", layer: "L50", x: 7.2, y: 2.55, w: 0.4, d: 0.4, h: 0.32, style: "paper" },
    { id: "c3", layer: "L50", x: 5.0, y: 5.05, w: 0.4, d: 0.4, h: 0.32, style: "paper" },
    { id: "c4", layer: "L50", x: 9.4, y: 5.05, w: 0.4, d: 0.4, h: 0.32, style: "paper" },
    { id: "aisle", layer: "L60", kind: "line", x1: -0.2, y1: 4, x2: 13.4, y2: 4, color: "#171A1C", sw: 2.2 },
    { id: "lk85", layer: "L60", kind: "line", x1: 13.4, y1: 4, x2: 16.6, y2: 1.2, color: "#51585D", sw: 1.2, dash: "2 4" },
    { id: "lkst", layer: "L60", kind: "line", x1: 13.4, y1: 4, x2: 16.4, y2: 4, color: "#51585D", sw: 1.2, dash: "2 4" },
    { id: "lklr", layer: "L60", kind: "line", x1: 13.4, y1: 4, x2: 16.6, y2: 7.6, color: "#51585D", sw: 1.2, dash: "2 4" },
    { id: "lkmem", layer: "L60", kind: "line", x1: -0.2, y1: 4, x2: -1.4, y2: 4, color: "#51585D", sw: 1.2, dash: "2 4" },
    { id: "n85", layer: "L10", x: 16.6, y: 0.2, w: 0.9, d: 0.9, h: 4.2, style: "dotted" },
    { id: "nst", layer: "L10", x: 16.4, y: 3.4, w: 1.9, d: 1.3, h: 1.0, style: "dotted" },
    { id: "lrt", layer: "L60", kind: "line", x1: 15.8, y1: 8.2, x2: 19.4, y2: 8.2, color: "#51585D", sw: 2.4, dash: "8 4" },
    { id: "nlr", layer: "L60", x: 16.6, y: 7.2, w: 1.0, d: 0.7, h: 0.15, style: "dotted" },
    { id: "mem", layer: "L70", x: -2.6, y: 3.4, w: 1.2, d: 1.2, h: 0, style: "memory" }
  ];
  var HOTS = [
    { id: "h1", n: "1", layer: "L60", x: 12.2, y: 4, z: 0.2, t: "主通道（熟悉路徑示意）", type: "策展解釋", lb: "lb-interp",
      body: "示意的主通道，代表「熟悉的走法」。市場實際邊界、出入口與可進入空間需先現勘再定義（O01–O08 待紀錄），不把路邊店家一律歸入市場。", src: [] },
    { id: "h2", n: "2", layer: "L40", x: 2.1, y: 1.8, z: 2.8, t: "攤位分區", type: "假設情境", lb: "lb-hypo",
      body: "攤位數量與分組只是便於製作的示意，不代表現場攤位數；可切換的配置不承諾符合實際法規或容量。", src: [] },
    { id: "h3", n: "3", layer: "L30", x: 3.9, y: 0.9, z: 2.8, t: "設備與維護", type: "策展解釋", lb: "lb-interp",
      body: "以圖符表示設備與維護關係。沒有工程資料，不畫精確管線；排水、電力、消防與租賃不作未經專業確認的承諾。", src: [] },
    { id: "h4", n: "4", layer: "L20", x: 6.2, y: 6.4, z: 2.6, t: "遮棚與可見邊界", type: "策展解釋", lb: "lb-interp",
      body: "遮棚與門面和結構分組處理。現有與假設以實線／虛線區別；目前全部屬於概念基底，待現場照片（P05–P08）補齊。", src: [] },
    { id: "h5", n: "5", layer: "L10", x: 17.05, y: 0.65, z: 4.6, t: "85 大樓（敘事節點）", type: "資料", lb: "lb-data",
      body: "只做可辨認的簡化外殼。本展不判定室內營運、空置、所有權或觀景設施的現況；觀光頁只作旅遊敘事線索。", src: ["S02"] },
    { id: "h6", n: "6", layer: "L10", x: 17.35, y: 4.05, z: 1.4, t: "高雄車站（敘事節點）", type: "資料", lb: "lb-data",
      body: "工程節點與設計意圖分別參見鐵道局施工頁與 Mecanoo 專案頁，兩者用途不同。這裡不畫成輕軌直接停靠站。", src: ["S03", "S04"] },
    { id: "h7", n: "7", layer: "L60", x: 16.0, y: 8.2, z: 0.3, t: "輕軌（敘事節點）", type: "資料", lb: "lb-data",
      body: "營運方分開記載 2024-01-01 試營運成圓與 2024-02-26 全線正式營運。這條線是「敘事連結」，不是營運線，也不代表步行距離。", src: ["S05"] },
    { id: "h8", n: "8", layer: "L70", x: -2.0, y: 4.0, z: 0.4, t: "記憶線索 M01", type: "策展解釋", lb: "lb-interp",
      body: "前次討論出現一對賣碗粿的老夫婦。這是一條未核實的記憶線索，不是人物故事；不暗示他們位於自由黃昏市場，因此放在場景之外。", src: [] }
  ];
  var LAYERS = [
    ["L10", "外框與長期量體"], ["L20", "遮棚與邊界"], ["L30", "設備與維護"], ["L40", "攤位與活動分區"],
    ["L50", "物件"], ["L60", "路徑與敘事連結"], ["L70", "記憶錨點"], ["L80", "假設覆層"]
  ];

  /* ---------- 情境（Brief 第 10.4 節） ---------- */
  var NOT_SIM = "財務、法定審查、結構安全、真實人流與生計結果。";
  var SCN = {
    A: { label: "A 局部調整與日常維持", short: "局部調整",
      t0: { ops: {}, change: "概念基底：兩列攤位、一條主通道、遮棚與設備位置皆為示意。", depends: "—", burden: "—" },
      t15: { ops: { restyle: { e1: "hypo", e2: "hypo" }, add: [lab(3.9, 0.6, 2.2, "設備更新"), lab(8.3, 7.2, 2.2, "設備更新")] },
        change: "兩組設備註記更新（紅色虛線），攤位分區維持不變。", depends: "假設可持續維護，且使用者同意。", burden: "更新費用與施工干擾由誰承擔，尚待討論。穩定不等於沒有工作。" },
      t30: { ops: { restyle: { e1: "hypo", e2: "hypo" }, ghost: ["A5"], add: [ { id: "zA", layer: "L80", x: 9.6, y: 0.9, w: 2.6, d: 1.8, h: 0, style: "hypo" }, lab(10.9, 1.8, 0.4, "活動轉換"), lab(3.9, 0.6, 2.2, "設備更新") ], emph: ["aisle"] },
        change: "A 列末端一處轉為活動空間（原攤位留虛線殘影），熟悉的主通道保留。", depends: "同上，另需對這次活動轉換的協商。", burden: "原位置使用者的去留與調適成本。" }
    },
    B: { label: "B 活動重組與共享空間", short: "活動重組",
      t0: { ops: {}, change: "概念基底：與 A 相同的起點。", depends: "—", burden: "—" },
      t15: { ops: { ghost: ["A3", "A4"], add: [ { id: "zB", layer: "L80", x: 5.4, y: 0.9, w: 4.1, d: 2.2, h: 0, style: "hypo" }, { id: "A3n", layer: "L80", x: 12.9, y: 1.0, w: 1.3, d: 1.3, h: 0.9, style: "hypo" }, { id: "A4n", layer: "L80", x: 12.9, y: 5.8, w: 1.3, d: 1.3, h: 0.9, style: "hypo" }, lab(7.4, 2.0, 0.3, "彈性活動區") ] },
        change: "兩組攤位重排到末端（原位置留虛線殘影），騰出一處彈性活動區。", depends: "可取得協商、儲放及管理資源。", burden: "被移動者的適應成本、熟客找不到位置、使用衝突。這不是更高分的方案。" },
      t30: { ops: { ghost: ["A3", "A4"], add: [ { id: "zB", layer: "L80", x: 5.4, y: 0.9, w: 4.1, d: 2.2, h: 0, style: "hypo" }, { id: "zBc", layer: "L80", x: 6.0, y: 1.2, w: 2.6, d: 1.4, h: 1.6, style: "hypo" }, { id: "A3n", layer: "L80", x: 12.9, y: 1.0, w: 1.3, d: 1.3, h: 0.9, style: "hypo" }, { id: "A4n", layer: "L80", x: 12.9, y: 5.8, w: 1.3, d: 1.3, h: 0.9, style: "hypo" }, lab(7.3, 1.9, 2.4, "用途再次調整"), lab(1.9, 6.2, 1.4, "固定位置"), lab(10.7, 6.2, 1.4, "固定位置") ], emph: ["B1", "B5"] },
        change: "活動區用途再次調整（加設臨時遮棚示意），部分攤位位置固定。", depends: "持續的管理與決策程序；誰能提出下一次調整？", burden: "管理工作量增加；一方的彈性可能成為另一方的不穩定。" }
    },
    C: { label: "C 暫緩空間變動", short: "暫緩變動",
      t0: { ops: {}, change: "概念基底：與 A、B 相同的起點。", depends: "—", burden: "—" },
      t15: { ops: { add: [ { id: "m1", layer: "L80", x: 3.3, y: 0.4, w: 1.2, d: 0.9, h: 0, style: "hypo" }, { id: "m2", layer: "L80", x: 7.7, y: 6.6, w: 1.2, d: 0.9, h: 0, style: "hypo" }, { id: "m3", layer: "L80", x: 3.3, y: 6.6, w: 1.2, d: 0.9, h: 0, style: "hypo" }, lab(3.9, 0.3, 0.2, "維護工作"), lab(8.3, 7.6, 0.2, "維護工作") ] },
        change: "量體與配置不變，只顯示維護工作的註記。", depends: "假設使用者偏好穩定。", burden: "日常維修的人力與費用；既有的不便也可能延續。" },
      t30: { ops: { add: [ { id: "m1", layer: "L80", x: 3.3, y: 0.4, w: 1.2, d: 0.9, h: 0, style: "hypo" }, { id: "m2", layer: "L80", x: 7.7, y: 6.6, w: 1.2, d: 0.9, h: 0, style: "hypo" }, { id: "m3", layer: "L80", x: 3.3, y: 6.6, w: 1.2, d: 0.9, h: 0, style: "hypo" }, { id: "q1", layer: "L80", x: 0.7, y: 5.3, w: 11.2, d: 1.8, h: 0, style: "ghost" }, lab(6.3, 7.4, 0.2, "待討論：既有不便是否延續？") ] },
        change: "保持配置，並標出尚待討論的項目。", depends: "同上。", burden: "避免把「不改」浪漫化：誰因為不改而持續不便？" }
    }
  };
  function lab(x, y, z, text) { return { kind: "label", layer: "L80", x: x, y: y, z: z, text: text, color: "#A33C24", order: 900 }; }

  /* ---------- 歷史紀錄（只列有依據的節點，不插值） ---------- */
  var HIST = [
    { track: "高雄車站", date: "依來源頁所列", text: "鐵道局施工階段頁分列高雄車站工程竣工與後續驗收改善等事項（頁面最後更新 2026-10-28）。工程竣工、啟用、驗收是不同欄位。", src: ["S03"], hot: "h6" },
    { track: "輕軌", date: "2024-01-01", text: "營運方記載：試營運成圓。", src: ["S05"], hot: "h7" },
    { track: "輕軌", date: "2024-02-26", text: "營運方記載：全線正式營運。與試營運分開記載。", src: ["S05"], hot: "h7" },
    { track: "自由黃昏市場", date: "—", gap: true, text: "這個時段尚無足夠資料，不補畫為歷史。", src: [], hot: "h1" },
    { track: "85 大樓", date: "—", gap: true, text: "這個時段尚無足夠資料，不補畫為歷史。", src: [], hot: "h5" }
  ];

  /* ---------- 狀態組合 ---------- */
  function compose(st) {
    var items = BASE.map(function (b) { var c = {}; for (var k in b) c[k] = b[k]; return c; });
    var hist = st.mode === "history";
    var ops = hist ? {} : SCN[st.scn][st.t].ops;
    var byId = {}; items.forEach(function (it) { byId[it.id] = it; });
    if (ops.restyle) Object.keys(ops.restyle).forEach(function (id) { if (byId[id]) { byId[id].style = ops.restyle[id]; byId[id].changed = true; } });
    if (ops.ghost) ops.ghost.forEach(function (id) { if (byId[id]) { byId[id].style = "ghost"; byId[id].layer = "L80"; byId[id].changed = true; } });
    if (ops.emph) ops.emph.forEach(function (id) { if (byId[id]) { if (byId[id].kind === "line") { byId[id].sw = 3.4; } else { byId[id].style = "paper"; byId[id].emph = true; } } });
    (ops.add || []).forEach(function (a) { var c = {}; for (var k in a) c[k] = a[k]; c.changed = true; items.push(c); });
    if (!st.resources) {
      items.forEach(function (it) {
        if (it.changed && it.style === "hypo") it.style = "dotted";
        if (it.kind === "label" && it.layer === "L80") it.color = "#51585D";
      });
    }
    // 圖層過濾
    items = items.filter(function (it) { return it.layer === "L00" || st.layers[it.layer] !== false; });
    // 熱點
    HOTS.forEach(function (h) {
      if (st.layers[h.layer] === false) return;
      items.push({ kind: "hot", id: h.id, x: h.x, y: h.y, z: h.z, text: h.n, order: 1000, active: st.hot === h.id });
    });
    // 敘事節點標籤
    if (st.layers.L60 !== false) {
      items.push({ kind: "label", layer: "L90", x: 17.6, y: 0.2, z: 5.6, text: "85 大樓", order: 950 });
      items.push({ kind: "label", layer: "L90", x: 18.7, y: 3.2, z: 1.8, text: "高雄車站", order: 950 });
      items.push({ kind: "label", layer: "L90", x: 19.8, y: 8.2, z: 1.6, text: "輕軌（敘事連結）", order: 950 });
    }
    if (st.layers.L70 !== false) items.push({ kind: "label", layer: "L90", x: -2.0, y: 4.0, z: 2.6, text: "記憶線索", color: "#53634B", order: 950 });
    return items;
  }

  /* ---------- 元件 ---------- */
  function Comp(root) {
    var full = root.getAttribute("data-scenario") === "full";
    var ROOT = CITY.ROOT;
    var st = { mode: "hypo", scn: "A", t: "t0", resources: true, hot: null, layers: {}, view: "2d", cam: "overview", histIdx: 0 };
    LAYERS.forEach(function (l) { st.layers[l[0]] = true; });
    var uid = Math.random().toString(36).slice(2, 7);

    var tpl =
      '<div class="xp-status" role="note"><span class="lb lb-hypo">假設情境</span><span>非預測｜非都市計畫｜示意模型</span><span class="xp-base mono">t0＝概念基底，非現況模型</span></div>' +
      '<div class="xp-modes" role="group" aria-label="模式">' +
        '<button class="box" type="button" data-mode="hypo" aria-pressed="true">假設情境</button>' +
        '<button class="box" type="button" data-mode="history" aria-pressed="false">歷史紀錄</button>' +
        (full ? '<span class="xp-spacer"></span><button class="box" type="button" data-view="2d" aria-pressed="true">2D 比較</button><button class="box" type="button" data-view="3d" aria-pressed="false">開啟空間實驗</button>' : '') +
      '</div>' +
      '<div class="xp-main">' +
        '<div class="xp-canvas">' +
          '<div class="xp-2d" data-2d></div>' +
          (full ? '<div class="xp-3d" data-3d hidden><div class="xp-3d-msg mono" data-3dmsg>正在載入簡化模型，文字仍可閱讀。</div><div class="xp-viewport" data-vp tabindex="-1"><div class="xp-world" data-world></div></div></div>' : '') +
          '<div class="xp-stamp mono" aria-hidden="true">假設情境｜非預測｜示意模型｜不按比例</div>' +
          '<div class="xp-cond" data-cond hidden>此結果依賴尚未確認的條件</div>' +
        '</div>' +
        '<aside class="xp-panel" aria-live="polite" data-panel></aside>' +
      '</div>' +
      '<div class="xp-controls" data-controls-hypo>' +
        '<fieldset><legend>情境</legend><div class="seg">' +
          ['A', 'B', 'C'].map(function (k) { return '<label class="box radio"><input type="radio" name="scn-' + uid + '" value="' + k + '"' + (k === 'A' ? ' checked' : '') + '>' + SCN[k].label + '</label>'; }).join('') +
        '</div></fieldset>' +
        '<fieldset><legend>假設時間節點（離散，不插值）</legend><div class="seg">' +
          ['t0', 't15', 't30'].map(function (k) { return '<label class="box radio"><input type="radio" name="t-' + uid + '" value="' + k + '"' + (k === 't0' ? ' checked' : '') + '>' + (k === 't0' ? 't0 概念基底' : k.replace('t', 't+')) + '</label>'; }).join('') +
        '</div></fieldset>' +
        '<fieldset><legend>條件</legend><div class="seg">' +
          '<label class="box radio"><input type="radio" name="res-' + uid + '" value="1" checked>有協商與維護資源</label>' +
          '<label class="box radio"><input type="radio" name="res-' + uid + '" value="0">條件尚未確認</label>' +
        '</div></fieldset>' +
      '</div>' +
      '<div class="xp-controls" data-controls-hist hidden>' +
        '<div class="seg"><button class="box" type="button" data-hist="-1">上一筆</button><button class="box" type="button" data-hist="1">下一筆</button><span class="mono xp-histpos" data-histpos></span></div>' +
        '<p class="caption">車站工程與輕軌營運各有獨立軌道，不以某設施日期替另一設施定年；市場與大樓沒有足夠資料，不補出成長動畫。</p>' +
      '</div>' +
      '<details class="xp-more"><summary class="box">圖層與熱點清單（與畫面等值）</summary><div class="xp-more-in">' +
        '<fieldset><legend>圖層</legend><div class="xp-layers">' + LAYERS.map(function (l) {
          return '<label><input type="checkbox" data-layer="' + l[0] + '" checked> <span class="mono">' + l[0] + '</span> ' + l[1] + '</label>';
        }).join('') + '</div></fieldset>' +
        '<fieldset><legend>熱點（查看此處的依據與限制）</legend><ol class="xp-hots">' + HOTS.map(function (h) {
          return '<li><button class="box" type="button" data-hotbtn="' + h.id + '"><span class="mono">' + h.n + '</span>&nbsp;' + h.t + '</button></li>';
        }).join('') + '</ol></fieldset>' +
      '</div></details>' +
      (full ? '<div class="xp-cam" data-cam hidden><div class="seg">' +
          '<button class="box" type="button" data-camset="overview" aria-pressed="true">總覽</button>' +
          '<button class="box" type="button" data-camset="activity" aria-pressed="false">活動層</button>' +
          '<button class="box" type="button" data-camset="route" aria-pressed="false">路徑層</button>' +
          '<button class="box" type="button" data-orbit aria-pressed="false">進入旋轉操作</button>' +
          '<button class="box" type="button" data-zoom="1" aria-label="放大">＋</button><button class="box" type="button" data-zoom="-1" aria-label="縮小">－</button>' +
        '</div><p class="caption" data-orbithelp>滾輪維持捲動網頁。按「進入旋轉操作」後可拖曳旋轉，按 Escape 或「結束操作」離開。</p></div>' : '') +
      '<div class="seg xp-foot"><button class="box" type="button" data-reset>回到基準狀態</button>' +
        (full ? '' : '<a class="box primary" href="' + ROOT + 'explore/">開啟空間實驗<span class="arrow">→</span></a>') +
      '</div>';
    root.innerHTML = tpl;
    root.classList.add("xp", full ? "xp-full" : "xp-compact");

    var q = function (s) { return root.querySelector(s); };
    var qa = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
    var panel = q("[data-panel]");

    function srcLinks(arr) {
      return arr.map(function (s) { return '<a class="cite" data-src="' + s + '" href="' + ROOT + 'sources/#' + s + '">' + s + '</a>'; }).join(" ");
    }

    function renderPanel() {
      var h = st.hot && HOTS.filter(function (x) { return x.id === st.hot; })[0];
      var html = "";
      if (st.mode === "history") {
        var n = HIST[st.histIdx];
        html += '<h3 class="xp-h">歷史紀錄</h3><p class="mono xp-track">' + n.track + '｜' + n.date + '</p>' +
          '<p>' + (n.gap ? '<span class="lb lb-pending">資料空缺</span> ' : '<span class="lb lb-data">資料</span> ') + n.text + ' ' + srcLinks(n.src) + '</p>' +
          '<p class="caption">歷史模式只列有依據的日期節點，以上一筆／下一筆切換；畫面維持概念基底，不做時間動畫。</p>';
      } else {
        var s = SCN[st.scn][st.t];
        html += '<h3 class="xp-h">' + SCN[st.scn].label + '｜' + (st.t === "t0" ? "t0 概念基底" : st.t.replace("t", "t+")) + '</h3>' +
          '<dl class="xp-dl">' +
          '<dt>你選擇的條件</dt><dd>' + SCN[st.scn].short + '，' + (st.t === "t0" ? "t0" : st.t.replace("t", "t+")) + '，' + (st.resources ? "有協商與維護資源" : "條件尚未確認") + '</dd>' +
          '<dt>畫面如何改變</dt><dd>' + s.change + (st.resources ? "" : "（此結果依賴尚未確認的條件，變動以點線表示。）") + '</dd>' +
          '<dt>依賴什麼</dt><dd>' + s.depends + '</dd>' +
          '<dt>可能由誰負擔</dt><dd>' + s.burden + '</dd>' +
          '<dt>本次沒有模擬的部分</dt><dd>' + NOT_SIM + '</dd></dl>';
      }
      if (h) {
        html += '<div class="xp-hotinfo"><p class="mono">熱點 ' + h.n + '｜' + h.t + '</p><p><span class="lb ' + h.lb + '">' + h.type + '</span></p><p>' + h.body + ' ' + srcLinks(h.src) + '</p>' +
          '<button class="box" type="button" data-hotclose>收合此處說明</button></div>';
      }
      var hidden = LAYERS.filter(function (l) { return !st.layers[l[0]]; }).map(function (l) { return l[0] + " " + l[1]; });
      html += '<p class="caption xp-alt">畫面文字說明：概念基底包含兩列示意攤位、主通道、遮棚、設備圖符與物件；85 大樓、高雄車站、輕軌與記憶線索是場景外的敘事節點，不表示真實距離。' +
        (hidden.length ? '目前隱藏的圖層：' + hidden.join("、") + '。' : '目前顯示全部圖層。') + '</p>';
      panel.innerHTML = html;
    }

    function render2D() {
      var items = compose(st);
      q("[data-2d]").innerHTML = CITY.isoSVG(items, { scale: full ? 30 : 26, pad: 16, title: "情境示意圖：" + (st.mode === "history" ? "歷史紀錄模式，概念基底" : SCN[st.scn].label + " " + st.t) });
      qa("[data-2d] .hot").forEach(function (g) {
        g.addEventListener("click", function () { selectHot(g.getAttribute("data-hot")); });
      });
    }

    /* ---------- CSS 3D ---------- */
    var U = 34, OX = 3.4, OY = 0.8;
    var CAMS = { overview: { rx: 58, rz: -38, s: 1 }, activity: { rx: 40, rz: -18, s: 1.35 }, route: { rx: 0, rz: 0, s: 0.95 } };
    var cam = { rx: 58, rz: -38, s: 1 };
    var FACE = {
      solid: ["#FBFAF6", "#E6E5DF", "#D8D9D3", "1px solid #171A1C"],
      paper: ["#FBFAF6", "#F1EFE8", "#E9E7E0", "1px solid #171A1C"],
      skin: ["rgba(251,250,246,.55)", "rgba(251,250,246,.35)", "rgba(251,250,246,.35)", "1px solid #171A1C"],
      frame: ["transparent", "transparent", "transparent", "1px solid #171A1C"],
      dotted: ["transparent", "transparent", "transparent", "1px dotted #51585D"],
      hypo: ["rgba(163,60,36,.16)", "rgba(163,60,36,.1)", "rgba(163,60,36,.1)", "2px dashed #A33C24"],
      ghost: ["transparent", "transparent", "transparent", "1px dashed #A33C24"],
      memory: ["rgba(83,99,75,.2)", "rgba(83,99,75,.12)", "rgba(83,99,75,.12)", "1.5px solid #53634B"],
      archive: ["rgba(36,77,99,.25)", "rgba(36,77,99,.15)", "rgba(36,77,99,.18)", "1.5px solid #244D63"]
    };
    function face(cls, css, f) {
      return '<div class="fc ' + cls + '" style="' + css + 'background:' + f.bg + ';border:' + f.b + '"></div>';
    }
    function box3d(it) {
      var F = FACE[it.style] || FACE.solid;
      var W = it.w * U, D = it.d * U, H = it.h * U, Z = (it.z || 0) * U;
      var x = (it.x + OX) * U, y = (it.y + OY) * U;
      var html = '<div class="b3" style="left:' + x + 'px;top:' + y + 'px;width:' + W + 'px;height:' + D + 'px;transform:translateZ(' + Z + 'px)">';
      html += face("top", "width:" + W + "px;height:" + D + "px;transform:translateZ(" + H + "px);", { bg: F[0], b: F[3] });
      if (H > 0) {
        html += face("s", "top:" + (D - H) + "px;width:" + W + "px;height:" + H + "px;transform-origin:50% 100%;transform:rotateX(-90deg);", { bg: F[1], b: F[3] });
        html += face("s", "top:" + (-H) + "px;width:" + W + "px;height:" + H + "px;transform-origin:50% 100%;transform:rotateX(-90deg);", { bg: F[1], b: F[3] });
        html += face("s", "left:" + (-H) + "px;width:" + H + "px;height:" + D + "px;transform-origin:100% 50%;transform:rotateY(90deg);", { bg: F[2], b: F[3] });
        html += face("s", "left:" + (W - H) + "px;width:" + H + "px;height:" + D + "px;transform-origin:100% 50%;transform:rotateY(90deg);", { bg: F[2], b: F[3] });
      }
      return html + '</div>';
    }
    function line3d(it) {
      var x1 = (it.x1 + OX) * U, y1 = (it.y1 + OY) * U, x2 = (it.x2 + OX) * U, y2 = (it.y2 + OY) * U;
      var len = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
      var border = (it.dash ? "dashed " : "solid ") + (it.color || "#171A1C");
      return '<div class="l3" style="left:' + x1 + 'px;top:' + y1 + 'px;width:' + len + 'px;border-top:' + Math.max(1.5, it.sw || 1.5) + 'px ' + border + ';transform:translateZ(1px) rotate(' + ang + 'deg)"></div>';
    }
    function bill(it, inner, cls) {
      var x = (it.x + OX) * U, y = (it.y + OY) * U, z = (it.z || 0) * U;
      return '<div class="bb ' + (cls || "") + '" style="left:' + x + 'px;top:' + y + 'px;transform:translate3d(-50%,-50%,' + z + 'px) rotateZ(calc(var(--rz) * -1)) rotateX(calc(var(--rx) * -1))">' + inner + '</div>';
    }
    function render3D() {
      var world = q("[data-world]");
      if (!world) return;
      var items = compose(st);
      var html = "";
      items.forEach(function (it) {
        if (it.kind === "line") html += line3d(it);
        else if (it.kind === "label") html += bill(it, '<span style="color:' + (it.color || "#171A1C") + '">' + it.text + '</span>', "lbl3");
        else if (it.kind === "hot") html += bill(it, '<button type="button" class="hot3' + (it.active ? " on" : "") + '" data-hot3="' + it.id + '" aria-label="熱點 ' + it.text + '">' + it.text + '</button>', "hotbb");
        else html += box3d(it);
      });
      world.style.width = 23 * U + "px"; world.style.height = 10 * U + "px";
      world.innerHTML = html;
      applyCam();
    }
    function applyCam() {
      var world = q("[data-world]");
      if (!world) return;
      var vp = q("[data-vp]");
      var fit = Math.min(1, (vp.clientWidth - 20) / (23 * U * 0.95));
      world.style.setProperty("--rx", cam.rx + "deg");
      world.style.setProperty("--rz", cam.rz + "deg");
      world.style.transform = "translate(-50%,-50%) scale(" + (cam.s * fit).toFixed(3) + ") rotateX(" + cam.rx + "deg) rotateZ(" + cam.rz + "deg)";
    }

    function render() {
      renderPanel();
      if (st.view === "3d") render3D(); else render2D();
      q("[data-cond]").hidden = st.resources || st.mode === "history";
      root.querySelector(".xp-status .lb").textContent = st.mode === "history" ? "歷史紀錄" : "假設情境";
      root.querySelector(".xp-status .lb").className = "lb " + (st.mode === "history" ? "lb-data" : "lb-hypo");
      var hp = q("[data-histpos]"); if (hp) hp.textContent = (st.histIdx + 1) + "／" + HIST.length;
    }

    function selectHot(id) {
      st.hot = st.hot === id ? null : id;
      qa("[data-hotbtn]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-hotbtn") === st.hot)); });
      render();
      if (st.hot) CITY.announce("已選取熱點：" + HOTS.filter(function (h) { return h.id === id; })[0].t);
    }

    /* ---------- 事件 ---------- */
    root.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name && t.name.indexOf("scn-") === 0) st.scn = t.value;
      if (t.name && t.name.indexOf("t-") === 0) st.t = t.value;
      if (t.name && t.name.indexOf("res-") === 0) st.resources = t.value === "1";
      if (t.hasAttribute("data-layer")) st.layers[t.getAttribute("data-layer")] = t.checked;
      qa("label.radio").forEach(function (l) { l.classList.toggle("is-on", l.querySelector("input").checked); });
      render();
      if (t.type === "radio") CITY.announce("已切換：" + SCN[st.scn].label + "，" + (st.t === "t0" ? "t0 概念基底" : st.t.replace("t", "t+")) + "。" + SCN[st.scn][st.t].change);
    });
    qa("label.radio").forEach(function (l) { l.classList.toggle("is-on", l.querySelector("input").checked); });

    root.addEventListener("click", function (e) {
      var b;
      if ((b = e.target.closest("[data-mode]"))) {
        st.mode = b.getAttribute("data-mode");
        qa("[data-mode]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        q("[data-controls-hypo]").hidden = st.mode !== "hypo";
        q("[data-controls-hist]").hidden = st.mode !== "history";
        if (st.mode === "history") st.hot = HIST[st.histIdx].hot;
        render();
        CITY.announce(st.mode === "history" ? "已切換到歷史紀錄模式" : "已切換到假設情境模式");
      }
      if ((b = e.target.closest("[data-hist]"))) {
        st.histIdx = (st.histIdx + Number(b.getAttribute("data-hist")) + HIST.length) % HIST.length;
        st.hot = HIST[st.histIdx].hot;
        render();
        CITY.announce(HIST[st.histIdx].track + " " + HIST[st.histIdx].date + "：" + HIST[st.histIdx].text);
      }
      if ((b = e.target.closest("[data-hotbtn]"))) selectHot(b.getAttribute("data-hotbtn"));
      if ((b = e.target.closest("[data-hot3]"))) selectHot(b.getAttribute("data-hot3"));
      if (e.target.closest("[data-hotclose]")) selectHot(st.hot);
      if (e.target.closest("[data-reset]")) reset();
      if ((b = e.target.closest("[data-view]"))) setView(b.getAttribute("data-view"));
      if ((b = e.target.closest("[data-camset]"))) {
        var c = CAMS[b.getAttribute("data-camset")]; cam = { rx: c.rx, rz: c.rz, s: c.s };
        qa("[data-camset]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        applyCam();
      }
      if ((b = e.target.closest("[data-zoom]"))) { cam.s = Math.max(0.7, Math.min(1.8, cam.s + Number(b.getAttribute("data-zoom")) * 0.15)); applyCam(); }
      if ((b = e.target.closest("[data-orbit]"))) setOrbit(b.getAttribute("aria-pressed") !== "true");
    });

    function reset() {
      st.scn = "A"; st.t = "t0"; st.resources = true; st.hot = null; st.mode = "hypo"; st.histIdx = 0;
      LAYERS.forEach(function (l) { st.layers[l[0]] = true; });
      qa("input[type=radio]").forEach(function (i) { i.checked = i.value === "A" || i.value === "t0" || i.value === "1"; });
      qa("input[data-layer]").forEach(function (i) { i.checked = true; });
      qa("label.radio").forEach(function (l) { l.classList.toggle("is-on", l.querySelector("input").checked); });
      qa("[data-mode]").forEach(function (x) { x.setAttribute("aria-pressed", String(x.getAttribute("data-mode") === "hypo")); });
      q("[data-controls-hypo]").hidden = false; q("[data-controls-hist]").hidden = true;
      cam = { rx: CAMS.overview.rx, rz: CAMS.overview.rz, s: 1 };
      render();
      CITY.announce("已回到基準狀態");
    }

    /* 模型入口：未載入／載入中／可用／失敗 */
    function supports3D() { return window.CSS && CSS.supports && CSS.supports("transform-style", "preserve-3d"); }
    function setView(v) {
      if (!full) return;
      var three = q("[data-3d]"), two = q("[data-2d]"), msg = q("[data-3dmsg]");
      qa("[data-view]").forEach(function (x) { x.setAttribute("aria-pressed", String(x.getAttribute("data-view") === v)); });
      if (v === "3d") {
        three.hidden = false; two.hidden = true; q("[data-cam]").hidden = false;
        msg.hidden = false; msg.textContent = "正在載入簡化模型，文字仍可閱讀。";
        if (!supports3D()) {
          msg.textContent = "模型暫時無法顯示。改用 2D 比較，內容相同。";
          setTimeout(function () { setView("2d"); }, 1600);
          return;
        }
        st.view = "3d";
        requestAnimationFrame(function () { render(); msg.hidden = true; CITY.announce("空間實驗已開啟。可用總覽、活動層、路徑層三個視角。"); });
        try { localStorage.setItem("city-view", "3d"); } catch (e) {}
      } else {
        setOrbit(false);
        three.hidden = true; two.hidden = false; q("[data-cam]").hidden = true;
        st.view = "2d"; render();
        try { localStorage.setItem("city-view", "2d"); } catch (e) {}
      }
    }

    /* 旋轉操作：只有明確進入後才處理拖曳；Escape 離開 */
    var orbit = false, drag = null;
    function setOrbit(on) {
      var b = q("[data-orbit]"); if (!b) return;
      orbit = on; b.setAttribute("aria-pressed", String(on)); b.textContent = on ? "結束操作" : "進入旋轉操作";
      var vp = q("[data-vp]"); vp.classList.toggle("orbiting", on);
      if (on) { vp.focus(); CITY.announce("已進入旋轉操作，可拖曳或用方向鍵，按 Escape 結束。"); }
    }
    if (full) {
      var vp = q("[data-vp]");
      vp.addEventListener("pointerdown", function (e) { if (!orbit || e.target.closest("button")) return; drag = { x: e.clientX, y: e.clientY, rx: cam.rx, rz: cam.rz }; vp.setPointerCapture(e.pointerId); });
      vp.addEventListener("pointermove", function (e) {
        if (!drag) return;
        cam.rz = drag.rz + (e.clientX - drag.x) * 0.35;
        cam.rx = Math.max(0, Math.min(70, drag.rx - (e.clientY - drag.y) * 0.3));
        applyCam();
      });
      vp.addEventListener("pointerup", function () { drag = null; });
      vp.addEventListener("pointercancel", function () { drag = null; });
      root.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && orbit) { setOrbit(false); q("[data-orbit]").focus(); }
        if (orbit && document.activeElement === vp) {
          if (e.key === "ArrowLeft") { cam.rz -= 8; applyCam(); e.preventDefault(); }
          if (e.key === "ArrowRight") { cam.rz += 8; applyCam(); e.preventDefault(); }
          if (e.key === "ArrowUp") { cam.rx = Math.max(0, cam.rx - 6); applyCam(); e.preventDefault(); }
          if (e.key === "ArrowDown") { cam.rx = Math.min(70, cam.rx + 6); applyCam(); e.preventDefault(); }
        }
      });
      window.addEventListener("resize", applyCam);
      // 不在視窗中時不重算
      document.addEventListener("visibilitychange", function () { if (!document.hidden && st.view === "3d") applyCam(); });
    }

    render();
    return { reset: reset };
  }

  document.querySelectorAll("[data-scenario]").forEach(function (n) { Comp(n); });
})();
