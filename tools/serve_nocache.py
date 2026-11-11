"""Local web server for the game build that tells the browser not to cache files,
so a refresh always loads the newest build."""
import functools
import http.server
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5000
    directory = sys.argv[2] if len(sys.argv) > 2 else '.'
    handler = functools.partial(NoCacheHandler, directory=directory)
    with http.server.ThreadingHTTPServer(('127.0.0.1', port), handler) as server:
        server.serve_forever()


if __name__ == '__main__':
    main()
