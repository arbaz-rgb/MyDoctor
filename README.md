# MyDoctor

MyDoctor is a full-stack doctor appointment booking platform with three deployable services:

- **Patient web app** for browsing doctors, managing profiles, booking appointments, and paying with Razorpay.
- **Admin and doctor dashboard** for doctor onboarding, appointment management, availability, and dashboard metrics.
- **Node.js API** for authentication, doctor/user management, appointments, image uploads, and payments.

The project is built with React, Vite, Tailwind CSS, Express, MongoDB, Cloudinary, Razorpay, and Docker.

## Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Docker](#docker)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Load Testing](#load-testing)
- [Production Checklist](#production-checklist)
- [Troubleshooting](#troubleshooting)

## Architecture

```text
Patient Frontend  --->  Backend API  --->  MongoDB
Admin Dashboard   --->      |        --->  Cloudinary
Doctor Dashboard  --->      |        --->  Razorpay
```

Default local service URLs:

| Service | Path | URL |
| --- | --- | --- |
| Backend API | `backend` | `http://localhost:4000` |
| Patient frontend | `frontend` | `http://localhost:5173` |
| Admin/doctor dashboard | `admin` | `http://localhost:5174` with Docker, or Vite's assigned local port when run manually |

## Features

### Patient App

- User registration and login
- Doctor listing by speciality
- Doctor profile and appointment slot booking
- User profile management with image upload
- Appointment history
- Appointment cancellation
- Razorpay payment order creation and verification

### Admin Dashboard

- Admin login
- Add doctors with profile image upload
- View all doctors
- Toggle doctor availability
- View and cancel appointments
- Dashboard metrics for doctors, patients, appointments, and latest bookings

### Doctor Dashboard

- Doctor login
- View assigned appointments
- Complete or cancel appointments
- View earnings, patients, appointments, and latest bookings
- Update profile availability, fees, and address

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 7, Tailwind CSS 4, React Router, Axios, React Toastify |
| Admin dashboard | React 19, Vite 7, Tailwind CSS 4, React Router, Axios, React Toastify |
| Backend | Node.js, Express 5, Mongoose, JWT, bcrypt, Multer |
| Database | MongoDB |
| Media storage | Cloudinary |
| Payments | Razorpay |
| Load testing | k6 |
| Containerization | Docker, Docker Compose |

## Project Structure

```text
.
+-- admin/                 # Admin and doctor dashboard Vite app
+-- backend/               # Express API, controllers, routes, models, middleware
+-- frontend/              # Patient-facing Vite app
+-- tests/
|   +-- k6/                # k6 load test
+-- docker-compose.yml     # Multi-service Docker setup
+-- README.md
```

## Prerequisites

- Node.js 22 or later
- npm
- MongoDB database, local or hosted
- Cloudinary account
- Razorpay account
- Docker and Docker Compose, optional
- k6, optional for load testing

## Environment Variables

Create the following files before running the app.

### `backend/.env`

```env
PORT=4000
MONGODB_URL=mongodb://localhost:27017
JWT_SECRET=replace-with-a-long-random-secret

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-password

CLOUDINARY_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET_KEY=your-cloudinary-secret-key

RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
CURRENCY=INR
```

Notes:

- The backend connects to `${MONGODB_URL}/prescripto`, so `MONGODB_URL` should be the base MongoDB connection string.
- Use a strong `JWT_SECRET` in production and rotate it if it is ever exposed.
- Never commit real `.env` files or payment credentials.

### `frontend/.env`

```env
VITE_BACKEND_URL=http://localhost:4000
```

### `admin/.env`

```env
VITE_BACKEND_URL=http://localhost:4000
```

## Local Development

Install dependencies for each service:

```bash
cd backend
npm install

cd ../frontend
npm install

cd ../admin
npm install
```

Start the backend:

```bash
cd backend
npm run server
```

Start the patient frontend in a separate terminal:

```bash
cd frontend
npm run dev
```

Start the admin/doctor dashboard in a separate terminal:

```bash
cd admin
npm run dev
```

Open the Vite URLs printed in the terminal. The backend health check is available at:

```text
GET http://localhost:4000/
```

## Docker

Run all services:

```bash
docker compose up --build
```

Docker Compose expects `backend/.env` to exist. The frontend and admin containers also need access to `VITE_BACKEND_URL`; for production-style builds, pass this value through your deployment environment or add service-level environment configuration.

Ports:

- Backend: `4000:4000`
- Patient frontend: `5173:5173`
- Admin dashboard: `5174:5173`

Stop services:

```bash
docker compose down
```

## Available Scripts

### Backend

| Command | Description |
| --- | --- |
| `npm start` | Start the API with Node.js |
| `npm run server` | Start the API with Nodemon |
| `npm test` | Placeholder test script |

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Build static production assets |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

### Admin

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Build static production assets |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## API Overview

Base URL:

```text
http://localhost:4000
```

### User Routes

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/user/register` | No | Register a user |
| `POST` | `/api/user/login` | No | Log in a user |
| `GET` | `/api/user/get-profile` | User token | Get user profile |
| `POST` | `/api/user/update-profile` | User token | Update profile and optional image |
| `POST` | `/api/user/book-appointment` | User token | Book an appointment |
| `GET` | `/api/user/appointments` | User token | List user appointments |
| `POST` | `/api/user/cancel-appointment` | User token | Cancel a user appointment |
| `POST` | `/api/user/payment-razorpay` | User token | Create Razorpay order |
| `POST` | `/api/user/verifyRazorpay` | User token | Verify Razorpay payment |

### Doctor Routes

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/doctor/list` | No | List available doctors |
| `POST` | `/api/doctor/login` | No | Log in a doctor |
| `GET` | `/api/doctor/appointments` | Doctor token | List doctor appointments |
| `POST` | `/api/doctor/complete-appointment` | Doctor token | Mark appointment complete |
| `POST` | `/api/doctor/cancel-appointment` | Doctor token | Cancel appointment |
| `GET` | `/api/doctor/dashboard` | Doctor token | Get doctor dashboard metrics |
| `GET` | `/api/doctor/profile` | Doctor token | Get doctor profile |
| `POST` | `/api/doctor/update-profile` | Doctor token | Update doctor profile |

### Admin Routes

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/admin/login` | No | Log in admin |
| `POST` | `/api/admin/add-doctor` | Admin token | Add a doctor |
| `POST` | `/api/admin/all-doctors` | Admin token | List all doctors |
| `POST` | `/api/admin/change-availability` | Admin token | Toggle doctor availability |
| `GET` | `/api/admin/appointments` | Admin token | List all appointments |
| `POST` | `/api/admin/cancel-appointment` | Admin token | Cancel appointment |
| `GET` | `/api/admin/dashboard` | Admin token | Get admin dashboard metrics |

Authentication tokens are sent in custom headers used by the existing clients:

- User: `token`
- Admin: `aToken`
- Doctor: `dToken`

## Load Testing

A k6 scenario exists at `tests/k6/test.js`.

```bash
k6 run tests/k6/test.js
```

Before using it against a real environment, replace the hard-coded token, doctor ID, user ID, and target URL with values from your test environment. Do not run high-load tests against production unless the environment has been explicitly prepared for it.

## Production Checklist

- Set strong secrets for `JWT_SECRET`, `ADMIN_PASSWORD`, Cloudinary, and Razorpay.
- Use managed MongoDB with backups, monitoring, and IP/network restrictions.
- Configure CORS to allow only trusted frontend origins.
- Serve built frontend/admin assets through a production web server or platform, not Vite dev servers.
- Add centralized logging and request monitoring for the backend.
- Validate all file uploads for size, type, and abuse protection.
- Add automated API and UI tests for authentication, bookings, payments, and admin workflows.
- Use HTTPS for all deployed services.
- Store secrets in your hosting provider's secret manager, not in source control.
- Review payment verification and webhook handling before accepting real payments.

## Troubleshooting

### Backend cannot connect to MongoDB

Check that `MONGODB_URL` is valid and that the database is reachable from the backend process. The app appends `/prescripto` to the configured value.

### Frontend cannot reach the API

Verify `VITE_BACKEND_URL` in both `frontend/.env` and `admin/.env`. Restart the Vite dev server after changing environment variables.

### Image uploads fail

Check the Cloudinary variables in `backend/.env` and confirm the Cloudinary account allows image uploads.

### Razorpay payment order fails

Verify `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `CURRENCY`. Use Razorpay test keys in non-production environments.

### Admin login fails

The admin login compares credentials directly against `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`.
