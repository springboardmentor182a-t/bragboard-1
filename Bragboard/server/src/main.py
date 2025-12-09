from fastapi import FastAPI
from routers.report_routers import router as report_router

app = FastAPI(
    title="Reporting Shoutouts API",
    version="1.0.0",
    description="APIs for employees to report shoutouts and for admins to manage reports."
)

# Mount the Reports router
app.include_router(report_router)


@app.get("/", tags=["Health"])
def read_root():
    return {"message": "Reporting Shoutouts API is running"}
