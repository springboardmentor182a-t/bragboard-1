from fastapi import APIRouter

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)

# ---------- ADMIN DASHBOARD ----------
@router.get("/admin")
def get_admin_dashboard():
    return {
        "totalEmployees": 12,
        "totalShoutouts": 48,
        "pendingApprovals": 3
    }


# ---------- EMPLOYEE DASHBOARD ----------
@router.get("/employee/{employee_id}")
def get_employee_dashboard(employee_id: int):
    return {
        "employeeId": employee_id,
        "name": "Demo Employee",
        "shoutoutsReceived": 5,
        "shoutoutsGiven": 3,
        "tasksDue": 2
    }
