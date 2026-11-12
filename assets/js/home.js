/* 首頁：索引預覽、第一章時間窗口、第三章層次切換、第六章提問卡 */
(function () {
  "use strict";
  var CITY = window.CITY;

  /* ---------- 索引預覽（Brief 第 04.2 表） ---------- */
  var PV = {
    ch01: { lead: "一張照片能留下城市的樣子，卻不能告訴我們它是否停止改變。", from: "城市有一張可代表自己的樣子", to: "視角與時間窗口會選擇性地顯示變化", act: "同機位影像或有標示的空缺；選觀察尺度" },
    ch02: { lead: "市場的變化不只在新的攤位。交易、補貨、清理與等待，也在反覆重做市場。", from: "市場的價值就是熱鬧與新鮮", to: "重複生活也需要穩定條件", act: "市場細節、記憶線索；開啟證據標籤" },
    ch03: { lead: "外形、用途與路徑可以各自延續，也可以彼此衝突。", from: "保留或改建只能二選一", to: "外形、使用與可達性可以不同步", act: "85 大樓、車站、輕軌；切換層次" },
    ch04: { lead: "從市場大廳、可替換膠囊到未建成的活動框架，設計曾以不同方式迎接變化。", from: "可變設計能預先解決未來", to: "設計意圖、實際使用與治理可能分離", act: "五項參照的比較與反問" },
    ch05: { lead: "這裡是一個思想實驗。你選擇的是假設條件，不是未來年份的答案。", from: "一條滑桿就是未來", to: "每個選擇依賴假設，也產生代價", act: "關鍵 3D 與等值 2D；選條件再比較" },
    ch06: { lead: "展覽停在這裡，城市沒有。我們能帶走的不是一張最後的藍圖，而是一種再次觀察的方法。", from: "看完展覽就得到答案", to: "再次觀察也需要辨認自己的立場", act: "提問卡、來源入口" }
  };
  var pvBox = document.querySelector("[data-pv]");
  function showPV(id) {
    if (!pvBox || !PV[id]) return;
    var c = CITY.CHAPTERS.filter(function (x) { return x.id === id; })[0];
    pvBox.innerHTML = '<p class="pv-n">CHAPTER ' + c.n + '</p><h3>' + c.tc + '</h3><p style="margin:0">' + PV[id].lead + '</p>' +
      '<dl><dt>原本的直覺</dt><dd>' + PV[id].from + '</dd><dt>本章的轉折</dt><dd>' + PV[id].to + '</dd><dt>材料與行動</dt><dd>' + PV[id].act + '</dd></dl>';
    document.querySelectorAll(".index a.row").forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + id); });
  }
  document.querySelectorAll(".index a.row").forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    a.addEventListener("mouseenter", function () { showPV(id); });
    a.addEventListener("focus", function () { showPV(id); });
  });
  showPV("ch01");

  /* ---------- 第一章：觀察尺度與時間窗口（抽象示意） ---------- */
  var TW = {
    trade: { x: 46, w: 1.6, name: "一次交易", see: "一個動作、一件物件、一次對話。", miss: "誰補貨、誰清理、這個位置昨天屬於誰。" },
    day:   { x: 44, w: 6, name: "一天", see: "開攤、尖峰、收攤與清理的順序。", miss: "設備何時更換、經營者是否換人。" },
    year:  { x: 36, w: 20, name: "一年", see: "若有重複紀錄：季節、休市、修繕的節奏。", miss: "單次或少數紀錄無法說明長期趨勢。" },
    gen:   { x: 8, w: 84, name: "一個世代", see: "需要檔案、回述與比對等多種證據。", miss: "單張照片或單次觀察都不夠；本展目前尚未取得這類材料。" }
  };
  // 抽象刻點：不是實際事件
  var BANDS = [
    { name: "外形", ticks: [9, 63] },
    { name: "設備", ticks: [14, 31, 47.5, 58, 77, 90] },
    { name: "使用者", ticks: [5, 18, 26, 38, 45.6, 46.6, 52, 61, 70, 83, 95] },
    { name: "理解", ticks: [22, 41, 47, 66, 88] }
  ];
  var twSvg = document.querySelector("[data-tw-svg]");
  var twOut = document.querySelector("[data-tw-out]");
  function drawTW(key) {
    if (!twSvg) return;
    var w = TW[key], H = 30, top = 18;
    var s = '<svg class="tw-svg" viewBox="0 0 640 ' + (top + BANDS.length * (H + 10) + 30) + '" role="img" aria-label="時間窗口示意：以' + w.name + '的尺度觀看，窗口內只看得到少數變化。抽象刻點，不是實際事件。">';
    var wx = 80 + w.x / 100 * 540, ww = Math.max(4, w.w / 100 * 540);
    BANDS.forEach(function (b, i) {
      var y = top + i * (H + 10);
      s += '<text x="0" y="' + (y + 20) + '" font-family="Noto Sans TC, sans-serif" font-size="14" fill="#5C5C5C">' + b.name + '</text>';
      s += '<line x1="80" y1="' + (y + H / 2) + '" x2="620" y2="' + (y + H / 2) + '" stroke="#DDDDDD" stroke-width="1"/>';
      b.ticks.forEach(function (t) {
        var tx = 80 + t / 100 * 540, inside = tx >= wx && tx <= wx + ww;
        s += '<rect x="' + (tx - 2) + '" y="' + (y + 6) + '" width="4" height="' + (H - 12) + '" fill="' + (inside ? "#CF3F2B" : "#111111") + '" opacity="' + (inside ? 1 : 0.35) + '"/>';
      });
    });
    var bottom = top + BANDS.length * (H + 10) - 4;
    s += '<rect x="' + wx + '" y="6" width="' + ww + '" height="' + (bottom - 2) + '" fill="rgba(31,78,107,0.08)" stroke="#1F4E6B" stroke-width="1.5"/>';
    s += '<text x="' + Math.min(wx, 560) + '" y="' + (bottom + 22) + '" font-family="IBM Plex Mono, monospace" font-size="12" fill="#1F4E6B">觀看窗口：' + w.name + '</text>';
    s += '<text x="620" y="' + (bottom + 22) + '" font-family="IBM Plex Mono, monospace" font-size="12" fill="#5C5C5C" text-anchor="end">時間 →</text></svg>';
    twSvg.innerHTML = s;
    twOut.innerHTML = '<dl><dt>看得到</dt><dd>' + w.see + '</dd><dt>看不到</dt><dd>' + w.miss + '</dd></dl>';
  }
  document.querySelectorAll("[data-tw]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("[data-tw]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      drawTW(b.getAttribute("data-tw"));
      CITY.announce("觀察尺度：" + TW[b.getAttribute("data-tw")].name);
    });
  });
  drawTW("trade");

  /* ---------- 第三章：選一個層次 ---------- */
  function cite(id) { return '<a class="cite" data-src="' + id + '" href="sources/#' + id + '">' + id + '</a>'; }
  var LY = {
    form: {
      name: "外形",
      tower: ['lb-interp', '策展解釋', '從公共視點辨認的輪廓（P13–P14 待拍攝）。熟悉的輪廓是一種個人觀看，不代表全體居民的共識。'],
      station: ['lb-data', '資料', '設計者的專案頁說明了設計構想 ' + cite("S04") + '；設計者自述的連結與意象，不能自動視為完成後的使用成效。'],
      lrt: ['lb-interp', '策展解釋', '地面上的軌道與候車設施是可見的形體；看得見，不代表接近得了。']
    },
    use: {
      name: "使用",
      tower: ['lb-interp', '策展解釋', '內部使用以文字卡表達。沒有室內證據，本展不判定室內營運、空置或觀景設施現況 ' + cite("S02") + '。'],
      station: ['lb-pending', '待紀錄', '日常使用需以有日期的步行與停留紀錄觀察（O 編號待紀錄）；設計完成不等於每個人的使用經驗相同。'],
      lrt: ['lb-data', '資料', '營運方將 2024-01-01 試營運成圓與 2024-02-26 全線正式營運分開記載 ' + cite("S05") + '。營運節點不等於誰的生活更方便。']
    },
    route: {
      name: "路徑",
      tower: ['lb-pending', '待拍攝', '從街道接近的方式與入口可見範圍（P15–P16）。觀光網頁不轉成「現在可進入」的指引。'],
      station: ['lb-pending', '待拍攝', '可合法通行的路徑紀錄（P20–P21）；一次實際步行不代替無障礙專業稽核。'],
      lrt: ['lb-pending', '待選段', '選定一段路徑的步行觀察（P23–P26）。路線圖不證明任一場所可直接抵達。']
    }
  };
  var lyOut = document.querySelector("[data-ly-out]");
  function drawLY(k) {
    if (!lyOut) return;
    var L = LY[k];
    function cell(title, d) { return '<div class="cell"><h3>' + title + '</h3><span class="lb ' + d[0] + '">' + d[1] + '</span><p style="margin:0">' + d[2] + '</p></div>'; }
    lyOut.innerHTML = cell("85 大樓", L.tower) + cell("高雄車站", L.station) + cell("輕軌", L.lrt);
  }
  document.querySelectorAll("[data-ly]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("[data-ly]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      drawLY(b.getAttribute("data-ly"));
      CITY.announce("層次：" + LY[b.getAttribute("data-ly")].name + "，註記已更新");
    });
  });
  drawLY("form");

  /* ---------- 第二章：開啟證據標籤 ---------- */
  var evBtn = document.querySelector("[data-evidence]");
  if (evBtn) evBtn.addEventListener("click", function () {
    var on = evBtn.getAttribute("aria-pressed") !== "true";
    evBtn.setAttribute("aria-pressed", String(on));
    document.querySelectorAll("[data-evidence-panel]").forEach(function (p) { p.hidden = !on; });
    evBtn.textContent = on ? "收合證據標籤" : "開啟證據標籤";
  });

  /* ---------- 第六章：列印提問卡（不收集個資，文字只留在本機畫面） ---------- */
  var pr = document.querySelector("[data-print]");
  if (pr) pr.addEventListener("click", function () {
    document.body.classList.add("print-card");
    window.print();
    setTimeout(function () { document.body.classList.remove("print-card"); }, 500);
  });
})();
