from pydantic import BaseModel


class VisitScenarioBase(BaseModel):
  user_id: int
  place_id: int
  start_time: str  # "23:00"
  end_time: str    # "04:00"
  description: str | None = None


class VisitScenarioCreate(VisitScenarioBase):
  pass


class VisitScenarioRead(VisitScenarioBase):
  id: int

  class Config:
    from_attributes = True

