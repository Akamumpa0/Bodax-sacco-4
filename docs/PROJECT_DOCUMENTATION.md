# Bodax SACCO Management System Documentation

## 1. System Overview

Bodax SACCO Management System is a full-stack web application for managing savings, loans, withdrawals, member records, and reports for boda boda SACCO groups in Uganda. The current pilot context is Mbarara, with field testing conducted at Mile 4 Boda Boda Stage.

The system is designed around three SACCO roles:

- Member: views personal savings, loan status, statements, profile, and loan requests.
- Treasurer: records savings, registers members, manages loans, records repayments, reviews requests, and views reports.
- Chairman: monitors SACCO performance through dashboards, analytics, reports, defaulters, and financial summaries.

## 2. Project Goals

- Replace manual notebook-based SACCO records with a digital platform.
- Improve trust by giving members direct visibility of savings and loan records.
- Help the treasurer reduce errors and speed up financial operations.
- Help the chairman monitor SACCO performance and loan risk.
- Provide accurate reports for SACCO decision-making.
- Prepare the project for a controlled real-world pilot.

## 3. Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, React Router, Context API |
| Frontend HTTP | Axios |
| Frontend UI Support | Lucide React, Recharts |
| Backend | Node.js, Express.js |
| Backend Security | JWT, bcryptjs, Helmet, CORS, Express Rate Limit |
| Validation | Zod |
| Database | PostgreSQL, Neon-compatible connection handling |
| Logging | Morgan |
| Deployment Config | Render YAML and Vercel JSON |

## 4. Repository Structure

```text
Bodax-Sacco/
  client/
    src/
      api/
      components/
      context/
      hooks/
      layouts/
      pages/
      styles/
  server/
    src/
      config/
      controllers/
      db/
      middleware/
      routes/
      services/
      utils/
      validators/
  docs/
  README.md
  package.json
  render.yaml
  vercel.json
```

## 5. Architecture

The application follows a client-server architecture.

The React frontend renders role-specific pages and sends HTTP requests to the Express API. The Express backend authenticates requests, validates input, applies SACCO business rules in the service layer, and stores records in PostgreSQL.

### 5.1 Frontend Flow

- `client/src/App.jsx` defines application routes.
- `ProtectedRoute.jsx` ensures that users are authenticated and authorized for role-specific pages.
- `AppLayout.jsx` renders the sidebar navigation based on the logged-in user's role.
- `AuthContext.jsx` stores the current user session and handles login/logout state.
- `api/client.js` centralizes API communication.
- Pages under `client/src/pages` implement member, treasurer, chairman, and auth screens.

### 5.2 Backend Flow

- `server/src/server.js` starts the server locally and exports the app for serverless hosting.
- `server/src/app.js` configures middleware, CORS, security headers, rate limiting, JSON parsing, logging, health checks, and API routes.
- `routes/` define endpoint paths and role permissions.
- `controllers/` receive HTTP requests and call services.
- `services/` contain business logic for members, savings, loans, withdrawals, reports, and authentication.
- `validators/schemas.js` defines Zod validation schemas.
- `config/db.js` manages PostgreSQL queries and transactions.
- `middleware/authMiddleware.js` enforces authentication and role authorization.

## 6. User Roles and Permissions

| Role | Main Permissions |
| --- | --- |
| Member | View own dashboard, loans, statements, and profile; create loan requests; create withdrawal requests where enabled |
| Treasurer | Register and update members, set member passwords, record savings, issue loans, record repayments, review loan requests, review withdrawals, view reports |
| Chairman | View dashboard, analytics, reports, top savers, defaulters, and SACCO financial summaries |

## 7. Main Modules

### 7.1 Authentication Module

The authentication module supports login, signup, current-user lookup, and password changes.

Current capabilities:

- Login by email or member phone number.
- Password hashing using bcrypt.
- JWT generation with role and member ID claims.
- Last login timestamp update.
- Password change for authenticated users.

Important files:

