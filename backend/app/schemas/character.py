from pydantic import BaseModel


class CharacterBase(BaseModel):
  user_id: int
  city_id: int
  avatar_type: str | None = None
  status_text: str | None = None


class CharacterCreate(CharacterBase):
  pass


class CharacterRead(CharacterBase):
  id: int

  class Config:
    from_attributes = True

