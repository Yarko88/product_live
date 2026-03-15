from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.db import Base


class Place(Base):
  __tablename__ = "places"

  id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
  city_id: Mapped[int] = mapped_column(ForeignKey("cities.id"), nullable=False, index=True)
  name: Mapped[str] = mapped_column(String(255), nullable=False)
  latitude: Mapped[float] = mapped_column(Float, nullable=False)
  longitude: Mapped[float] = mapped_column(Float, nullable=False)
  category: Mapped[str | None] = mapped_column(String(64), nullable=True)

  city = relationship("City", backref="places")


