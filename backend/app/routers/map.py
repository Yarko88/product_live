from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..core.db import get_db
from ..models.character import Character
from ..models.place import Place
from ..models.visit_scenario import VisitScenario

router = APIRouter(prefix="/map", tags=["map"])


@router.get("/characters/current")
def get_characters_current_state(city_id: int, db: Session = Depends(get_db)):
  """
  Базовый endpoint для карты: возвращает персонажей и то, в каком месте они сейчас
  находятся или куда направляются.

  TODO: доработать логику «живой анимации» и игрового времени.
  """
  now = datetime.now().strftime("%H:%M")

  characters = (
    db.query(Character)
    .filter(Character.city_id == city_id)
    .all()
  )

  result: list[dict] = []

  for ch in characters:
    scenario = (
      db.query(VisitScenario)
      .filter(
        VisitScenario.user_id == ch.user_id,
        VisitScenario.start_time <= now,
        VisitScenario.end_time >= now,
      )
      .first()
    )

    place: Place | None = None
    if scenario:
      place = db.get(Place, scenario.place_id)

    result.append(
      {
        "character_id": ch.id,
        "user_id": ch.user_id,
        "city_id": ch.city_id,
        "avatar_type": ch.avatar_type,
        "status_text": ch.status_text,
        "current_place": {
          "id": place.id,
          "name": place.name,
          "latitude": place.latitude,
          "longitude": place.longitude,
          "category": place.category,
        }
        if place
        else None,
      }
    )

  return result

