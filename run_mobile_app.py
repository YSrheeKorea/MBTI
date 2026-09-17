# -*- coding: utf-8 -*-
"""모바일 앱 전용 창(430x900)으로 MBTI 웹앱을 실행하는 파이썬 런처"""

import os
import sys
import time
import socket
import threading
import subprocess
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler


def get_free_port():
    """사용 가능한 임의 포트 검색"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        return s.getsockname()[1]


def run_server(port, directory):
    """정적 웹서버 실행"""
    class QuietHandler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=directory, **kwargs)

        def log_message(self, format, *args):
            # 조용한 모드 (콘솔 로그 억제)
            pass

    server = HTTPServer(('127.0.0.1', port), QuietHandler)
    server.serve_forever()


def launch_app_window(url):
    """Chrome 또는 Edge의 --app 플래그를 사용하여 모바일 스마트폰 비율(430x900)의 독립 창으로 실행"""
    app_width = 430
    app_height = 900

    # 윈도우 환경 크롬 및 엣지 경로 탐색
    candidate_browsers = [
        # Google Chrome
        os.path.expandvars(r"%ProgramFiles%\Google\Chrome\Application\chrome.exe"),
        os.path.expandvars(r"%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"),
        os.path.expandvars(r"%LocalAppData%\Google\Chrome\Application\chrome.exe"),
        # Microsoft Edge
        os.path.expandvars(r"%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"),
        os.path.expandvars(r"%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"),
    ]

    for browser_path in candidate_browsers:
        if os.path.exists(browser_path):
            try:
                cmd = [
                    browser_path,
                    f"--app={url}",
                    f"--window-size={app_width},{app_height}",
                    "--disable-features=Translate",
                    "--window-name=MindMBTI_MobileApp"
                ]
                subprocess.Popen(cmd)
                print(f"[성공] 모바일 앱 전용 창으로 실행되었습니다: {browser_path}")
                return True
            except Exception as e:
                print(f"[경고] 브라우저 앱 모드 실행 실패: {e}")

    # 폴백: 기본 브라우저에서 열기
    print("[안내] 기본 웹 브라우저에서 모바일 뷰를 엽니다.")
    webbrowser.open(url)
    return False


def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dist_dir = os.path.join(current_dir, "mbti_app", "dist")
    
    # dist 디렉토리가 있으면 dist를 서빙, 없으면 현재 디렉토리 서빙
    serve_dir = dist_dir if os.path.exists(dist_dir) else current_dir

    port = get_free_port()
    url = f"http://127.0.0.1:{port}/index.html"

    # 로컬 웹서버 백그라운드 스레드 가동
    t = threading.Thread(target=run_server, args=(port, serve_dir), daemon=True)
    t.start()
    time.sleep(0.3)

    print("=" * 60)
    print("      ★ 마음MBTI 모바일 앱 런처 구동 중 ★")
    print("=" * 60)
    print(f"로컬 웹서버 주소: {url}")
    print("스마트폰 규격(430x900) 모바일 앱 전용 창을 시작합니다...")
    print("※ 프로그램을 종료하려면 터미널에서 Ctrl + C를 누르세요.")
    print("=" * 60)

    launch_app_window(url)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n모바일 앱 웹서버를 종료합니다.")


if __name__ == "__main__":
    main()
