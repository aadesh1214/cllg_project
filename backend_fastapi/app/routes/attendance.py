from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Optional
from datetime import date

from ..config.database import get_database
from ..models.attendance import (
    AttendanceCreate,
    AttendanceResponse,
    AttendanceListResponse,
    AttendanceSummary,
    DashboardResponse,
    DashboardData,
    TodayStats,
)
from ..services.attendance import AttendanceService
from ..services.employee import EmployeeService

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])


def get_attendance_service():
    """Dependency to get attendance service."""
    db = get_database()
    return AttendanceService(db)


def get_employee_service():
    """Dependency to get employee service."""
    db = get_database()
    return EmployeeService(db)


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    attendance_service: AttendanceService = Depends(get_attendance_service),
    employee_service: EmployeeService = Depends(get_employee_service)
):
    """Get dashboard summary statistics."""
    total_employees = await employee_service.count()
    today_stats = await attendance_service.get_today_stats()
    department_stats = await employee_service.get_department_stats()
    
    return DashboardResponse(
        success=True,
        data=DashboardData(
            total_employees=total_employees,
            today_stats=TodayStats(**today_stats),
            department_stats=department_stats
        )
    )


@router.get("/summary/{employee_id}", response_model=AttendanceSummary)
async def get_attendance_summary(
    employee_id: str,
    service: AttendanceService = Depends(get_attendance_service)
):
    """Get attendance summary for a specific employee."""
    summary = await service.get_employee_summary(employee_id)
    return AttendanceSummary(success=True, data=summary)


@router.get("/employee/{employee_id}", response_model=AttendanceListResponse)
async def get_employee_attendance(
    employee_id: str,
    start_date: Optional[date] = Query(None, description="Start date for filtering"),
    end_date: Optional[date] = Query(None, description="End date for filtering"),
    service: AttendanceService = Depends(get_attendance_service)
):
    """Get attendance records for a specific employee."""
    records = await service.get_by_employee(employee_id, start_date, end_date)
    return AttendanceListResponse(
        success=True,
        count=len(records),
        data=records
    )


@router.get("", response_model=AttendanceListResponse)
async def get_all_attendance(
    start_date: Optional[date] = Query(None, description="Start date for filtering"),
    end_date: Optional[date] = Query(None, description="End date for filtering"),
    service: AttendanceService = Depends(get_attendance_service)
):
    """Get all attendance records with optional date filtering."""
    records = await service.get_all(start_date, end_date)
    return AttendanceListResponse(
        success=True,
        count=len(records),
        data=records
    )


@router.post("", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
async def mark_attendance(
    attendance_data: AttendanceCreate,
    service: AttendanceService = Depends(get_attendance_service)
):
    """Mark attendance for an employee."""
    attendance = await service.mark_attendance(attendance_data)
    return AttendanceResponse(
        success=True,
        message="Attendance marked successfully",
        data=attendance
    )
