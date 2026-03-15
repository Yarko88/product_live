# Запуск на Ubuntu в Yandex Cloud (белый IP)

VM: Ubuntu, белый IP **158.160.6.2**.

## 1. Установка Docker и Docker Compose на Ubuntu

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
# Перелогиньтесь или: newgrp docker
```

## 2. Открыть порты в фаерволе (на VM)

Чтобы до приложения можно было достучаться по белому IP:

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 3000/tcp  # Frontend
sudo ufw allow 8000/tcp  # Backend API
sudo ufw enable
sudo ufw status
```

В **Yandex Cloud** в настройках сети VM (Security Groups / группы безопасности) тоже должны быть разрешены входящие порты **3000** и **8000** (и 22 для SSH). Иначе трафик до VM не дойдёт.

## 3. Проект на VM

```bash
# Вариант А: клонирование (если проект в репозитории)
git clone <url-репозитория> Product_the_live
cd Product_the_live

# Вариант Б: копирование архива/файлов на VM (scp, rsync и т.п.)
# затем: cd /путь/к/Product_the_live
```

## 4. Запуск

```bash
cd /путь/к/Product_the_live
docker compose up -d --build
```

Инициализация БД (один раз):

```bash
docker compose exec backend python -m app.cli_init_db
```

## 5. Доступ по белому IP

| Что        | URL |
|-----------|-----|
| Сайт      | http://158.160.6.2:3000 |
| API       | http://158.160.6.2:8000 |
| Документация API | http://158.160.6.2:8000/docs |

Фронт уже настроен так, что при открытии по `158.160.6.2:3000` запросы к API уходят на `158.160.6.2:8000` — отдельно ничего не настраивать.

## 6. Безопасность (рекомендации для продакшена)

- **PostgreSQL**: в `docker-compose.yml` у сервиса `db` порт `5432:5432` открывает БД наружу. Для продакшена лучше убрать публикацию порта (оставить только внутреннюю сеть Docker) или биндить на `127.0.0.1:5432:5432`.
- **Пароли**: сменить `POSTGRES_PASSWORD` и в бэкенде `JWT_SECRET_KEY` (через переменные окружения или `.env`).
- Позже можно поставить перед приложением **nginx** и выдать **HTTPS** (Let's Encrypt), оставив 3000/8000 только для localhost.

## 7. Полезные команды

```bash
# Логи
docker compose logs -f

# Остановка
docker compose down

# Перезапуск после изменений
docker compose up -d --build
```
