# 快樂小雞農場

使用 Cocos Creator 3.8.8 製作的 3D 農場小遊戲。農場場景、母雞與小雞都由 `assets/scripts/FarmGame.ts` 即時生成，背景音樂與大部分音效也由程式合成，只有下蛋叫聲使用音檔。主場景為 `assets/main.scene`。

## 遊戲玩法

1. 在開始畫面按「開始遊戲」（或按空白鍵／Enter）。
2. 30 秒內控制母雞下蛋：
   - **滑鼠**：母雞會跟著游標走，點一下就下蛋。
   - **鍵盤**：WASD 或方向鍵移動母雞，空白鍵下蛋。
3. 雞蛋 3 秒後孵化，每隻小雞加 100 分。農場最多同時容納 120 顆蛋和小雞。
4. 小雞會在柵欄內跑跳、跟隨同伴、拿望遠鏡、跳舞、翻滾、擺姿勢或打盹，也會各自冒出對話雲（每隻 10 秒最多一句）。
5. 時間到時，結算畫面會像電影謝幕一樣由上往下降下，可以選「再玩一次」或「製作團隊」觀看捲動名單。
6. 右上角可以拖拉調整「音樂」與「音效」音量，設定會記在瀏覽器裡。

可調整的內容都放在 `FarmGame.ts` 上方的常數：`CREDITS`（名單）、`CHICK_CHATTER` / `HATCH_LINES`（小雞台詞）、`CHICK_TALK_GAP`（說話間隔）、`MAX_CHICKS`、`ROUND_SECONDS` 等。

## 開啟專案

在 Cocos Creator 3.8.8 開啟此資料夾，等待資產匯入後預覽 `main.scene`。

選用：專案原本搭配 [cocos-mcp-server](https://github.com/DaxianLee/cocos-mcp-server) 編輯器擴充，它沒有放進這個 repo。需要的話請 clone 到 `extensions/cocos-mcp-server/` 並依它的說明安裝。

## 建置與在瀏覽器執行

1. 在 Creator 的「專案 → 建置」選擇 **Web Mobile** 並建置。`build-templates/web-mobile/` 裡的 `index.html` 與 `sounds/hen-lay.mp3` 會自動複製到建置結果。
2. 雙擊專案根目錄的 `開啟Web遊戲.bat`。它會用 `tools/serve_nocache.py` 在背景啟動本機網站（關閉快取，重新整理一定會拿到最新建置），並開啟 `http://127.0.0.1:5000/`。

也可以手動執行：

```powershell
py tools\serve_nocache.py 5000 build\web-mobile
```

Android 測試版可從 Creator 的「專案 → 建置」選擇 Android；正式建置需先設定相容版本的 JDK、Android SDK 與 NDK。
