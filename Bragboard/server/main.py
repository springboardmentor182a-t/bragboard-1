from fastapi import FastAPI
from src.database import engine, Base
from src.analytics.admin_controller import router as admin_router
from src.employee.employee_controller import router as employee_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="BragBoard Backend APIs")

app.include_router(admin_router)
app.include_router(employee_router)

@app.get("/")
def root():
    return {"message":"API Server Running ✅"}
