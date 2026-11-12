# 城市不是完成品 THE CITY IS NEVER FINISHED

淡江大學建築學系 當代思潮課程｜線上展覽（製作預覽 v1.0）

純靜態網站（HTML／CSS／JavaScript），不需要建置工具，可以直接放上 GitHub Pages。

## 檔案結構

```
index.html            入口＋六章主敘事（#ch01 至 #ch06）
explore/              探索城市：2D 情境比較＋CSS 3D 空間實驗
places/               場所檔案（#ziyou-market #85-tower #kaohsiung-station #light-rail #vendor-memory）
references/           案例索引（五項國際參照）
sources/              資料與方法（五種標籤、原話登錄、來源索引 S01–S18）
about/                策展論述與製作狀態
assets/css/style.css  視覺系統（色彩 token、網格、方框按鈕、翻開的盒子）
assets/js/main.js     共用外框、章節進度立方體、來源抽屜、減少動畫、來源資料
assets/js/home.js     首頁互動（索引預覽、時間窗口、層次切換、提問卡）
assets/js/scenario.js 情境資料與比較元件（2D 與 3D 共用同一份資料）
.nojekyll             讓 GitHub Pages 直接提供檔案
```

## 部署到 GitHub Pages

1. 在 GitHub 建立一個新的 repository（例如 `city-never-finished`）。
2. 把這個資料夾的所有檔案推上去（`.nojekyll` 也要一起推）：
   ```bash
   git init
   git add .
   git commit -m "城市不是完成品 製作預覽 v1.0"
   git branch -M main
   git remote add origin https://github.com/<你的帳號>/city-never-finished.git
   git push -u origin main
   ```
3. 到 repository 的 **Settings → Pages**，Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾選 `/ (root)`，按 Save。
4. 約一分鐘後網址會是 `https://<你的帳號>.github.io/city-never-finished/`。

所有連結都是相對路徑，放在子路徑（`/repo-name/`）下也能正常運作。

## 本機預覽

```bash
python3 -m http.server 8000
```

然後開 http://localhost:8000 。

## 替換素材

- 頁面上帶素材編號（P01–P26、R01–R05）的斜線方框是「待取得」占位。取得照片後，把 `<div class="ph">…</div>` 換成 `<img>`，並補上拍攝者、日期與替代文字。
- 正式公開前請移除頂端的「製作預覽」橫幅（每頁的 `<p class="preview-note">`），並確認沒有［拍攝者］、YYYYMMDD、「待確認」等占位文字殘留。
- 來源資料集中在 `assets/js/main.js` 的 `SOURCES`；`sources/index.html` 的來源清單是同一份內容的靜態版本，修改時兩處一起改。
- 情境、熱點與歷史節點集中在 `assets/js/scenario.js`。

## 設計依據

- 內容與規則：《城市不是完成品 網站策展與視覺設計 Brief》v1.0（2026-11-13）。
- 介面語彙參考 nodate.club 的左右分割索引頁、方框按鈕、線框立方體與翻開的盒子；色彩、字體與內容標示依 Brief 第 08 節。
- 字體：Noto Sans TC、Noto Serif TC、Inter、IBM Plex Mono（SIL Open Font License，經 Google Fonts 載入）。
