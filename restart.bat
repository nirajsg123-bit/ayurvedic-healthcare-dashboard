@echo off
taskkill /F /IM node.exe 2>nul
ping -n 3 127.0.0.1 >nul
cd /d D:\ayurvedic-healthcare-dashboard
start /B node server.js
echo Ayurvedic dashboard server started on port 4500
