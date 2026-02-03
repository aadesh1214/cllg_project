from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from ..config.database import get_database
from ..models.employee import (
    EmployeeCreate,
    EmployeeResponse,
    EmployeeListResponse,
    EmployeeInDB,
)
from ..services.employee import EmployeeService
from ..services.attendance import AttendanceService

router = APIRouter(prefix="/api/employees", tags=["Employees"])


def get_employee_service():
    """Dependency to get employee service."""
    db = get_database()
    return EmployeeService(db)


def get_attendance_service():
    """Dependency to get attendance service."""
    db = get_database()
    return AttendanceService(db)


@router.get("", response_model=EmployeeListResponse)
async def get_all_employees(
    service: EmployeeService = Depends(get_employee_service)
):
    """Get all employees."""
    employees = await service.get_all()
    return EmployeeListResponse(
        success=True,
        count=len(employees),
        data=employees
    )


@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(
    employee_id: str,
    service: EmployeeService = Depends(get_employee_service)
):
    """Get a single employee by ID."""
    employee = await service.get_by_id(employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    return EmployeeResponse(
        success=True,
        data=employee
    )


@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(
    employee_data: EmployeeCreate,
    service: EmployeeService = Depends(get_employee_service)
):
    """Create a new employee."""
    employee = await service.create(employee_data)
    return EmployeeResponse(
        success=True,
        message="Employee created successfully",
        data=employee
    )


@router.delete("/{employee_id}", response_model=dict)
async def delete_employee(
    employee_id: str,
    employee_service: EmployeeService = Depends(get_employee_service),
    attendance_service: AttendanceService = Depends(get_attendance_service)
):
    """Delete an employee and their attendance records."""
    # Check if employee exists
    employee = await employee_service.get_by_id(employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Delete attendance records first
    await attendance_service.delete_by_employee(employee_id)
    
    # Delete employee
    deleted = await employee_service.delete(employee_id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete employee"
        )
    
    return {
        "success": True,
        "message": "Employee and associated attendance records deleted successfully",
        "data": {}
    }
