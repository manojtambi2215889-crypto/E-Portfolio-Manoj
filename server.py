import http.server
import socketserver

PORT = 8002

class PortfolioHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Prevent CORS or cache locks during edits
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def do_GET(self):
        # Resolve correct MIME types for Javascript and CSS specifically on Windows
        if self.path.endswith('.js'):
            self.send_response(200)
            self.send_header('Content-type', 'application/javascript; charset=utf-8')
            self.end_headers()
            with open(self.translate_path(self.path), 'rb') as f:
                self.wfile.write(f.read())
            return
        elif self.path.endswith('.css'):
            self.send_response(200)
            self.send_header('Content-type', 'text/css; charset=utf-8')
            self.end_headers()
            with open(self.translate_path(self.path), 'rb') as f:
                self.wfile.write(f.read())
            return
        return super().do_GET()

handler = PortfolioHTTPRequestHandler

print(f"Starting Local Portfolio Server on http://localhost:{PORT}")
with socketserver.TCPServer(("", PORT), handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Local Portfolio Server.")
        httpd.server_close()
