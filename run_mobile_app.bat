@echo off
chcp 65001 > nul
title 마음MBTI 모바일 앱 실행기
cd /d "%~dp0"
echo [마음MBTI] 모바일 앱 환경을 시작합니다...
python run_mobile_app.py
pause