- `server/src/services/authService.js`
- `server/src/routes/authRoutes.js`
- `client/src/pages/auth/Login.jsx`
- `client/src/pages/auth/Signup.jsx`
- `client/src/context/AuthContext.jsx`

### 7.2 Member Management Module

The member module stores SACCO member records and supports treasurer-led account management.

Member fields include:

- Member number
- Full name
- Phone number
- National ID
- Stage
- Next of kin
- Next of kin phone
- Registration date
- Status
- Optional linked user account

Important files:

- `server/src/services/memberService.js`
- `server/src/routes/memberRoutes.js`
- `client/src/pages/treasurer/Members.jsx`

### 7.3 Savings Module

The savings module records member contributions and provides savings summaries and statements.

Current capabilities:

- Record savings transactions.
- Mark deposits as confirmed.
- Calculate total savings, weekly savings, monthly savings, and yearly savings.
- Show recent savings transactions.
- Produce member statements combining savings, loan repayments, and withdrawals.

Important files:

- `server/src/services/savingsService.js`
- `server/src/routes/savingsRoutes.js`
- `client/src/pages/treasurer/RecordSavings.jsx`
- `client/src/pages/member/Statements.jsx`

### 7.4 Loan Module

The loan module manages eligibility, requests, approval, issuance, repayment, and overdue tracking.

Current loan rule:

- A member may borrow up to 3 times confirmed savings.

Loan restrictions:

- Inactive members are not eligible.
- Members with active or overdue loans are not eligible for another loan.
- Members with pending loan requests are not eligible for another pending request.
- Members with no confirmed savings are not eligible.

Loan calculations:

- Interest defaults to 10 percent.
- Total payable equals principal plus interest amount.
- Installment amount equals total payable divided by installment count.
- Loan status is active, completed, or overdue.

Important files:

- `server/src/services/loanService.js`
- `server/src/routes/loanRoutes.js`
- `client/src/pages/member/Loans.jsx`
- `client/src/pages/treasurer/Loans.jsx`
- `client/src/pages/treasurer/ConfirmLoans.jsx`

### 7.5 Withdrawal Module

The withdrawal module supports withdrawal requests and treasurer review.

Current capabilities:

- Create withdrawal requests.
- List withdrawal requests.
- Approve or reject pending withdrawals.
- Create withdrawal records when requests are approved.

Important files:

- `server/src/services/withdrawalService.js`
- `server/src/routes/withdrawalRoutes.js`
- `client/src/pages/treasurer/Withdrawals.jsx`

### 7.6 Reports and Analytics Module

The reporting module provides dashboards and analytics for members, treasurers, and chairmen.

Member dashboard includes:

- Total savings
- Weekly savings
- Monthly savings
- Active loan balance
- Paid this week
- Latest savings notification
- Active loans
- Loan requests
- Repayment reminders
- Recent transactions

Treasurer dashboard includes:

- Active members
- Daily collections
- Weekly collections
- Monthly collections
- Pending withdrawal count
- Pending loan request count
- Active loan count

Chairman dashboard and analytics include:

- Total members
- Total savings
- Active loans
- Outstanding loan balance
- Loan arrears
- Weekly and monthly collections
- Top savers
- Defaulters
- Collection trend
- Income summary
- Expenditure summary

Important files:

- `server/src/services/reportService.js`
- `server/src/routes/reportRoutes.js`
- `client/src/pages/treasurer/Reports.jsx`
- `client/src/pages/chairman/Analytics.jsx`
- `client/src/pages/chairman/Reports.jsx`

## 8. Database Design

The database schema is located at `server/src/db/schema.sql`.

### 8.1 Main Tables

| Table | Purpose |
| --- | --- |
| `roles` | Stores system roles such as MEMBER, TREASURER, and CHAIRMAN |
| `users` | Stores login accounts, password hashes, activity status, and role references |
| `members` | Stores SACCO member identity and stage details |
| `savings_transactions` | Stores savings deposits and confirmation status |
| `loans` | Stores issued loans, interest, installments, due dates, and status |
| `loan_repayments` | Stores loan repayment records |
| `loan_requests` | Stores member loan requests and review decisions |
| `withdrawal_requests` | Stores withdrawal applications and review status |
| `withdrawals` | Stores approved withdrawal payments |
| `reports` | Stores generated report metadata |

