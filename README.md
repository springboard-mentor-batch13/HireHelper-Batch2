# HireHelper-Batch2

Hire-a-Helper is a platform where users can hire individuals to perform specific tasks. The application 
allows users to post tasks, browse tasks posted by others, send or receive help and manage ongoing 
and completed tasks. The app facilitates seamless hiring and coordination between task creators and 
helpers while offering real-time updates, profile management, and notification features.

# 🌐 Live Architecture
- Frontend: Next.js (App Router + Tailwind CSS)
- Backend: FastAPI
- Database: Supabase (PostgreSQL)
- Authentication: JWT + OTP Verification
- Email Service: SMTP (Gmail)

# ✨ Implemented Features
## 1.🔐 Authentication System
- User Signup with OTP verification
- Secure Login with JWT
- Password hashing (PBKDF2)
- Protected routes

## 2.📧 OTP Verification
- 6-digit OTP generation
- Email-based verification
- Expiration handling
- Secure account creation only after OTP validation

## 3.👤 User Management
- First name & last name support
- Email uniqueness enforced
- Optional phone number

## 4.📋 Task Management
- Create tasks
- Associate tasks with users
- Status tracking

# ⚙️Setup Instructions
## 🔧 Backend Setup
- cd backend

## Create virtual environment
- python -m venv venv

## Activate it
- venv\Scripts\activate   # Windows

## Install dependencies
- pip install -r requirements.txt

## Run server
- uvicorn app.main:app --reload

- Backend runs on:
http://127.0.0.1:8000

- Swagger Docs:
http://127.0.0.1:8000/docs

# 💻 Frontend Setup
- cd frontend
- npm install
- npm run dev
Frontend runs on:
http://localhost:3000

# 🔑 Environment Variables

## 📌 Backend (.env)
DATABASE_URL=postgresql+psycopg2://postgres:hirehelper%401234@db.vrkzzytnxjvaxirqhmza.supabase.co:5432/postgres
EMAIL_USER=bonjour6044@gmail.com
EMAIL_PASS=qqjorbzbypkqygvg

## 📌 Frontend (.env.local)
EMAIL_USER=bonjour6044@gmail.com
EMAIL_PASS=qqjo rbzb ypkq ygvg

# 🔌 API Endpoints
## Auth
- POST /auth/signup
- POST /auth/login
- POST /auth/send-otp
- POST /auth/verify-otp
## Tasks
- POST /tasks
- GET /me

# 🛡 Security Features
- Hashed passwords (PBKDF2)
- JWT-based authentication
- OTP expiration handling
- Secure environment variable management
- SSL database connection (Supabase)

# 🚧 Future Improvements
- Refresh token system
- Rate limiting for OTP
- SMS OTP support
- Role-based access control

## Project Structure

HireHelper-Batch2/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── routes.py
│   │   │   │   ├── schemas.py
│   │   │   │   ├── service.py
│   │   │   ├── tasks/
│   │   │       ├── routes.py
│   │   │       ├── schemas.py
│   │   │       ├── service.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   ├── email.py
│   │   │
│   │   ├── db/
│   │   │   ├── database.py
│   │   │   ├── models.py
│   │   │
│   │   ├── main.py
│   │
│   ├── .env
│   ├── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-otp/
│   │   ├── dashboard/
│   │
│   ├── components/
│   ├── package.json
│   ├── tailwind.config.js
│
├── README.md

# License
This project is open-source and available for learning and development purposes.
