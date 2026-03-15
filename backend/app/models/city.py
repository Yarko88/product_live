from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from ..core.db import Base


class City(Base):
  __tablename__ = "cities"

  id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
  name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)


