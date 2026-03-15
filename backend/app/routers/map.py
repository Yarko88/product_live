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
    # Сравнение времени: учитываем сценарии через полночь (например 23:00–04:00).
    # Строковое сравнение "23:00" <= "02:00" ложно, поэтому проверяем вручную.
    def time_in_range(now_hm: str, start: str, end: str) -> bool:
      if start <= end:
        return start <= now_hm <= end
      return now_hm >= start or now_hm <= end  # через полночь

    scenario = (
      db.query(VisitScenario)
      .filter(VisitScenario.user_id == ch.user_id)
      .all()
    )
    scenario = next(
      (s for s in scenario if time_in_range(now, s.start_time, s.end_time)),
      None,
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

