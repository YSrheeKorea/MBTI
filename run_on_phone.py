# -*- coding: utf-8 -*-
"""
안드로이드 스마트폰에서 마음MBTI를 구동하기 위한 로컬 네트워크 호스팅 런처
- 동일한 Wi-Fi 환경의 스마트폰에서 바로 접속할 수 있도록 0.0.0.0으로 서빙합니다.
- PC 화면에 스마트폰 카메라로 바로 찍을 수 있는 QR 코드 안내창을 함께 띄웁니다.
"""

import os
import sys
import socket
import threading
import time
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse


def get_local_ip():
    """스마트폰에서 접속할 수 있는 현재 PC의 로컬 네트워크 IP 탐색"""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            # 외부 라우팅 시뮬레이션을 통해 활성 네트워크 인터페이스의 IP 확인
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
    except Exception:
        return "127.0.0.1"


def get_free_port(start_port=8080):
    """지정된 포트부터 사용 가능한 포트 검색"""
    port = start_port
    while port < 65535:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('0.0.0.0', port))
                return port
            except OSError:
                port += 1
    return 8080


def run_server(port, directory):
    """외부 기기 접속 허용 (0.0.0.0 바인딩) 웹서버 구동"""
    class QuietHandler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=directory, **kwargs)

        def log_message(self, format, *args):
            pass

    server = HTTPServer(('0.0.0.0', port), QuietHandler)
    server.serve_forever()


def open_qr_guide(phone_url):
    """PC 브라우저에 스마트폰 접속용 대형 QR 코드 및 접속 안내 페이지 표시"""
    encoded_url = urllib.parse.quote_plus(phone_url)
    qr_image_url = f"https://api.qrserver.com/v1/create-qr-code/?size=320x320&data={encoded_url}"

    html_content = f"""<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>스마트폰 마음MBTI 접속 안내</title>
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard", Roboto, sans-serif;
            background: #0f172a;
            color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
        }}
        .card {{
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 24px;
            padding: 36px 32px;
            max-width: 480px;
            width: 100%;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }}
        h1 {{
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #38bdf8, #818cf8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}
        p.subtitle {{
            color: #94a3b8;
            font-size: 14px;
            margin-bottom: 24px;
        }}
        .qr-wrapper {{
            background: #ffffff;
            padding: 16px;
            border-radius: 16px;
            display: inline-block;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            margin-bottom: 20px;
        }}
        .qr-wrapper img {{
            display: block;
            width: 260px;
            height: 260px;
        }}
        .url-badge {{
            display: block;
            background: #0f172a;
            color: #38bdf8;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            word-break: break-all;
            text-decoration: none;
            border: 1px solid #38bdf840;
            margin-bottom: 20px;
            transition: background 0.2s;
        }}
        .url-badge:hover {{
            background: #1e293b;
        }}
        .guide-box {{
            background: #0f172a80;
            border-left: 4px solid #38bdf8;
            border-radius: 8px;
            padding: 14px 16px;
            text-align: left;
            font-size: 13px;
            line-height: 1.6;
            color: #cbd5e1;
        }}
        .guide-box strong {{
            color: #f1f5f9;
        }}
        .guide-box ol {{
            margin-left: 18px;
            margin-top: 6px;
        }}
    </style>
</head>
<body>
    <div class="card">
        <h1>📱 스마트폰으로 접속하기</h1>
        <p class="subtitle">휴대폰 기본 카메라로 아래 QR 코드를 비추세요</p>

        <div class="qr-wrapper">
            <img src="{qr_image_url}" alt="스마트폰 접속 QR 코드" />
        </div>

        <a class="url-badge" href="{phone_url}" target="_blank">{phone_url}</a>

        <div class="guide-box">
            <strong>💡 안드로이드 앱 구동 팁 (PWA):</strong>
            <ol>
                <li>스마트폰과 PC가 <strong>동일한 Wi-Fi</strong>에 연결되어 있어야 합니다.</li>
                <li>휴대폰 카메라 또는 브라우저로 위 주소에 접속합니다.</li>
                <li>화면 상단의 <strong>[홈 화면에 앱 설치하기]</strong> 배너 또는 브라우저 메뉴(⋮)에서 <strong>[홈 화면에 추가]</strong>를 누르면 <strong>정식 앱 아이콘</strong>이 스마트폰에 설치됩니다!</li>
            </ol>
        </div>
    </div>
</body>
</html>
"""
    guide_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "phone_guide_temp.html")
    with open(guide_file, "w", encoding="utf-8") as f:
        f.write(html_content)

    webbrowser.open(f"file:///{guide_file.replace(os.sep, '/')}")


def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dist_dir = os.path.join(current_dir, "mbti_app", "dist")

    # dist 빌드 디렉토리가 있으면 dist를 우선 서빙
    serve_dir = dist_dir if os.path.exists(dist_dir) else current_dir

    local_ip = get_local_ip()
    port = get_free_port(8080)
    phone_url = f"http://{local_ip}:{port}/index.html"

    # 웹서버 백그라운드 스레드 가동
    t = threading.Thread(target=run_server, args=(port, serve_dir), daemon=True)
    t.start()
    time.sleep(0.3)

    print("=" * 65)
    print("   ★ 안드로이드 스마트폰 마음MBTI 연결 서버 가동 중 ★")
    print("=" * 65)
    print(f"[PC IP 주소]     : {local_ip}")
    print(f"[스마트폰 접속 URL]: {phone_url}")
    print("-" * 65)
    print("1. 스마트폰과 PC가 같은 Wi-Fi(공유기)에 연결되어 있는지 확인하세요.")
    print("2. PC 화면에 뜬 QR 코드를 스마트폰 기본 카메라로 비추면 바로 열립니다.")
    print("3. 접속 후 [홈 화면에 추가]를 누르면 진짜 안드로이드 앱처럼 실행됩니다.")
    print("=" * 65)
    print("※ 서버를 종료하려면 터미널에서 Ctrl + C를 누르세요.\n")

    # QR 가이드 창 브라우저에 표시
    open_qr_guide(phone_url)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n스마트폰 연결 서버를 종료합니다.")


if __name__ == "__main__":
    main()
