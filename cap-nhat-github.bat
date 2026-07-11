@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  === Cap nhat Toan Lop 3 len GitHub ===
echo.

where node >nul 2>&1
if %errorlevel%==0 (
  echo [1/4] Build ToanLop3.html ...
  node build-single.js
) else (
  echo [1/4] Bo qua build (chua cai Node^)
)

echo [2/4] git add ...
git add .
echo [3/4] git commit ...
git commit -m "Cap nhat app Toan lop 3"
if errorlevel 1 (
  echo Khong co thay doi moi de commit, van thu push...
)
echo [4/4] git push ...
git push origin main
if errorlevel 1 (
  echo.
  echo *** PUSH THAT BAI ***
  echo Hay chay lai trong PowerShell de dang nhap GitHub:
  echo   cd C:\AIBTest\toan-lop3
  echo   git push
  echo.
  pause
  exit /b 1
)
echo.
echo OK! Da day len GitHub.
echo App: https://quangtran-123corp.github.io/toan-lop3/
echo.
pause
