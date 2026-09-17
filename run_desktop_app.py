# -*- coding: utf-8 -*-
"""마음MBTI - PySide6 기반 독립 데스크톱 모바일 앱 창 실행기"""

import os
import sys
import socket
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler

from PySide6.QtCore import QUrl, Qt
from PySide6.QtGui import QIcon
from PySide6.QtWidgets import QApplication, QMainWindow
from PySide6.QtWebEngineWidgets import QWebEngineView
from PySide6.QtWebEngineCore import QWebEngineSettings, QWebEnginePage


def get_free_port():
    """사용 가능한 임의 포트 검색"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


def start_local_server(directory, port):
    """로컬 정적 웹 서버 백그라운드 구동"""
    class QuietHandler(SimpleHTTPRequestHandler):
        extensions_map = {
            **SimpleHTTPRequestHandler.extensions_map,
            '.js': 'text/javascript',
            '.mjs': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.svg': 'image/svg+xml',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.html': 'text/html; charset=utf-8',
        }

        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=directory, **kwargs)

        def log_message(self, format, *args):
            pass  # 콘솔 로그 억제

    server = HTTPServer(('127.0.0.1', port), QuietHandler)
    server.serve_forever()


import mimetypes
mimetypes.init()
mimetypes.add_type('text/javascript', '.js')
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('application/json', '.json')

class CustomWebEnginePage(QWebEnginePage):
    def javaScriptConsoleMessage(self, level, message, lineNumber, sourceId):
        level_str = {
            QWebEnginePage.JavaScriptConsoleMessageLevel.InfoMessageLevel: "[JS INFO]",
            QWebEnginePage.JavaScriptConsoleMessageLevel.WarningMessageLevel: "[JS WARN]",
            QWebEnginePage.JavaScriptConsoleMessageLevel.ErrorMessageLevel: "[JS ERROR]",
        }.get(level, "[JS]")
        print(f"{level_str} (line {lineNumber} in {sourceId}): {message}")

class MobileAppWindow(QMainWindow):
    def __init__(self, target_url):
        super().__init__()
        self.setWindowTitle("마인드 랩 (Mind Lab) - 6대 심리·성향 검사 센터")

        # 스마트폰 화면 규격 (가로 440px, 세로 880px)
        app_width = 440
        app_height = 880
        self.resize(app_width, app_height)
        self.setMinimumSize(380, 700)

        # 화면 정중앙 배치
        screen_geo = QApplication.primaryScreen().geometry()
        x = (screen_geo.width() - app_width) // 2
        y = (screen_geo.height() - app_height) // 2
        self.move(max(0, x), max(0, y))

        # 웹엔진 뷰 및 커스텀 페이지 설정
        self.web_view = QWebEngineView()
        self.web_page = CustomWebEnginePage(self.web_view)
        self.web_view.setPage(self.web_page)

        settings = self.web_view.settings()
        settings.setAttribute(QWebEngineSettings.WebAttribute.JavascriptEnabled, True)
        settings.setAttribute(QWebEngineSettings.WebAttribute.LocalStorageEnabled, True)
        settings.setAttribute(QWebEngineSettings.WebAttribute.LocalContentCanAccessRemoteUrls, True)
        settings.setAttribute(QWebEngineSettings.WebAttribute.LocalContentCanAccessFileUrls, True)

        self.web_view.setUrl(QUrl(target_url))
        self.setCentralWidget(self.web_view)


def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # React 빌드 디렉토리 (dist) 우선 탐색
    dist_dir = os.path.join(current_dir, "mbti_app", "dist")
    serve_dir = dist_dir if os.path.exists(dist_dir) else current_dir

    port = get_free_port()
    url = f"http://127.0.0.1:{port}/index.html"

    # 로컬 웹서버 백그라운드 스레드 가동
    server_thread = threading.Thread(target=start_local_server, args=(serve_dir, port), daemon=True)
    server_thread.start()

    try:
        # Qt 네이티브 윈도우 애플리케이션 시작
        app = QApplication.instance() or QApplication(sys.argv)
        app.setApplicationName("마인드 랩 - 6대 심리 검사")

        window = MobileAppWindow(url)
        window.show()

        print("=" * 60)
        print("   [마인드 랩] 6대 심리·성향 검사 데스크톱 앱 창 실행 완료")
        print("=" * 60)
        print(f" - 로컬 URL: {url}")
        print(f" - 앱 규격: 440 x 880 (스마트폰 비율 독립 윈도우)")
        print(f" - 엔진: PySide6 QtWebEngine")
        print("=" * 60)

        ret = app.exec()
        sys.exit(ret)
    except Exception as e:
        import traceback
        print("\n[오류 발생]:", str(e))
        traceback.print_exc()
        input("\n엔터 키를 누르면 종료됩니다...")
        sys.exit(1)


if __name__ == "__main__":
    main()
