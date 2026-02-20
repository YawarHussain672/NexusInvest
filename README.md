# MLM Investment Dashboard

A full-stack MERN application that implements a Multi-Level Marketing (MLM) investment system with daily ROI calculations, multi-tier referral tracking, and a premium React dashboard.

## Overview

This project provides a robust foundation for an investment platform where users can:
- Register and receive a unique **Referral Code**.
- View their dashboard with real-time stats (Total Balance, Total Invested, Daily ROI, Level Income).
- Purchase investment plans (e.g., Basic, Pro, Elite) that generate daily Returns on Investment (ROI).
- Refer other users to earn **Level Income** commissions based on downline investments.
- Visualize their referral network up to 3 levels deep via an interactive tree component.

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS 
- React Router DOM
- Axios
- Lucide React (Icons)

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- JSON Web Token (JWT) & BcryptJS (Authentication)
- Node-Cron (Task Scheduling)

## Features

### 1. Robust MongoDB Schemas
- **User:** Manages authentication, stores the referral tree linkage (`referredBy`), and tracks running financial balances.
- **Investment:** Stores active user investment plans, amounts, daily ROI rates, and duration.
- **LevelIncome & RoiHistory:** Transactional tables that log every commission and ROI payout securely.

### 2. Automated Daily ROI (Cron Job)
A `node-cron` job runs daily at midnight (`0 0 * * *`) to process returns for all active investments.
- **Idempotency:** The system queries `RoiHistory` before paying out to ensure a specific investment is never paid twice on the same calendar day.

### 3. Multi-Tier Referral System
When a user makes an investment, the backend traverses the referral tree and distributes **Level Income** to their upline.
- **Tier 1:** 5% commission
- **Tier 2:** 3% commission
- **Tier 3:** 1% commission

### 4. Premium React Dashboard
A modern, dark-themed, glassmorphism UI offering:
- Secure JWT-based Login and Registration.
- Highly optimized Stat Cards utilizing live database aggregations.
- A widget to view active investments and purchase new plans.
- A **Referral Network** tab that recursively fetches and displays a user's entire downline network elegantly.

---

## Local Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Database (Local or Atlas)

### 1. Clone & Install Dependencies

Open two terminal windows (one for the backend, one for the frontend).

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Environment Configuration

In the `backend` directory, create a `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 3. Run the Application

**Run Backend:**
```bash
cd backend
npm run dev
```

**Run Frontend:**
```bash
cd frontend
npm run dev
```

The React app will be available at `http://localhost:5173`.
The Express server will be running on `http://localhost:5000`.
