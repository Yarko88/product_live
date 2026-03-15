#!/usr/bin/env python3
"""
Минимальный HTTP-сервер для приёма вебхука деплоя.
Запуск: DEPLOY_SECRET=твой_секрет python3 webhook_server.py
Или: export DEPLOY_SECRET=... && python3 webhook_server.py
Порт 9000. Проверяет заголовок X-Deploy-Token или query ?token=...
"""
import os
import subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(SCRIPT_DIR)
DEPLOY_SCRIPT = os.path.join(SCRIPT_DIR, "deploy.sh")


class DeployHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        secret = os.environ.get("DEPLOY_SECRET", "")
        if not secret:
            self._send(500, "DEPLOY_SECRET not set")
            return
        token = self.headers.get("X-Deploy-Token") or self._query().get("token")
        if token != secret:
            self._send(403, "Forbidden")
            return
        try:
            subprocess.run(
                ["/bin/bash", DEPLOY_SCRIPT],
                cwd=REPO_ROOT,
                timeout=300,
                check=True,
                capture_output=True,
                text=True,
            )
            self._send(200, "OK")
        except subprocess.CalledProcessError as e:
            self._send(500, (e.stderr or str(e))[:500])
        except subprocess.TimeoutExpired:
            self._send(500, "Deploy timeout")

    def _query(self):
        q = {}
        if "?" in self.path:
            for part in self.path.split("?", 1)[1].split("&"):
                if "=" in part:
                    k, v = part.split("=", 1)
                    q[k] = v
        return q

    def _send(self, code, body):
        self.send_response(code)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.end_headers()
        self.wfile.write(body.encode("utf-8"))

    def log_message(self, *args):
        pass


def main():
    port = int(os.environ.get("PORT", "9000"))
    server = HTTPServer(("0.0.0.0", port), DeployHandler)
    print(f"Webhook listen 0.0.0.0:{port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
