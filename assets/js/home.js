/* 首頁：索引預覽、02 章滑桿對照 */
(function () {
  "use strict";
  var CITY = window.CITY;

  /* ---------- 索引預覽 ---------- */
  var PV = {
    ch01: { lead: "城市從來沒有真正完成的一天。", from: "城市有一張完成的樣子", to: "我們看見的只是其中一個瞬間" },
    ch02: { lead: "我想像三十年後的自由黃昏市場。它可能不再有現在的鐵皮屋頂，但市場依然熱鬧。", from: "市場的價值就是熱鬧與新鮮", to: "市場留下的是生活，不是建築" },
    ch03: { lead: "城市的改變，也有它的界線。我不認為自己的想像，就有權決定別人的生活。", from: "城市更新就是整片一起改", to: "改變的想像，也要停在別人的產權前面" },
    ch04: { lead: "如果自由黃昏市場可以大幅改造，為什麼我卻希望保留 85 大樓？", from: "保留或改建只能二選一", to: "外形可以留下，內部可以更新" },
    ch05: { lead: "這裡是一個思想實驗。你選擇的是假設條件，不是未來年份的答案。", from: "一條滑桿就是未來", to: "每個選擇依賴假設，也產生代價" },
    ch06: { lead: "展覽停在這裡，城市沒有。", from: "看完展覽就得到答案", to: "再次觀察也需要辨認自己的立場" }
  };
  var pvBox = document.querySelector("[data-pv]");
  function showPV(id) {
    if (!pvBox || !PV[id]) return;
    var c = CITY.CHAPTERS.filter(function (x) { return x.id === id; })[0];
    pvBox.innerHTML = '<p class="pv-n">CHAPTER ' + c.n + '</p><h3>' + c.tc + '</h3><p style="margin:0">' + PV[id].lead + '</p>' +
      '<dl><dt>原本的直覺</dt><dd>' + PV[id].from + '</dd><dt>本章的轉折</dt><dd>' + PV[id].to + '</dd></dl>';
    document.querySelectorAll(".index a.row").forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + id); });
  }
  document.querySelectorAll(".index a.row").forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    a.addEventListener("mouseenter", function () { showPV(id); });
    a.addEventListener("focus", function () { showPV(id); });
  });
  showPV("ch01");

  /* ---------- 02 章：三鳳中街／苓雅市場滑桿對照 ---------- */
  document.querySelectorAll("[data-compare]").forEach(function (box) {
    var r = box.querySelector("input");
    function set(v) { box.style.setProperty("--p", v + "%"); }
    r.addEventListener("input", function () { set(r.value); });
    box.cityCompare = function (v) { r.value = Math.round(v); set(v); };
  });

  /* ---------- 第六章：列印提問卡（不收集個資，文字只留在本機畫面） ---------- */
  var pr = document.querySelector("[data-print]");
  if (pr) pr.addEventListener("click", function () {
    document.body.classList.add("print-card");
    window.print();
    setTimeout(function () { document.body.classList.remove("print-card"); }, 500);
  });
})();
