"""
Вспомогательный скрипт для локальной разработки:
создаёт таблицы в БД на основе моделей и тестового пользователя (если нет ни одного).

В проде лучше использовать Alembic‑миграции.
"""

from .core.db import Base, engine, SessionLocal
from .core.security import hash_password
from .models import __all_models__  # noqa: F401
from .models.user import User


def init_db() -> None:
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        if db.query(User).first() is None:
            user = User(
                email="user@live.city",
                hashed_password=hash_password("password123"),
                name="Тестовый пользователь",
                age=25,
                gender="м",
                interests="бары, кафе",
            )
            db.add(user)
            db.commit()
            print("Создан тестовый пользователь: user@live.city / password123")
        else:
            print("Пользователи уже есть, тестовый не создаётся.")
    finally:
        db.close()


if __name__ == "__main__":
    init_db()