### 8.2 Important Relationships

- A user belongs to one role.
- A member may be linked to one user account.
- A member can have many savings transactions.
- A member can have many loan requests.
- A member can have many loans.
- A loan can have many repayments.
- A withdrawal request can create one withdrawal record after approval.

### 8.3 Seed Data

The schema creates default roles and sample users:

- Treasurer: `treasurer@bodax.test`
- Chairman: `chairman@bodax.test`
- Member: `member@bodax.test`
- Default password: `password123`

The sample member is:

- Member number: `MBR-0001`
- Name: John Kato
- Stage: Mbarara Central Stage

## 9. API Summary

All protected routes use the `/api` prefix and require authentication unless noted.

### 9.1 Auth Routes

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/signup` | Register a member account |
| GET | `/api/auth/me` | Get current authenticated user |
| PATCH | `/api/auth/password` | Change password |

### 9.2 Member Routes

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| GET | `/api/members` | Treasurer, Chairman | List members |
| POST | `/api/members` | Treasurer | Create member |
| GET | `/api/members/:id` | Treasurer, Chairman | View member |
| PATCH | `/api/members/:id` | Treasurer | Update member |
| PATCH | `/api/members/:id/credentials` | Treasurer | Set member password |

### 9.3 Savings Routes

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/api/savings` | Treasurer | Record savings |
| GET | `/api/savings/statement` | Member, Treasurer, Chairman | Get statement |
| GET | `/api/savings/members/:id/summary` | Treasurer, Chairman | Get member savings summary |

### 9.4 Loan Routes

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| GET | `/api/loans/eligibility` | Member, Treasurer, Chairman | Check eligibility |
| GET | `/api/loans/requests` | Member, Treasurer, Chairman | List loan requests |
| POST | `/api/loans/requests` | Member, Treasurer | Create loan request |
| PATCH | `/api/loans/requests/:id/review` | Treasurer | Approve or reject request |
| GET | `/api/loans` | Member, Treasurer, Chairman | List loans |
| POST | `/api/loans` | Treasurer | Issue loan |
| POST | `/api/loans/repayments` | Treasurer | Record repayment |

### 9.5 Withdrawal Routes

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| GET | `/api/withdrawals/requests` | Treasurer, Chairman | List requests |
| POST | `/api/withdrawals/requests` | Member, Treasurer | Create request |
| PATCH | `/api/withdrawals/requests/:id/review` | Treasurer | Approve or reject request |

### 9.6 Report Routes

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| GET | `/api/reports/dashboard/member` | Member | Member dashboard |
| GET | `/api/reports/dashboard/treasurer` | Treasurer | Treasurer dashboard |
| GET | `/api/reports/dashboard/chairman` | Chairman | Chairman dashboard |
| GET | `/api/reports/analytics` | Chairman, Treasurer | Analytics and reports |

## 10. Business Rules

- Only active members can qualify for loans.
- Confirmed savings are used for loan eligibility.
- Maximum eligible loan amount equals confirmed savings multiplied by 3.
- A member cannot have more than one active or overdue loan.
- A member cannot create another loan request while one is pending.
- Overdue loans are refreshed by comparing due date and remaining balance.
- A loan becomes completed when repayments cover the total payable.
- Withdrawal approval creates a withdrawal transaction.
- Treasurer actions are required for savings recording, loan approval, loan issuance, repayments, and withdrawal review.

## 11. Setup Instructions

### 11.1 Prerequisites

- Node.js 20 or later
- npm
- PostgreSQL database or Neon PostgreSQL connection string

### 11.2 Install Dependencies

From the project root:

```bash
npm run install:all
```

### 11.3 Environment Variables

Create `server/.env` or use the root `.env` file with:

```text
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=8h
CLIENT_URL=http://localhost:5173
PORT=4000
NODE_ENV=development
```

### 11.4 Apply Database Schema

