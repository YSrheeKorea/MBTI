@echo off
chcp 65001 > nul
title 마인드 랩 - 6대 심리 검사 센터
cd /d "%~dp0"
echo [마인드 랩] 6대 심리·성향 검사 데스크톱 독립 앱 창을 실행합니다...
python run_desktop_app.py
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [안내] 프로그램 실행 중 오류가 발생했거나 종료되었습니다.
    pause
)
