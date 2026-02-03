# HRMS Lite - Human Resource Management System

A lightweight, full-stack Human Resource Management System built with the MERN stack. This application allows administrators to manage employee records and track daily attendance.

![HRMS Lite](https://img.shields.io/badge/HRMS-Lite-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![React](https://img.shields.io/badge/React-18-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-6+-green)

## 🌐 Live Demo

- **Frontend:** [https://hrms-lite.vercel.app](https://hrms-lite.vercel.app) *(Update with your deployed URL)*
- **Backend API:** [https://hrms-lite-api.onrender.com](https://hrms-lite-api.onrender.com) *(Update with your deployed URL)*

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Assumptions & Limitations](#assumptions--limitations)

## ✨ Features

### Core Features
- **Employee Management**
  - Add new employees with ID, name, email, and department
  - View list of all employees with search functionality
  - Delete employees (with cascading deletion of attendance records)
  
- **Attendance Management**
  - Mark daily attendance (Present/Absent) for employees
  - View attendance records for all employees or specific employee
  - Automatic update if attendance already exists for the same date

### Bonus Features
- 📊 **Dashboard** with summary statistics (total employees, today's attendance)
- 📅 **Date filtering** for attendance records
- 📈 **Attendance summary** showing total present/absent days per employee
- 🏢 **Department-wise** employee distribution

### UI Features
- Clean, professional interface using Chakra UI
- Responsive design (mobile-friendly)
- Loading states, empty states, and error handling
- Toast notifications for user feedback
- Search and filter functionality

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Chakra UI |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **HTTP Client** | Axios |
| **Routing** | React Router v6 |

## 📁 Project Structure

```
hrms-lite/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── employeeController.js
│   │   │   └── attendanceController.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js    # Global error handling
│   │   ├── models/
│   │   │   ├── Employee.js        # Employee schema
│   │   │   └── Attendance.js      # Attendance schema
│   │   └── routes/
│   │       ├── employeeRoutes.js
│   │       └── attendanceRoutes.js
│   ├── server.js                  # Entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/                   # API service layer
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page components
│   │   ├── theme/                 # Chakra UI theme
│   │   ├── utils/                 # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hrms-lite.git
   cd hrms-lite
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

#### Backend (`backend/.env`)
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/hrms-lite
FRONTEND_URL=http://localhost:3000
```

For MongoDB Atlas:
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/hrms-lite?retryWrites=true&w=majority
```

#### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5001
```

### Running Locally

1. **Start MongoDB** (if using local installation)
   ```bash
   mongod
   ```

2. **Start the Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run at `http://localhost:5001`

3. **Start the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run at `http://localhost:3000`

4. **Open your browser** and navigate to `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Employee Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/employees` | Get all employees |
| `GET` | `/employees/:id` | Get employee by ID |
| `POST` | `/employees` | Create new employee |
| `DELETE` | `/employees/:id` | Delete employee |

#### Create Employee Request Body
```json
{
  "employeeId": "EMP001",
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "department": "Engineering"
}
```

**Valid Departments:** Engineering, Human Resources, Finance, Marketing, Sales, Operations, IT, Legal, Other

### Attendance Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/attendance` | Get all attendance records |
| `GET` | `/attendance?startDate=&endDate=` | Filter by date range |
| `GET` | `/attendance/employee/:employeeId` | Get attendance for specific employee |
| `POST` | `/attendance` | Mark attendance |
| `GET` | `/attendance/summary/:employeeId` | Get attendance summary |
| `GET` | `/attendance/dashboard` | Get dashboard statistics |

#### Mark Attendance Request Body
```json
{
  "employeeId": "64abc123def456...",
  "date": "2026-02-03",
  "status": "Present"
}
```

**Valid Status:** `Present`, `Absent`

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

## 🌍 Deployment

### Backend Deployment (Render)

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment Variables:**
     - `PORT`: 5001
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `FRONTEND_URL`: Your Vercel frontend URL

### Frontend Deployment (Vercel)

1. Import your project on [Vercel](https://vercel.com)
2. Set the **Root Directory** to `frontend`
3. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:**
     - `VITE_API_URL`: Your Render backend URL

### MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist IP addresses (0.0.0.0/0 for all IPs)
4. Get your connection string and update `MONGO_URI`

## ⚠️ Assumptions & Limitations

### Assumptions
- Single admin user (no authentication required as per requirements)
- One attendance record per employee per day
- Employees can only be added with predefined department options
- Attendance can only be marked for current or past dates

### Limitations
- No user authentication/authorization
- No employee profile editing (only add and delete)
- No bulk attendance marking
- No attendance editing/deletion (only update by re-marking)
- No pagination for large datasets
- No data export functionality

### Out of Scope
- Leave management
- Payroll processing
- Multiple admin users
- Role-based access control
- Employee self-service portal

## 📝 License

This project is created for educational/assessment purposes.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

⭐ If you found this project helpful, please give it a star!
