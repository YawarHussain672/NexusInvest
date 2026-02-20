# Project Requirements Report

This report cross-references the initial task requirements with the implemented features in the MLM Investment Dashboard to confirm 100% completion.

## Question 1: Database Schema Design 
**Task:** Design MongoDB schemas for Users, Investments, Referrals / Level income, ROI history.
**Requirements & Implementation:**
- [x] **Each user can have multiple investments:** Implemented. The `Investment` schema utilizes a `userId` reference back to the User model, allowing a one-to-many relationship.
- [x] **Each investment has amount, plan, startDate, endDate, status:** Implemented. The `Investment` schema contains all these fields, validating plan types (Basic, Pro, Elite) and statuses (active, completed, cancelled).
- [x] **Users can refer others; referrals create level income:** Implemented. The `User` schema contains a `referralCode` and a `referredBy` ObjectId linking accounts together. The `LevelIncome` schema logs all referral earnings.
- [x] **Daily ROI must be tracked per user and per investment:** Implemented. The `RoiHistory` schema tracks daily payouts uniquely by `investmentId` and `userId`.

## Question 2: API Design 
**Task:** Build APIs for User registration/login, Create investment, Fetch user dashboard, Fetch referral tree.
**Requirements & Implementation:**
- [x] **Secure endpoints:** Implemented. All protected routes use a custom `protect` JWT middleware (`backend/middleware/authMiddleware.js`).
- [x] **Efficient queries to calculate total income:** Implemented. `backend/controllers/dashboardController.js` efficiently aggregates today's ROI and Level Income while utilizing the pre-calculated `balance` fields on the `User` model to prevent expensive runtime calculations on every dashboard load.

## Question 3: Business Logic Implementation 
**Task:** Implement a function that calculates Daily ROI and Level income, updating balances.
**Requirements & Implementation:**
- [x] **Daily ROI for all active investments:** Implemented in `backend/services/businessLogic.js`. A function fetches all active investments and calculates `(amount * dailyRoiRate) / 100`.
- [x] **Level income based on referral hierarchy:** Implemented natively in the investment creation route. A service traverses up to 3 upline levels, distributing 5%, 3%, and 1% of the deposit amount respectively.
- [x] **Update the user balances accordingly:** Implemented. Both the ROI and Level Income logic physically update the `user.balance`, `user.totalROI`, and `user.totalLevelIncome` variables.

## Question 4: React Dashboard 
**Task:** Build a React dashboard showing Total investments, Daily ROI, Level income, and Referral tree.
**Requirements & Implementation:**
- [x] **Fetch data from your API:** Implemented. The `useEffect` hook with `axios` pulls data from `/api/dashboard` and `/api/dashboard/referrals/tree`.
- [x] **Display charts / tables:** Implemented using React components and modern CSS. Investments are displayed in a clean table, and the referral tree uses an expandable accordion list mapping the JSON hierarchy.
- [x] **Handle loading states:** Implemented. All components feature conditional `loading` states returning animated UI skeletons or spinners until the API resolves.

## Question 5: Cron Job / Scheduler 
**Task:** Implement a scheduled job that runs daily, calculates ROI, and updates balances.
**Requirements & Implementation:**
- [x] **Runs daily at midnight:** Implemented in `server.js` using `node-cron` scheduled to `'0 0 * * *'`.
- [x] **Calculate ROI for all users & updates balances:** Implemented. The cron job invokes the `calculateDailyROI` business logic.
- [x] **Ensure idempotency:** Implemented. Before calculating ROI for an active investment, the job queries the `RoiHistory` database for any record matching that `investmentId` containing today's timestamp. If a record exists, it skips it securely.
