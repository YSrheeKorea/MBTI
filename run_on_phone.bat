@echo off
chcp 65001 > nul
title 마음MBTI 스마트폰 연결기
cd /d "%~dp0"
echo [마음MBTI] 스마트폰 연결용 서버를 시작합니다...
python run_on_phone.py
pause
