# Автодеплой на VM в Yandex Cloud

## Вариант 1: Вебхук при пуше (рекомендуется)

При пуше в репозиторий (GitHub/GitLab и т.д.) на VM приходит запрос, выполняется `git pull` и `docker compose up -d --build`.

### 1. На VM: секрет и скрипт

```bash
# Сгенерировать секрет (один раз)
export DEPLOY_SECRET=$(openssl rand -hex 24)
echo "Добавь в вебхук этот секрет: $DEPLOY_SECRET"
```

Сделай `deploy.sh` исполняемым:

```bash
chmod +x ~/git/product_live/deploy/deploy.sh
```

### 2. Запуск приёмника вебхука на VM

**Вариант A: systemd (постоянно)**

Создай файл `/etc/systemd/system/deploy-webhook.service`:

```ini
[Unit]
Description=Deploy webhook for product_live
After=network.target

[Service]
Type=simple
User=YOUR_USER
WorkingDirectory=/home/YOUR_USER/git/product_live/deploy
Environment=DEPLOY_SECRET=ТВОЙ_СЕКРЕТ_ИЗ_ШАГА_1
Environment=PORT=9000
ExecStart=/usr/bin/python3 /home/YOUR_USER/git/product_live/deploy/webhook_server.py
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Подставь `YOUR_USER` (например `yayupokrepov`) и `ТВОЙ_СЕКРЕТ_ИЗ_ШАГА_1`. Затем:

```bash
sudo systemctl daemon-reload
sudo systemctl enable deploy-webhook
sudo systemctl start deploy-webhook
sudo systemctl status deploy-webhook
```

Открой порт 9000 в файрволе VM (в YC — в группе безопасности инстанса): входящий TCP 9000.

**Вариант B: вручную для проверки**

```bash
cd ~/git/product_live/deploy
export DEPLOY_SECRET=твой_секрет
python3 webhook_server.py
```

В другом терминале:

```bash
curl -X POST -H "X-Deploy-Token: твой_секрет" http://localhost:9000/
```

### 3. Настройка вебхука в Git

**GitHub**

1. Репозиторий → Settings → Webhooks → Add webhook.
2. Payload URL: `http://IP_ТВОЕЙ_VM:9000/` (или https, если настроен nginx с SSL).
3. Content type: `application/json`.
4. Secret: тот же `DEPLOY_SECRET`.
5. События: "Just the push event" или "Let me select" → Pushes.
6. В коде вебхука проверка секрета у нас по заголовку `X-Deploy-Token`, а GitHub шлёт в другом формате — проще передавать секрет в URL (только по HTTPS):  
   Payload URL: `https://твой-домен.ru/deploy?token=ТВОЙ_СЕКРЕТ`  
   Либо доработать `webhook_server.py`, чтобы читать заголовок `X-Hub-Signature-256` и проверять подпись GitHub (см. документацию GitHub Webhooks).

Чтобы не усложнять, можно не использовать Secret в GitHub, а только проверять `X-Deploy-Token` на нашей стороне. Тогда в Payload URL просто: `http://IP:9000/`, а при запросе нужно передавать заголовок. GitHub при вебхуке не даёт задать свой заголовок — только Secret (подпись тела). Поэтому два варианта:

- Либо Payload URL с query: `http://IP:9000/?token=СЕКРЕТ` — тогда секрет в URL (нежелательно по HTTP, только по HTTPS или закрытая сеть).
- Либо доработать сервер: принимать любой POST и проверять подпись `X-Hub-Signature-256` от GitHub (HMAC тела запроса).

**Простой вариант для GitHub:** в Payload URL укажи секрет в query (используй только по HTTPS или во внутренней сети):  
`http://IP_VM:9000/?token=ТВОЙ_СЕКРЕТ`

**GitLab**

1. Репозиторий → Settings → Webhooks.
2. URL: `http://IP_VM:9000/?token=ТВОЙ_СЕКРЕТ`.
3. Trigger: Push events.
4. Add webhook.

### 4. Где смотреть логи деплоя

- Сервис вебхука: `journalctl -u deploy-webhook -f`
- Вывод самого деплоя пока в ответе вебхука не отдаётся; при необходимости добавь логирование в `deploy.sh` в файл, например `~/deploy.log`.

---

## Вариант 2: Cron (без вебхука)

Каждые 5 минут проверять обновления и перезапускать при необходимости:

```bash
crontab -e
```

Добавь строку (подставь путь и ветку):

```
*/5 * * * * cd /home/YOUR_USER/git/product_live && git fetch origin && git diff --quiet @ @{u} 2>/dev/null || (git pull origin cursor && docker compose up -d --build)
```

---

## Вариант 3: GitHub Actions (SSH на VM)

В репозитории создай `.github/workflows/deploy.yml`:

```yaml
name: Deploy to YC VM
on:
  push:
    branches: [cursor]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VM_HOST }}
          username: ${{ secrets.VM_USER }}
          key: ${{ secrets.VM_SSH_PRIVATE_KEY }}
          script: |
            cd ~/git/product_live
            git fetch origin && git checkout cursor && git pull origin cursor
            docker compose up -d --build
```

В Settings → Secrets and variables → Actions добавь: `VM_HOST`, `VM_USER`, `VM_SSH_PRIVATE_KEY` (приватный SSH-ключ для входа на VM).
</think>
Дорабатываю сервер для поддержки секрета GitHub (проверка подписи) и обновляю README.
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
Read