# CloudTasker - Microservices Project Management Platform

A Trello-like project management system built with microservices architecture, Docker, Kubernetes, and AWS cloud services.

## 🏗️ Architecture

CloudTasker is built using a **microservices architecture** with the following services:

| Service | Port | Purpose | Database |
|---------|------|---------|----------|
| **auth-service** | 4001 | User authentication, JWT tokens | MongoDB (cloudtasker_auth) |
| **user-service** | 4002 | User profiles and roles | MongoDB (cloudtasker_users) |
| **project-service** | 4003 | Project and team management | MongoDB (cloudtasker_projects) |
| **task-service** | 4004 | Task creation and comments | MongoDB (cloudtasker_tasks) |
| **file-service** | 4005 | File uploads to AWS S3 | No DB (S3 storage) |
| **frontend** | 5173 | React + TypeScript + Vite | - |

## 📁 Project Structure

```
cloudtasker/
├── auth-service/          # Authentication microservice
├── user-service/          # User management microservice
├── project-service/       # Project management microservice
├── task-service/          # Task management microservice
├── file-service/          # File upload microservice
├── client/                # Frontend React application
│   └── cloudtasker/
├── docker/                # Docker configurations
├── k8s/                   # Kubernetes manifests
├── docs/                  # Documentation
└── server/                # (Legacy - will be removed)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Docker)
- Docker Desktop
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd CloudTasker
   ```

2. **Install dependencies for each service**
   ```bash
   # Auth Service
   cd auth-service && npm install

   # User Service
   cd ../user-service && npm install

   # Project Service
   cd ../project-service && npm install

   # Task Service
   cd ../task-service && npm install

   # File Service
   cd ../file-service && npm install

   # Frontend
   cd ../client/cloudtasker && npm install
   ```

3. **Set up environment variables**
   - Each service has a `.env` file with default values
   - Update MongoDB URIs if needed
   - AWS credentials required only for file-service (Phase 5)

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest

   # Or use local MongoDB installation
   ```

5. **Run services**
   ```bash
   # Terminal 1: Auth Service
   cd auth-service && npm run dev

   # Terminal 2: User Service
   cd user-service && npm run dev

   # Terminal 3: Project Service
   cd project-service && npm run dev

   # Terminal 4: Task Service
   cd task-service && npm run dev

   # Terminal 5: File Service
   cd file-service && npm run dev

   # Terminal 6: Frontend
   cd client/cloudtasker && npm run dev
   ```

## 🧪 Testing Services

Test each service health endpoint:

```bash
# Auth Service
curl http://localhost:4001/health

# User Service
curl http://localhost:4002/health

# Project Service
curl http://localhost:4003/health

# Task Service
curl http://localhost:4004/health

# File Service
curl http://localhost:4005/health
```

## 📋 Development Phases

- [x] **Phase 1**: Foundation Setup ✅
  - Project structure created
  - All microservices initialized
  - Basic health check endpoints working

- [ ] **Phase 2**: Backend Development (Weeks 1-3)
  - Build Auth Service with JWT
  - Build User Service
  - Build Project Service
  - Build Task Service
  - Build File Service with AWS S3

- [ ] **Phase 3**: Dockerization (Week 4)
- [ ] **Phase 4**: Kubernetes (Week 5)
- [ ] **Phase 5**: AWS Integration (Week 6-7)
- [ ] **Phase 6**: CI/CD (Week 8)
- [ ] **Phase 7**: Advanced Features (Week 9-10)
- [ ] **Phase 8**: Documentation (Week 11)

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React 19
- TypeScript
- Vite
- Axios
- React Router

### DevOps
- Docker
- Kubernetes
- GitHub Actions (CI/CD)

### Cloud (AWS)
- EC2
- S3
- RDS (PostgreSQL option)
- CloudFront
- IAM
- Secrets Manager

## 📖 Documentation

Detailed documentation for each phase is available in the `/docs` folder.

## 🎯 Learning Goals

This project teaches:
- Microservices architecture
- RESTful API design
- JWT authentication
- Database design (separate DBs per service)
- Docker containerization
- Kubernetes orchestration
- AWS cloud services
- CI/CD pipelines

## 📝 License

ISC

## 👤 Author

Your Name

---

**Current Status**: Phase 1 Complete ✅ | Moving to Phase 2: Auth Service Development
