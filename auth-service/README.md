# 🔐 Auth Service

Authentication microservice for CloudTasker - Handles user registration, login, and JWT token management.

---

## 📋 Features

- ✅ User Registration with email validation
- ✅ Secure password hashing with bcrypt (10 rounds)
- ✅ JWT token generation and validation
- ✅ PostgreSQL database integration
- ✅ Protected routes middleware
- ✅ Comprehensive error handling
- ✅ CORS enabled for frontend communication

---

## 🏗️ Architecture

```
auth-service/
├── config/
│   └── db.js                    # PostgreSQL connection pool
├── controllers/
│   └── authController.js        # Register, Login, Get User logic
├── middleware/
│   └── authMiddleware.js        # JWT verification
├── models/
│   └── User.js                  # User database model
├── routes/
│   └── authRoutes.js            # API route definitions
├── server.js                    # Express server setup
├── package.json                 # Dependencies
├── .env                         # Environment variables (not committed)
├── .gitignore                   # Git ignore rules
├── TESTING.md                   # Complete testing guide
└── CloudTasker-Auth.postman_collection.json  # Postman collection

```

---

## 🗄️ Database Schema

### Users Table

| Column     | Type         | Constraints                    |
|------------|--------------|--------------------------------|
| id         | SERIAL       | PRIMARY KEY                    |
| name       | VARCHAR(100) | NOT NULL                       |
| email      | VARCHAR(120) | UNIQUE, NOT NULL               |
| password   | VARCHAR(200) | NOT NULL (bcrypt hashed)       |
| created_at | TIMESTAMP    | DEFAULT NOW()                  |

---

## 🚀 API Endpoints

### Public Endpoints

| Method | Endpoint           | Description              |
|--------|-------------------|--------------------------|
| GET    | `/health`         | Service health check     |
| POST   | `/auth/register`  | Register new user        |
| POST   | `/auth/login`     | Login and get JWT token  |

### Protected Endpoints (Requires JWT)

| Method | Endpoint      | Description          |
|--------|--------------|----------------------|
| GET    | `/auth/me`   | Get current user     |

---

## 📦 Environment Variables

```env
PORT=4001
JWT_SECRET=supersecretkey_change_this_in_production_12345
JWT_EXPIRE=7d
NODE_ENV=development

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=authdb
```

---

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup PostgreSQL
```sql
CREATE DATABASE authdb;
```

### 3. Update .env File
Set your PostgreSQL credentials in `.env`

### 4. Start Service
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

---

## 📝 API Usage Examples

### Register User
```bash
curl -X POST http://localhost:4001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aditya Kumar",
    "email": "aditya@example.com",
    "password": "123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:4001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "aditya@example.com",
    "password": "123456"
  }'
```

### Get Current User (Protected)
```bash
curl -X GET http://localhost:4001/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔒 Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Tokens**: Signed with secret key, 7-day expiration
3. **Token Validation**: Middleware verifies all protected routes
4. **SQL Injection Prevention**: Parameterized queries with pg
5. **CORS Configuration**: Controlled cross-origin access
6. **Error Handling**: No sensitive data exposed in errors

---

## 🧪 Testing

See [TESTING.md](./TESTING.md) for complete testing guide.

Import the Postman collection: `CloudTasker-Auth.postman_collection.json`

---

## 🐳 Docker Support

Dockerfile will be added in Phase 3.

---

## 📈 Performance

- Connection pooling with pg
- Async/await for non-blocking operations
- Efficient bcrypt hashing
- Stateless JWT authentication (scalable)

---

## 🔄 Integration with Other Services

Other microservices can verify JWT tokens by:
1. Sharing the same `JWT_SECRET`
2. Using the same verification logic
3. Making internal API calls to `/auth/me`

---

## 📊 Monitoring

- Health check endpoint: `GET /health`
- Console logs for all operations
- Error tracking in development mode

---

## 🎯 Next Steps

- [ ] Add email verification
- [ ] Add password reset functionality
- [ ] Add refresh tokens
- [ ] Add rate limiting
- [ ] Add user roles (admin, user, manager)
- [ ] Add OAuth integration (Google, GitHub)

---

## 📄 License

ISC

---

**Service Status**: ✅ COMPLETE & TESTED

**Port**: 4001  
**Database**: authdb (PostgreSQL)  
**Tech Stack**: Express.js, PostgreSQL, bcrypt, JWT
