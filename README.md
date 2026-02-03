# HRMS Lite - Human Resource Management System

A lightweight Human Resource Management System built with **FastAPI** (Python) backend and **Angular 17** (TypeScript) frontend.

![HRMS Lite](https://img.shields.io/badge/HRMS-Lite-blue) ![Python](https://img.shields.io/badge/Python-3.9+-green) ![Angular](https://img.shields.io/badge/Angular-17-red) ![MongoDB](https://img.shields.io/badge/MongoDB-6+-green)

## 🌐 Live Demo

- **Frontend:** [https://hrms-lite.vercel.app](https://hrms-lite.vercel.app) *(Update with your deployed URL)*
- **Backend API:** [https://hrms-lite-api.onrender.com](https://hrms-lite-api.onrender.com) *(Update with your deployed URL)*

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)

## ✨ Features

### Core Features
- **Employee Management**
  - Add new employees with details (name, email, phone, department, designation, joining date)
  - View list of all employees with search functionality
  - Delete employees from the system
  - Real-time search filtering
  
- **Attendance Management**
  - Mark daily attendance (Present, Absent, Late, Half Day)
  - Filter attendance by date and status
  - Check-in and check-out time tracking
  - Add notes to attendance records

### Bonus Features
- 📊 **Dashboard** with summary statistics (total employees, today's attendance)
- 📅 **Date filtering** for attendance records
- 📈 **Department-wise** employee distribution chart
- 🏢 **Recent employees** listing on dashboard

### UI Features
- Clean, modern interface with custom SCSS styling
- Responsive design (mobile-friendly)
- Loading states, empty states, and error handling
- Toast notifications for user feedback
- Search and filter functionality

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Angular 17, TypeScript, SCSS |
| **Backend** | FastAPI, Python 3.9+ |
| **Database** | MongoDB with Motor (async driver) |
| **Validation** | Pydantic |
| **Server** | Uvicorn (ASGI) |

## 📁 Project Structure

```
nikita_task/
├── backend_fastapi/               # FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI app entry point
│   │   ├── config/
│   │   │   ├── __init__.py
│   │   │   ├── database.py       # MongoDB async connection
│   │   │   └── settings.py       # Environment settings (Pydantic)
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── employee.py       # Employee Pydantic models
│   │   │   └── attendance.py     # Attendance Pydantic models
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── employee.py       # Employee API routes
│   │   │   └── attendance.py     # Attendance API routes
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── employee.py       # Employee business logic
│   │       └── attendance.py     # Attendance business logic
│   ├── requirements.txt          # Python dependencies
│   ├── .gitignore
│   └── env.example.txt           # Environment variables template
│
├── frontend_angular/              # Angular 17 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── models/       # TypeScript interfaces
│   │   │   │   └── services/     # HTTP services
│   │   │   ├── shared/
│   │   │   │   └── components/   # Reusable UI components
│   │   │   ├── features/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── employees/
│   │   │   │   └── attendance/
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   ├── environments/
│   │   ├── styles.scss           # Global styles
│   │   ├── index.html
│   │   └── main.ts
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Python** 3.9 or higher
- **Node.js** 18 or higher (for Angular CLI)
- **MongoDB** (local installation or MongoDB Atlas account)

### Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd backend_fastapi
   ```

2. **Create and activate a virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create environment file**
   ```bash
   # Copy the template
   cp env.example.txt .env
   
   # Edit .env with your MongoDB connection string
   ```

5. **Start the server**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   
   Backend will run at `http://localhost:8000`
   
   API Documentation (Swagger UI): `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd frontend_angular
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   ng serve
   ```
   
   Frontend will run at `http://localhost:4200`

4. **Open your browser** and navigate to `http://localhost:4200`

### Environment Variables

#### Backend (`backend_fastapi/.env`)
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=hrms_lite
```

For MongoDB Atlas:
```env
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net
DATABASE_NAME=hrms_lite
```

#### Frontend (`frontend_angular/src/environments/`)

Development (`environment.development.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

Production (`environment.production.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-url.onrender.com/api'
};
```

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Employee Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/employees` | Get all employees |
| `GET` | `/employees/{id}` | Get employee by ID |
| `POST` | `/employees` | Create new employee |
| `DELETE` | `/employees/{id}` | Delete employee |

#### Create Employee Request Body
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "department": "Engineering",
  "designation": "Software Engineer",
  "joiningDate": "2024-01-15"
}
```

**Valid Departments:** Engineering, Marketing, Sales, HR, Finance, Operations, Design, Product

### Attendance Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/attendance` | Get all attendance records |
| `GET` | `/attendance/employee/{employeeId}` | Get attendance for specific employee |
| `POST` | `/attendance` | Mark attendance |
| `GET` | `/attendance/dashboard` | Get dashboard statistics |

#### Mark Attendance Request Body
```json
{
  "employeeId": "64abc123def456...",
  "date": "2024-01-15",
  "status": "Present",
  "checkIn": "09:00",
  "checkOut": "18:00",
  "notes": "Worked from office"
}
```

**Valid Status:** `Present`, `Absent`, `Late`, `Half Day`

### Response Format

**Success Response (Employee):**
```json
{
  "id": "64abc123def456...",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "department": "Engineering",
  "designation": "Software Engineer",
  "joiningDate": "2024-01-15T00:00:00",
  "createdAt": "2024-01-15T10:30:00"
}
```

**Dashboard Response:**
```json
{
  "totalEmployees": 10,
  "presentToday": 8,
  "absentToday": 2,
  "departments": [
    { "name": "Engineering", "count": 5 },
    { "name": "Marketing", "count": 3 }
  ]
}
```

**Error Response:**
```json
{
  "detail": "Error description"
}
```

## 🌍 Deployment

### Backend Deployment (Render)

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Root Directory:** `backend_fastapi`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables:**
     - `MONGODB_URL`: Your MongoDB Atlas connection string
     - `DATABASE_NAME`: `hrms_lite`

### Frontend Deployment (Vercel)

1. Import your project on [Vercel](https://vercel.com)
2. Set the **Root Directory** to `frontend_angular`
3. Configure:
   - **Framework Preset:** Angular
   - **Build Command:** `ng build --configuration=production`
   - **Output Directory:** `dist/frontend_angular/browser`
4. Update `environment.production.ts` with your Render backend URL

### MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist IP addresses (0.0.0.0/0 for all IPs)
4. Get your connection string and update `MONGODB_URL`

## ⚠️ Assumptions & Limitations

### Assumptions
- Single admin user (no authentication required as per requirements)
- One attendance record per employee per day (can be updated)
- Employees can be categorized into predefined departments
- Attendance can have various statuses (Present, Absent, Late, Half Day)

### Limitations
- No user authentication/authorization
- No employee profile editing (only add and delete)
- No bulk attendance marking
- No pagination for large datasets
- No data export functionality

### Out of Scope
- Leave management
- Payroll processing
- Multiple admin users
- Role-based access control
- Employee self-service portal

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

Built with ❤️ using FastAPI and Angular

---

⭐ If you found this project helpful, please give it a star!