Run the schema against the configured database:

```bash
npm run db:schema --prefix server
```

### 11.5 Start Backend

```bash
npm run dev
```

The API runs on:

```text
http://localhost:4000
```

### 11.6 Start Frontend

In another terminal:

```bash
npm run dev:client
```

The frontend runs on:

```text
http://localhost:5173
```

## 12. Deployment Notes

The repository contains two deployment configuration options.

### 12.1 Render

`render.yaml` defines:

- `bodax-api` as a Node.js web service from the `server` directory.
- `bodax-client` as a static web service from the `client` directory.

Required environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`
- `VITE_API_BASE_URL`

### 12.2 Vercel

`vercel.json` defines:

- Serverless backend routing for `/api` and `/health`.
- Static frontend build from the client package.
- SPA fallback to `index.html`.

## 13. Security Considerations

Current security controls:

- Password hashing with bcrypt.
- JWT-based authentication.
- Role-based authorization middleware.
- Helmet security headers.
- CORS configuration.
- JSON body size limit.
- API rate limiting.
- Database unique constraints for email, phone number, and member number.

Recommended improvements:

- Use a strong production `JWT_SECRET`.
- Enable HTTPS-only hosting.
- Add audit logs for savings, loans, withdrawals, and password changes.
- Add confirmation steps for financial actions.
- Add session timeout messaging.
- Consider OTP login for field use.

## 14. Field-Test Findings

The June 2026 Mile 4 field test showed that the core idea is useful and understandable, especially balance visibility and transaction statements. However, the following improvements are important before a wider pilot:

- Add confirmation dialogs before financial saves and approvals.
- Allow phone-number-first login and prepare OTP support.
- Accept UGX amounts with commas, such as `50,000`.
- Show member full name and member number prominently on member screens.
- Improve tables on small Android phones.
- Show member names instead of technical IDs in treasurer and chairman views.
- Add SMS or WhatsApp notifications for deposits, approvals, rejections, and repayment reminders.
- Add printable or shareable transaction receipts.
- Simplify terms such as `installment count` into clearer wording like `number of payments`.

## 15. Current Limitations

- No full offline mode yet.
- No production SMS provider integration yet.
- No live mobile money integration.
- No formal automated test suite currently documented.
- Some field-facing wording still needs simplification.
- Some mobile table views need improvement.
- Current member signup and login still need stronger phone-first UX.

## 16. Testing Plan

Recommended testing should cover:

- Authentication and role restrictions.
- Member creation, update, search, and credential assignment.
- Savings recording and statement generation.
- Loan eligibility for active, inactive, no-savings, active-loan, overdue-loan, and pending-request cases.
- Loan approval, rejection, issuance, repayment, completion, and overdue status.
- Withdrawal request approval and rejection.
- Dashboard and report totals.
- Mobile layouts at small screen widths.
- Form validation for UGX amount formats.
- Confirmation dialogs for financial actions.
- Deployment health check at `/health`.

## 17. Maintenance Notes

- Keep business rules in the service layer, not directly in UI components.
- Keep API validation schemas updated when forms change.
- Update database indexes when new search or reporting queries are added.
- Document every new environment variable.
- Avoid exposing internal UUIDs to field users where names and member numbers are better.
- Maintain a field feedback log after every pilot visit.

## 18. Glossary

| Term | Meaning |
| --- | --- |
| SACCO | Savings and Credit Cooperative Organization |
| Member | A registered SACCO participant, usually a boda boda rider in the pilot |
| Treasurer | The SACCO official responsible for financial recording and daily operations |
| Chairman | The SACCO leader responsible for oversight and governance |
| Savings | Member contributions recorded as SACCO deposits |
| Loan request | A member application for borrowing from the SACCO |
| Principal | The original amount borrowed |
| Interest | Extra amount charged on a loan |
| Total payable | Principal plus interest |
| Installment | One scheduled repayment amount |
| Defaulter | Member with overdue unpaid loan balance |
| Arrears | Outstanding overdue loan amount |
| Withdrawal | Money paid out to a member after approval |
