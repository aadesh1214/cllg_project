from typing import List, Optional
from datetime import datetime, date, timedelta
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status

from ..models.attendance import (
    AttendanceCreate,
    AttendanceInDB,
    EmployeeInfo,
    AttendanceSummaryData,
)


class AttendanceService:
    """Service class for attendance operations."""
    
    def __init__(self, database: AsyncIOMotorDatabase):
        self.database = database
        self.collection = database["attendance"]
        self.employees_collection = database["employees"]
    
    async def _populate_employee(self, attendance_doc: dict) -> dict:
        """Populate employee info in attendance document."""
        if "employee_id" in attendance_doc:
            employee = await self.employees_collection.find_one({
                "_id": ObjectId(attendance_doc["employee_id"])
            })
            if employee:
                employee["_id"] = str(employee["_id"])
                attendance_doc["employee"] = EmployeeInfo(**employee)
        return attendance_doc
    
    async def get_all(
        self,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> List[AttendanceInDB]:
        """Get all attendance records with optional date filtering."""
        query = {}
        
        if start_date and end_date:
            query["date"] = {
                "$gte": datetime.combine(start_date, datetime.min.time()),
                "$lte": datetime.combine(end_date, datetime.max.time()),
            }
        elif start_date:
            query["date"] = {"$gte": datetime.combine(start_date, datetime.min.time())}
        elif end_date:
            query["date"] = {"$lte": datetime.combine(end_date, datetime.max.time())}
        
        records = []
        cursor = self.collection.find(query).sort("date", -1)
        
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            doc["date"] = doc["date"].date() if isinstance(doc["date"], datetime) else doc["date"]
            doc = await self._populate_employee(doc)
            records.append(AttendanceInDB(**doc))
        
        return records
    
    async def get_by_employee(
        self,
        employee_id: str,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> List[AttendanceInDB]:
        """Get attendance records for a specific employee."""
        if not ObjectId.is_valid(employee_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid employee ID format"
            )
        
        # Check if employee exists
        employee = await self.employees_collection.find_one({"_id": ObjectId(employee_id)})
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found"
            )
        
        query = {"employee_id": employee_id}
        
        if start_date and end_date:
            query["date"] = {
                "$gte": datetime.combine(start_date, datetime.min.time()),
                "$lte": datetime.combine(end_date, datetime.max.time()),
            }
        
        records = []
        cursor = self.collection.find(query).sort("date", -1)
        
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            doc["date"] = doc["date"].date() if isinstance(doc["date"], datetime) else doc["date"]
            doc = await self._populate_employee(doc)
            records.append(AttendanceInDB(**doc))
        
        return records
    
    async def mark_attendance(self, attendance_data: AttendanceCreate) -> AttendanceInDB:
        """Mark or update attendance for an employee."""
        # Check if employee exists
        employee = await self.employees_collection.find_one({
            "_id": ObjectId(attendance_data.employee_id)
        })
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found"
            )
        
        # Convert date to datetime for MongoDB
        attendance_date = datetime.combine(attendance_data.date, datetime.min.time())
        
        # Check for existing attendance on the same date
        existing = await self.collection.find_one({
            "employee_id": attendance_data.employee_id,
            "date": attendance_date,
        })
        
        now = datetime.utcnow()
        
        if existing:
            # Update existing attendance
            await self.collection.update_one(
                {"_id": existing["_id"]},
                {
                    "$set": {
                        "status": attendance_data.status,
                        "updated_at": now,
                    }
                }
            )
            existing["_id"] = str(existing["_id"])
            existing["status"] = attendance_data.status
            existing["updated_at"] = now
            existing["date"] = attendance_data.date
            existing = await self._populate_employee(existing)
            return AttendanceInDB(**existing)
        
        # Create new attendance record
        attendance_doc = {
            "employee_id": attendance_data.employee_id,
            "date": attendance_date,
            "status": attendance_data.status,
            "created_at": now,
            "updated_at": now,
        }
        
        result = await self.collection.insert_one(attendance_doc)
        attendance_doc["_id"] = str(result.inserted_id)
        attendance_doc["date"] = attendance_data.date
        attendance_doc = await self._populate_employee(attendance_doc)
        
        return AttendanceInDB(**attendance_doc)
    
    async def get_employee_summary(self, employee_id: str) -> dict:
        """Get attendance summary for an employee."""
        if not ObjectId.is_valid(employee_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid employee ID format"
            )
        
        # Check if employee exists
        employee = await self.employees_collection.find_one({"_id": ObjectId(employee_id)})
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found"
            )
        
        # Aggregate attendance stats
        pipeline = [
            {"$match": {"employee_id": employee_id}},
            {"$group": {"_id": "$status", "count": {"$sum": 1}}},
        ]
        
        summary = AttendanceSummaryData()
        async for doc in self.collection.aggregate(pipeline):
            if doc["_id"] == "Present":
                summary.present_days = doc["count"]
            elif doc["_id"] == "Absent":
                summary.absent_days = doc["count"]
            summary.total_days += doc["count"]
        
        return {
            "employee": {
                "_id": str(employee["_id"]),
                "employee_id": employee["employee_id"],
                "full_name": employee["full_name"],
            },
            "summary": summary.model_dump(),
        }
    
    async def get_today_stats(self) -> dict:
        """Get today's attendance statistics."""
        today = datetime.combine(date.today(), datetime.min.time())
        tomorrow = today + timedelta(days=1)
        
        # Get today's attendance records
        cursor = self.collection.find({
            "date": {"$gte": today, "$lt": tomorrow}
        })
        
        present = 0
        absent = 0
        
        async for doc in cursor:
            if doc["status"] == "Present":
                present += 1
            elif doc["status"] == "Absent":
                absent += 1
        
        # Get total employees
        total_employees = await self.employees_collection.count_documents({})
        
        return {
            "date": date.today().isoformat(),
            "present": present,
            "absent": absent,
            "not_marked": total_employees - present - absent,
        }
    
    async def delete_by_employee(self, employee_id: str) -> int:
        """Delete all attendance records for an employee."""
        result = await self.collection.delete_many({"employee_id": employee_id})
        return result.deleted_count
