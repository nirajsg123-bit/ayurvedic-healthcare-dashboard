@echo off
schtasks /Create /TN "AyurvedicDashboardWatchdog" /TR "wscript.exe \"D:\ayurvedic-healthcare-dashboard\ayurvedic-watchdog.vbs\"" /SC ONSTART /RU SYSTEM /F
echo DONE %ERRORLEVEL%
