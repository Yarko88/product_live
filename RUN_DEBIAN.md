# Запуск проекта на Debian 12

## 1. Установка Docker и Docker Compose

```bash
# Обновление пакетов
sudo apt update && sudo apt upgrade -y

# Зависимости для Docker
sudo apt install -y ca-certificates curl gnupg

# Ключ и репозиторий Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian bookworm stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установка Docker Engine и Docker Compose (плагин)
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Добавить пользователя в группу docker (чтобы не писать sudo каждый раз)
sudo usermod -aG docker $USER
# Выйти из сессии и зайти снова, либо: newgrp docker
```

## 2. Запуск проекта

В каталоге проекта:

```bash
cd /путь/к/Product_the_live

# Сборка и запуск всех сервисов (БД, бэкенд, фронтенд)
docker compose up --build
```

Остановка: `Ctrl+C`. Запуск в фоне: `docker compose up -d --build`.

## 3. Инициализация базы данных (один раз)

После первого запуска создайте таблицы в PostgreSQL:

```bash
docker compose exec backend python -m app.cli_init_db
```

## 4. Доступ к приложению

| Сервис   | URL                    |
|----------|------------------------|
| Frontend | http://localhost:3000  |
| Backend  | http://localhost:8000  |
| API docs | http://localhost:8000/docs |

## 5. Если что-то пошло не так

- **Порты заняты** — убедитесь, что свободны 3000, 8000, 5432: `ss -tlnp | grep -E '3000|8000|5432'`
- **Нет прав на Docker** — выполните `newgrp docker` или перелогиньтесь после `usermod -aG docker $USER`
- **Ошибки при сборке** — полная пересборка без кэша: `docker compose build --no-cache && docker compose up`
