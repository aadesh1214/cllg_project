from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Literal
from datetime import datetime, date
from bson import ObjectId


class AttendanceBase(BaseModel):
    """Base attendance model."""
    
    employee_id: str = Field(..., description="MongoDB ObjectId of the employee")
    date: date = Field(..., description="Attendance date")
    status: Literal["Present", "Absent"] = Field(..., description="Attendance status")
    
    @field_validator("employee_id")
    @classmethod
    def validate_employee_id(cls, v: str) -> str:
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid employee ID format")
        return v


class AttendanceCreate(AttendanceBase):
    """Model for creating/marking attendance."""
    pass


class EmployeeInfo(BaseModel):
    """Embedded employee info in attendance response."""
    
    id: str = Field(..., alias="_id")
    employee_id: str
    full_name: str
    email: str
    department: str
    
    class Config:
        populate_by_name = True


class AttendanceInDB(BaseModel):
    """Model for attendance stored in database."""
    
    id: str = Field(..., alias="_id")
    employee: Optional[EmployeeInfo] = None
    date: date
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class AttendanceResponse(BaseModel):
    """API response model for a single attendance record."""
    
    success: bool = True
    message: Optional[str] = None
    data: Optional[AttendanceInDB] = None


class AttendanceListResponse(BaseModel):
    """API response model for list of attendance records."""
    
    success: bool = True
    count: int = 0
    data: List[AttendanceInDB] = []


class AttendanceSummaryData(BaseModel):
    """Attendance summary statistics."""
    
    total_days: int = 0
    present_days: int = 0
    absent_days: int = 0


class EmployeeSummaryInfo(BaseModel):
    """Employee info for summary response."""
    
    id: str = Field(..., alias="_id")
    employee_id: str
    full_name: str
    
    class Config:
        populate_by_name = True


class AttendanceSummary(BaseModel):
    """API response model for attendance summary."""
    
    success: bool = True
    data: Optional[dict] = None


class TodayStats(BaseModel):
    """Today's attendance statistics."""
    
    date: str
    present: int = 0
    absent: int = 0
    not_marked: int = 0


class DepartmentStat(BaseModel):
    """Department-wise employee count."""
    
    department: str = Field(..., alias="_id")
    count: int
    
    class Config:
        populate_by_name = True


class DashboardData(BaseModel):
    """Dashboard data model."""
    
    total_employees: int = 0
    today_stats: TodayStats
    department_stats: List[DepartmentStat] = []


class DashboardResponse(BaseModel):
    """API response model for dashboard."""
    
    success: bool = True
    data: Optional[DashboardData] = None
