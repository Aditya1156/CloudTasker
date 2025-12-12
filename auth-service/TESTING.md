# Auth Service Setup & Testing Guide

## 📋 Prerequisites

Before starting the Auth Service, you need PostgreSQL installed and running.

---

## 🐘 PostgreSQL Setup

### Option 1: Install PostgreSQL Locally (Recommended for Learning)

#### Windows:
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer (includes pgAdmin 4)
3. Default port: `5432`
4. Set password: `postgres` (or update `.env`)

#### Verify Installation:
```powershell
psql --version
```

---

### Option 2: Use Docker (Quick Setup)

```bash
docker run --name postgres-cloudtasker -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
```

---

## 🗄️ Create Database & Table

### Method 1: Using psql (Command Line)

```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE authdb;

# Connect to authdb
\c authdb

# Table will be created automatically by the app
# But you can verify with:
\dt
```

### Method 2: Using pgAdmin 4 (GUI)

1. Open pgAdmin 4
2. Right-click "Databases" → Create → Database
3. Name: `authdb`
4. Click "Save"

**Note:** The `users` table will be created automatically when you start the server for the first time.

---

## 🚀 Start Auth Service

```powershell
cd C:\Users\adity\OneDrive\Desktop\CloudTasker\auth-service

# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

### Expected Output:
```
✅ Users table ready
✅ PostgreSQL Connected
🚀 Auth Service running on port 4001
Environment: development
Database: authdb
```

---

## 🧪 Test Endpoints with Postman

### 1. Health Check
```
GET http://localhost:4001/health
```

**Expected Response:**
```json
{
  "service": "Auth Service",
  "status": "UP",
  "timestamp": "2025-12-12T10:30:00.000Z"
}
```

---

### 2. Register User
```
POST http://localhost:4001/auth/register
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Aditya Kumar",
  "email": "aditya@example.com",
  "password": "123456"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Aditya Kumar",
    "email": "aditya@example.com",
    "created_at": "2025-12-12T10:30:00.000Z"
  }
}
```

---

### 3. Login User
```
POST http://localhost:4001/auth/login
Content-Type: application/json
```

**Body:**
```json
{
  "email": "aditya@example.com",
  "password": "123456"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Aditya Kumar",
    "email": "aditya@example.com"
  }
}
```

**⚠️ IMPORTANT: Copy the `token` value - you'll need it for protected routes!**

---

### 4. Get Current User (Protected Route)
```
GET http://localhost:4001/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

**Headers:**
- Key: `Authorization`
- Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Aditya Kumar",
    "email": "aditya@example.com",
    "created_at": "2025-12-12T10:30:00.000Z"
  }
}
```

---

## ❌ Error Testing

### Duplicate Email
```
POST http://localhost:4001/auth/register
{
  "name": "Another User",
  "email": "aditya@example.com",
  "password": "654321"
}
```

**Response (409 Conflict):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### Wrong Password
```
POST http://localhost:4001/auth/login
{
  "email": "aditya@example.com",
  "password": "wrongpassword"
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### No Token Provided
```
GET http://localhost:4001/auth/me
(No Authorization header)
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

---

### Invalid Token
```
GET http://localhost:4001/auth/me
Authorization: Bearer invalid_token_here
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

---

## 🔍 Verify Database

Connect to PostgreSQL and check users:

```sql
-- Connect to authdb
\c authdb

-- View all users (passwords are hashed)
SELECT * FROM users;

-- Count users
SELECT COUNT(*) FROM users;
```

---

## 🎯 Success Criteria

✅ All 10 steps complete
✅ Server starts without errors
✅ PostgreSQL connection works
✅ Users table auto-created
✅ Register endpoint works
✅ Login returns JWT token
✅ Protected route requires token
✅ Password stored as hash (not plain text)
✅ Duplicate email rejected
✅ Invalid credentials rejected

---

## 📝 Common Issues & Solutions

### Issue 1: "connect ECONNREFUSED"
**Problem:** PostgreSQL not running
**Solution:** Start PostgreSQL service or Docker container

### Issue 2: "password authentication failed"
**Problem:** Wrong password in `.env`
**Solution:** Update `DB_PASSWORD` in `.env` file

### Issue 3: "database 'authdb' does not exist"
**Problem:** Database not created
**Solution:** Run `CREATE DATABASE authdb;` in psql

### Issue 4: "Port 4001 already in use"
**Problem:** Another process using port
**Solution:** Change `PORT` in `.env` or stop other process

---

## 🔒 Security Notes

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Change JWT_SECRET** in production
3. **Use strong passwords** in production
4. **Enable HTTPS** in production
5. **Add rate limiting** for production
6. **Implement password complexity rules** for production

---

## ✅ Auth Service is COMPLETE!

**What You Built:**
- Full authentication system with JWT
- Password hashing with bcrypt
- PostgreSQL database integration
- Protected routes with middleware
- Proper error handling
- RESTful API design

**Resume Line:**
> Built secure authentication microservice with JWT tokens, bcrypt password hashing, PostgreSQL database, and role-based access control middleware.

---

## 🚀 Next Steps

Once testing is successful:
1. Commit changes to Git
2. Move to **User Service** (Phase 2, Service 2)
3. Or move to **Dockerization** to containerize Auth Service

**Ready to proceed?**
