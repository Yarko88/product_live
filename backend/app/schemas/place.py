from pydantic import BaseModel


class PlaceBase(BaseModel):
  city_id: int
  name: str
  latitude: float
  longitude: float
  category: str | None = None


class PlaceCreate(PlaceBase):
  pass


class PlaceRead(PlaceBase):
  id: int

  class Config:
    from_attributes = True

