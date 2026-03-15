"""
Вспомогательный скрипт для локальной разработки:
создаёт таблицы в БД на основе моделей.

В проде лучше использовать Alembic‑миграции.
"""

from .core.db import Base, engine
from .models import __all_models__  # noqa: F401


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()

