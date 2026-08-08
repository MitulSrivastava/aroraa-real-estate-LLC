#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

DEFAULT_PORT = 8000

class ExtensionlessHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        local_path = super().translate_path(path)

        if os.path.exists(local_path):
            return local_path

        # If extensionless URL, check if .html file exists
        if not local_path.endswith('.html') and os.path.exists(local_path + '.html'):
            return local_path + '.html'

        return local_path

def run_server():
    port = DEFAULT_PORT
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])

    socketserver.TCPServer.allow_reuse_address = True
    
    while port < 8100:
        try:
            with socketserver.TCPServer(("", port), ExtensionlessHTTPRequestHandler) as httpd:
                print(f"\n🚀 Dev server running at: http://localhost:{port}")
                print(f"✨ Extensionless URLs enabled (e.g. http://localhost:{port}/the-archive-by-imtiaz)\n")
                httpd.serve_forever()
                break
        except OSError:
            port += 1

if __name__ == '__main__':
    try:
        run_server()
    except KeyboardInterrupt:
        print("\nServer stopped.")
