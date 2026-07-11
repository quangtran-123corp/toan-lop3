@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  Toan Lop 3 - Ket noi tri thuc
echo  ------------------------------
echo  Dang mo file ToanLop3.html bang Chrome...
echo.
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "%~dp0ToanLop3.html"
if errorlevel 1 start "" "%~dp0ToanLop3.html"
exit /b 0
