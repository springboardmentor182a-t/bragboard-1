from fastapi import APIRouter, Depends
from .employee_service import EmployeeService

router = APIRouter(prefix="/employee", tags=["Employee Analytics"])

@router.get("/{id}/stats")
def stats(id: int, service: EmployeeService = Depends()):
    return service.employee_stats(id)

@router.get("/{id}/recent")
def recent(id: int, limit: int = 5, service: EmployeeService = Depends()):
    return service.recent_shoutouts(id, limit)

@router.get("/{id}/badges")
def badges(id: int, service: EmployeeService = Depends()):
    return service.compute_badges(id)
