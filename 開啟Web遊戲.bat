@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0啟動Web遊戲.ps1"
if errorlevel 1 (
  echo.
  echo Web 遊戲啟動失敗，請確認 build\web-mobile\index.html 存在，或連接埠 5000 沒有被其他程式佔用。
  pause
)
endlocal
