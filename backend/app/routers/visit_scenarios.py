from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..core.db import get_db
from ..models.visit_scenario import VisitScenario
from ..schemas.visit_scenario import VisitScenarioCreate, VisitScenarioRead

router = APIRouter(prefix="/visit-scenarios", tags=["visit_scenarios"])


@router.post("/", response_model=VisitScenarioRead, status_code=status.HTTP_201_CREATED)
def create_visit_scenario(payload: VisitScenarioCreate, db: Session = Depends(get_db)):
  scenario = VisitScenario(**payload.model_dump())
  db.add(scenario)
  db.commit()
  db.refresh(scenario)
  return scenario


@router.get("/", response_model=list[VisitScenarioRead])
def list_visit_scenarios(user_id: int | None = None, db: Session = Depends(get_db)):
  query = db.query(VisitScenario)
  if user_id is not None:
    query = query.filter(VisitScenario.user_id == user_id)
  return query.all()


@router.get("/{scenario_id}", response_model=VisitScenarioRead)
def get_visit_scenario(scenario_id: int, db: Session = Depends(get_db)):
  scenario = db.get(VisitScenario, scenario_id)
  if not scenario:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scenario not found")
  return scenario


@router.put("/{scenario_id}", response_model=VisitScenarioRead)
def update_visit_scenario(
  scenario_id: int, payload: VisitScenarioCreate, db: Session = Depends(get_db)
):
  scenario = db.get(VisitScenario, scenario_id)
  if not scenario:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scenario not found")
  for key, value in payload.model_dump().items():
    setattr(scenario, key, value)
  db.commit()
  db.refresh(scenario)
  return scenario


@router.delete("/{scenario_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_visit_scenario(scenario_id: int, db: Session = Depends(get_db)):
  scenario = db.get(VisitScenario, scenario_id)
  if not scenario:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scenario not found")
  db.delete(scenario)
  db.commit()
  return None

