from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.db import Base


class Character(Base):
  __tablename__ = "characters"

  id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
  user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
  city_id: Mapped[int] = mapped_column(ForeignKey("cities.id"), nullable=False, index=True)
  avatar_type: Mapped[str | None] = mapped_column(String(64), nullable=True)
  status_text: Mapped[str | None] = mapped_column(String(255), nullable=True)

  user = relationship("User", backref="characters")
  city = relationship("City", backref="characters")


