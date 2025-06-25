# Trello-lite Project Management App

A full-stack **Trello-lite project management App** built with:
- **Frontend:** Next.js, Tailwind CSS, React DnD  
- **Backend:** Node.js, Express, MongoDB, JWT Authentication

----

## Live Demo 🌐
Check out the live project here:
Visit: [https://to-do-app-xi-ashen-93.vercel.app/] (https://to-do-app-xi-ashen-93.vercel.app/)

Built with Next.js, Tailwind CSS, Express.js, and MongoDB – fully deployed using Vercel (frontend) and Render (backend).

----

## Folder Structure

Trello-lite Project Management App/
|
|-----client/  # Frontend (Next.js)
|
|-----server/  # Backend (Express.js)
|
|-----README.md

----

## Features

- Login/Signup
- User authentication (JWT)
- Create boards, lists, tasks
- Add, move, assign, and delete tasks
- Delete lists
- Delete boards
- Role-based access control (Admin & Member)
- Activity log tracking
- Drag and drop tasks between lists (React DnD)
- Protected routes with proper access middleware

----

## Tech Stack

**Frontend**: Next.js, React, Tailwind CSS, React Dnd
**Backend**: Node.js, Express.js, MongoDB, Mongoose
**Auth**: JWT (jsonwebtoken)
**State**: React Context API

----

## Steps to run the project

### 1. Clone the repository:
git clone https://github.com/sourabhkurne14/trello-lite-project-management-app
cd Trello-lite-App

### 2. Setup Backend
cd server
npm install

#### Backend dependencies to install:
npm install express mongoose dotenv cors jsonwebtoken bcryptjs

#### Create `.env` file in `server/`:
In that `.env` file add:
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret

#### Start backend server:
nodemon app.js (if nodemon installed), else
node app.js

### 3. Setup Frontend
cd ../client
npm install

#### Frontend dependencies to install:
npm install next react react-dom tailwindcss postcss autoprefixer react-dnd react-dnd-html5-backend jwt-decode

#### Start frontend server:
npm run dev

----

## Usage

- Register or login
- Create a board
- Add lists and tasks inside the board
- Assign members, move tasks, delete, etc.
- Can delete board, list, task

----

##  Author

**Sourabh Kurne**  
B.Tech in Computer Science (AI & DS)  
GitHub: [@sourabhkurne14](https://github.com/sourabhkurne14)
LinkedIn: (https://www.linkedin.com/in/sourabh-kurne-aaaa65236/)





