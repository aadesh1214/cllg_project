from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional, List, Literal
from datetime import datetime
from bson import ObjectId


# Valid departments
VALID_DEPARTMENTS = [
    "Engineering",
    "Human Resources", 
    "Finance",
    "Marketing",
    "Sales",
    "Operations",
    "IT",
    "Legal",
    "Other",
]


class PyObjectId(str):
    """Custom type for MongoDB ObjectId."""
    
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    
    @classmethod
    def validate(cls, v, info):
        if isinstance(v, ObjectId):
            return str(v)
        if isinstance(v, str) and ObjectId.is_valid(v):
            return v
        raise ValueError("Invalid ObjectId")


class EmployeeBase(BaseModel):
    """Base employee model with common fields."""
    
    employee_id: str = Field(..., min_length=1, max_length=20, description="Unique employee ID")
    full_name: str = Field(..., min_length=2, max_length=100, description="Employee full name")
    email: EmailStr = Field(..., description="Employee email address")
    department: str = Field(..., description="Employee department")
    
    @field_validator("employee_id")
    @classmethod
    def validate_employee_id(cls, v: str) -> str:
        return v.strip().upper()
    
    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        return v.strip()
    
    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        return v.strip().lower()
    
    @field_validator("department")
    @classmethod
    def validate_department(cls, v: str) -> str:
        if v not in VALID_DEPARTMENTS:
            raise ValueError(f"Department must be one of: {', '.join(VALID_DEPARTMENTS)}")
        return v


class EmployeeCreate(EmployeeBase):
    """Model for creating a new employee."""
    pass


class EmployeeInDB(EmployeeBase):
    """Model for employee stored in database."""
    
    id: str = Field(..., alias="_id")
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class EmployeeResponse(BaseModel):
    """API response model for a single employee."""
    
    success: bool = True
    message: Optional[str] = None
    data: Optional[EmployeeInDB] = None


class EmployeeListResponse(BaseModel):
    """API response model for list of employees."""
    
    success: bool = True
    count: int = 0
    data: List[EmployeeInDB] = []
