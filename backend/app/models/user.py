from datetime import datetime
from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from ..core.db import Base


class User(Base):
  __tablename__ = "users"

  id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
  email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
  hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
  name: Mapped[str | None] = mapped_column(String(255), nullable=True)
  age: Mapped[int | None] = mapped_column(Integer, nullable=True)
  gender: Mapped[str | None] = mapped_column(String(32), nullable=True)
  interests: Mapped[str | None] = mapped_column(String(512), nullable=True)
  is_active: Mapped[bool] = mapped_column(Boolean, default=True)
  created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


