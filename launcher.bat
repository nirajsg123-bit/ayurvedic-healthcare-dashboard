@echo off
:: Resilient launcher: keeps node server.js alive. Restarts on crash.
:loop
tasklist /FI "IMAGENAME eq node.exe" | find /I "node.exe" >nul
if errorlevel 1 (
  echo %date% %time% - node not running, starting >> "D:\ayurvedic-healthcare-dashboard\launcher.log"
  cd /d D:\ayurvedic-healthcare-dashboard
  start /B node server.js >> "D:\ayurvedic-healthcare-dashboard\server.log" 2>&1
)
timeout /t 15 >nul
goto loop
