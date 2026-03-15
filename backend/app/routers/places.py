from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..core.db import get_db
from ..models.place import Place
from ..schemas.place import PlaceCreate, PlaceRead

router = APIRouter(prefix="/places", tags=["places"])


@router.post("/", response_model=PlaceRead, status_code=status.HTTP_201_CREATED)
def create_place(payload: PlaceCreate, db: Session = Depends(get_db)):
  place = Place(**payload.model_dump())
  db.add(place)
  db.commit()
  db.refresh(place)
  return place


@router.get("/", response_model=list[PlaceRead])
def list_places(city_id: int | None = None, db: Session = Depends(get_db)):
  query = db.query(Place)
  if city_id is not None:
    query = query.filter(Place.city_id == city_id)
  return query.all()


@router.get("/{place_id}", response_model=PlaceRead)
def get_place(place_id: int, db: Session = Depends(get_db)):
  place = db.get(Place, place_id)
  if not place:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Place not found")
  return place


@router.put("/{place_id}", response_model=PlaceRead)
def update_place(place_id: int, payload: PlaceCreate, db: Session = Depends(get_db)):
  place = db.get(Place, place_id)
  if not place:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Place not found")
  for key, value in payload.model_dump().items():
    setattr(place, key, value)
  db.commit()
  db.refresh(place)
  return place


@router.delete("/{place_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_place(place_id: int, db: Session = Depends(get_db)):
  place = db.get(Place, place_id)
  if not place:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Place not found")
  db.delete(place)
  db.commit()
  return None

