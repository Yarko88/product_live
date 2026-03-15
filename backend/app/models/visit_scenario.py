from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.db import Base


class VisitScenario(Base):
  __tablename__ = "visit_scenarios"

  id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
  user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
  place_id: Mapped[int] = mapped_column(ForeignKey("places.id"), nullable=False, index=True)
  start_time: Mapped[str] = mapped_column(String(5), nullable=False)  # "23:00"
  end_time: Mapped[str] = mapped_column(String(5), nullable=False)    # "04:00"
  description: Mapped[str | None] = mapped_column(String(2000), nullable=True)

  user = relationship("User", backref="visit_scenarios")
  place = relationship("Place", backref="visit_scenarios")


