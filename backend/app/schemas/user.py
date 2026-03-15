from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
  email: EmailStr
  name: str | None = None
  age: int | None = None
  gender: str | None = None
  interests: str | None = None


class UserCreate(UserBase):
  password: str


class UserRead(UserBase):
  id: int

  class Config:
    from_attributes = True

