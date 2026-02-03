from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status

from ..models.employee import EmployeeCreate, EmployeeInDB, VALID_DEPARTMENTS


class EmployeeService:
    """Service class for employee operations."""
    
    def __init__(self, database: AsyncIOMotorDatabase):
        self.collection = database["employees"]
    
    async def get_all(self) -> List[EmployeeInDB]:
        """Get all employees sorted by creation date (newest first)."""
        employees = []
        cursor = self.collection.find().sort("created_at", -1)
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            employees.append(EmployeeInDB(**doc))
        return employees
    
    async def get_by_id(self, employee_id: str) -> Optional[EmployeeInDB]:
        """Get a single employee by MongoDB ID."""
        if not ObjectId.is_valid(employee_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid employee ID format"
            )
        
        doc = await self.collection.find_one({"_id": ObjectId(employee_id)})
        if doc:
            doc["_id"] = str(doc["_id"])
            return EmployeeInDB(**doc)
        return None
    
    async def create(self, employee_data: EmployeeCreate) -> EmployeeInDB:
        """Create a new employee."""
        # Check for duplicate employee_id
        existing = await self.collection.find_one({
            "employee_id": employee_data.employee_id
        })
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Employee with ID '{employee_data.employee_id}' already exists"
            )
        
        # Check for duplicate email
        existing_email = await self.collection.find_one({
            "email": employee_data.email
        })
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Employee with email '{employee_data.email}' already exists"
            )
        
        # Create employee document
        now = datetime.utcnow()
        employee_doc = {
            **employee_data.model_dump(),
            "created_at": now,
            "updated_at": now,
        }
        
        result = await self.collection.insert_one(employee_doc)
        employee_doc["_id"] = str(result.inserted_id)
        
        return EmployeeInDB(**employee_doc)
    
    async def delete(self, employee_id: str) -> bool:
        """Delete an employee by MongoDB ID."""
        if not ObjectId.is_valid(employee_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid employee ID format"
            )
        
        result = await self.collection.delete_one({"_id": ObjectId(employee_id)})
        return result.deleted_count > 0
    
    async def get_department_stats(self) -> List[dict]:
        """Get employee count by department."""
        pipeline = [
            {"$group": {"_id": "$department", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        stats = []
        async for doc in self.collection.aggregate(pipeline):
            stats.append(doc)
        return stats
    
    async def count(self) -> int:
        """Get total employee count."""
        return await self.collection.count_documents({})
