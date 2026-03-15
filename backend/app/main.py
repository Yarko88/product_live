from fastapi import FastAPI

from .config import settings
from .routers import places, visit_scenarios, map as map_router, auth

app = FastAPI(title=settings.app_name, debug=settings.debug)


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(auth.router)
app.include_router(places.router)
app.include_router(visit_scenarios.router)
app.include_router(map_router.router)


