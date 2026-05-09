# Team Task Manager

A full-stack task management application designed for teams. Features role-based access control, JWT authentication, project management, and task status tracking.

## Tech Stack
- **Backend**: Java, Spring Boot, Spring Security (JWT), Spring Data JPA
- **Database**: MySQL
- **Frontend**: React.js, React Router, Vite, Bootstrap, Axios

## Features
- **Authentication**: Secure login and signup using stateless JWT tokens.
- **Roles**: 
  - **ADMIN**: Can create projects, create tasks, and update any task.
  - **MEMBER**: Can view projects/tasks and update the status of tasks specifically assigned to them.
- **Dashboard**: Real-time aggregated statistics (Total, Pending, In Progress, Completed).

## Local Setup Instructions

### 1. Database Setup
1. Install MySQL and create a database named `taskdb`:
   ```sql
   CREATE DATABASE taskdb;
   ```
2. In `src/main/resources/application.properties`, ensure the local credentials match your MySQL installation.

### 2. Run the Backend (Spring Boot)
1. Open your terminal in the root directory.
2. Run the application using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(The server will start on port `8084`)*

### 3. Run the Frontend (React)
1. Open a new terminal window.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser to the URL provided (usually `http://localhost:5173`).

## API Endpoints Overview
- `POST /api/auth/signup` - Register a user
- `POST /api/auth/login` - Authenticate and get JWT
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project (Admin)
- `GET /api/tasks/project/{id}` - List tasks for a project
- `POST /api/tasks` - Create task (Admin)
- `PUT /api/tasks/{id}/status` - Update task status
- `GET /api/dashboard` - Get task statistics
