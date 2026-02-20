# NexusInvest: Premium MLM Investment Dashboard

NexusInvest is a sophisticated, full-stack serverless Next.js application designed for Multi-Level Marketing (MLM) and investment management. It features a stunning, high-density dashboard, real-time ROI tracking, and a multi-tier referral system—all optimized for seamless deployment on Vercel.

---

## 🚀 Key Features

### 💎 Smart Investment Engine
Choose from tiered investment plans, each with automated daily payouts:
- **Basic Plan**: 1.0% daily ROI for 30 days.  
- **Pro Plan**: 1.5% daily ROI for 60 days.  
- **Elite Plan**: 2.0% daily ROI for 90 days.  

### 📈 Real-Time Dashboard
A premium, dark-themed analytics command center providing detailed insights:
- **Financial Metrics**: Total Balance, Total Invested, Total ROI, and Level Income.
- **Daily Performance**: Integrated "Today ROI" and "Today Level Income" tracking.
- **Network Visuals**: Interactive "Overview", "Investments", and "Network" tabs.

### 🔗 Multi-Tier Referral System
Built-in growth mechanisms with automated commission distribution across 3 levels:
- **Level 1**: 5% commission on direct referrals.
- **Level 2**: 3% commission on second-degree referrals.
- **Level 3**: 1% commission on third-degree referrals.
- **Unique IDs**: Auto-generated referral codes for every user upon signup.

### 🛡️ Secure Infrastructure
- **Authentication**: JWT-secured signups and logins with encrypted password hashing (bcrypt).
- **Serverless Automation**: Automated ROI payouts using Vercel Cron Jobs (Midnight schedule).
- **Data Integrity**: Idempotent payout logic ensuring users are paid exactly once per day per investment.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend**: Next.js Serverless Route Handlers
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose](https://mongoosejs.com/)
- **Styling**: Glassmorphism, Gradient Overlays, and Lucide React Icons
- **Scheduling**: Vercel Cron Jobs (`vercel.json`)

---

## ⚙️ Installation & Local Setup

### 1. Prerequisites
- Node.js (Latest LTS recommended)
- MongoDB Atlas account (for Connection URI)

### 2. Configure Environment
Create a `.env.local` file in the root directory:
```env
# MongoDB Connection
MONGO_URI=mongodb+srv://...

# Security
JWT_SECRET=your_ultra_secure_jwt_secret_key

# Vercel Cron Secure Passcode
CRON_SECRET=your_secure_cron_password
```

### 3. Run Development Server
```bash
npm install
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

---

## ☁️ Deployment Guide

### Deploying to Vercel
NexusInvest is designed to run entirely on Vercel's Edge/Serverless infrastructure. Follow these steps for a successful launch:

1. **Push to GitHub**: Push your repository to your GitHub account.
2. **Import Project**: In the Vercel Dashboard, click **Add New > Project**.
3. **Set Root Directory**: 
   > [!IMPORTANT]
   > Since the application code is inside the `next-dashboard` folder, you **must** set the **Root Directory** to `next-dashboard` in the Vercel build settings.
4. **Configure Environment Variables**: Add the following in the "Environment Variables" section:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A random string for token encryption.
   - `CRON_SECRET`: A secure password for your Daily ROI task.
5. **Database Access**: Ensure your MongoDB Atlas cluster has "Network Access" set to **Allow Access from Anywhere** (0.0.0.0/0), as Vercel uses dynamic IP addresses.
6. **Deploy**: Click **Deploy**. Vercel will automatically detect the configurations and start the build.

### Vercel Cron Automation
The `vercel.json` file inside the project directory tells Vercel to ping `/api/cron/roi` every day at Midnight.
- **Verification**: Once deployed, you can see your active cron jobs in the **"Settings > Cron Jobs"** tab of your Vercel project dashboard.
- **Manual Trigger**: You can manually test the payout logic by sending a GET request with the `CRON_SECRET` header.
  - **Terminal / Postman Example**:
    ```bash
    curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-domain.com/api/cron/roi
    ```

---

## 📁 Project Structure

```text
/next-dashboard/
├── app/               # Next.js App Router (Pages & API Routes)
│   ├── api/           # Serverless Route Handlers
│   │   ├── auth/      # Authentication Logic
│   │   ├── cron/      # ROI Payout Cron Jobs
│   │   └── dashboard/ # Analytics Data Extraction
│   ├── dashboard/     # Main Dashboard UI
│   └── login/         # Auth Pages
├── components/        # Shared React Client Components
├── lib/               # Shared Utilities (Models, DB, Auth, Logic)
├── public/            # Static Assets
└── vercel.json        # Vercel Cron Scheduling Config
```
