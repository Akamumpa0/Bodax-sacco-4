# Bodax SACCO Management System Project Proposal

## 1. Project Title

Bodax SACCO Management System for Boda Boda Riders in Mbarara, Uganda.

## 2. Executive Summary

Bodax SACCO Management System is a digital savings, loans, withdrawals, and reporting platform designed for boda boda SACCO groups, beginning with the Mile 4 Boda Boda Stage in Mbarara. The project replaces manual notebook-based SACCO record keeping with a secure web system that allows members to view their savings, request loans, track repayments, and receive clear financial updates.

The system is built as a full-stack application using React for the user interface, Node.js and Express for the API, and PostgreSQL for the SACCO database. It supports three main roles: Member, Treasurer, and Chairman. Each role has a different dashboard and permission level so that financial operations are controlled, traceable, and transparent.

Field testing at Mile 4 Stage showed that riders value instant visibility of savings balances, statement history, and loan status. The same test also identified improvements required before wider rollout, including phone-number login, confirmation prompts before financial actions, SMS-style notifications, better mobile layouts, and clearer local-language-friendly wording.

## 3. Background

Many boda boda SACCO groups still manage savings and loans using paper books, receipts, and verbal updates from treasurers. This creates delays, errors, mistrust, and difficulty producing reports for leaders. Members often need to physically contact the treasurer to confirm their balance or loan status.

For a busy stage such as Mile 4 in Mbarara, this approach becomes difficult as membership grows. Riders need a simple way to confirm deposits, see loan eligibility, follow repayment obligations, and trust that their records are accurate. SACCO leaders also need faster reporting on active members, total savings, loan arrears, top savers, defaulters, and withdrawals.

Bodax SACCO addresses these needs through a role-based digital platform that is simple enough for ordinary riders while giving the treasurer and chairman stronger control over financial workflows.

## 4. Problem Statement

The current manual SACCO process has the following challenges:

- Savings and loan records are vulnerable to human error.
- Members cannot instantly confirm whether their deposit was recorded.
- Similar member names can lead to wrong savings entries.
- Loan requests and approvals take time because they depend on manual communication.
- Members lack automatic reminders for due or overdue loans.
- Chairman and treasurer reports are slow to compile.
- Paper records make it hard to detect defaulters, arrears, or collection trends quickly.
- Riders are more comfortable with phone numbers and SMS than email-based systems.
- Small-screen Android phones need a mobile-first experience.

## 5. Proposed Solution

The proposed solution is to complete and strengthen Bodax SACCO Management System into a field-ready digital SACCO platform. The system will provide:

- Secure login and role-based access for Members, Treasurers, and Chairmen.
- Member registration with member number, phone number, stage, next of kin, and account status.
- Savings recording and member savings summaries.
- Loan eligibility checks based on confirmed savings.
- Loan request, approval, issuance, repayment, and overdue tracking.
- Withdrawal request and approval workflows.
- Member statements showing savings, loan repayments, and withdrawals.
- Treasurer and chairman dashboards with operational and governance metrics.
- Reports for top savers, defaulters, collections, income, and expenditure.
- Mobile usability improvements for low-cost Android devices.
- Notifications and transaction confirmation features to improve trust.

## 6. Project Objectives

### 6.1 Main Objective

To develop a reliable, secure, and user-friendly SACCO management system that improves transparency, financial accountability, and service delivery for boda boda SACCO members and leaders.

### 6.2 Specific Objectives

- Digitize member registration and SACCO profile management.
- Enable accurate recording of savings deposits by the treasurer.
- Allow members to view savings balances, recent transactions, and statements.
- Automate loan eligibility checks using the SACCO savings multiplier rule.
- Support loan requests, approval decisions, loan issuance, and repayment tracking.
- Track withdrawals through request and approval workflows.
- Provide dashboards and reports for treasurer operations and chairman oversight.
- Improve field usability through mobile-first design, clear language, and phone-based access.
- Reduce financial data-entry mistakes using confirmation screens and validation improvements.

## 7. Scope

### 7.1 In Scope

- Web-based SACCO application for members, treasurer, and chairman.
- Authentication using JWT and role-based authorization.
- PostgreSQL database for users, roles, members, savings, loans, repayments, withdrawals, and reports.
- Member dashboard, treasurer dashboard, and chairman dashboard.
- Savings, loan, withdrawal, statement, and reporting modules.
- Mobile responsiveness improvements.
- Field-test-driven improvements for login, confirmations, amount inputs, and notifications.
- Deployment configuration for hosted frontend and backend environments.

### 7.2 Out of Scope for Initial Completion

- Full mobile app in Android native code.
- Integration with live mobile money payment collections.
- Advanced accounting ledger integration.
- Biometric authentication.
- Full offline-first synchronization for all modules, unless time allows after core features.
- Multi-branch SACCO support beyond the initial Mbarara pilot.

## 8. Stakeholders

| Stakeholder | Role in the Project | Main Interest |
| --- | --- | --- |
| SACCO Members | Primary end users | View savings, request loans, receive confirmations, track repayments |
| Treasurer | Operational user | Register members, record savings, issue loans, record repayments, review requests |
| Chairman | Oversight user | Monitor performance, arrears, defaulters, top savers, and financial health |
| Bodax Development Team | Implementation team | Build, test, deploy, and maintain the system |
| SACCO Committee | Governance body | Approve policies, rollout decisions, and operating procedures |
| Field Test Riders | Pilot users | Provide usability feedback from real stage conditions |

## 9. Functional Requirements

### 9.1 Member Management

- Register SACCO members with member number, full name, phone number, stage, national ID, next of kin, and status.
- Search and view members by name, phone number, or member number.
- Update member records and activate or deactivate members.
- Assign member login credentials.

### 9.2 Authentication and Authorization

- Allow users to log in using credentials.
- Protect all SACCO data behind authentication.
- Restrict system actions according to role:
  - Members view their own dashboard, loans, statements, and profile.
  - Treasurers manage members, savings, loans, repayments, and approvals.
  - Chairmen view oversight dashboards, analytics, and reports.

### 9.3 Savings Management

- Record member savings deposits.
- Store transaction date, amount, notes, confirmation status, and treasurer identity.
- Summarize savings by week, month, year, and total.
- Show recent savings and statements to members.

### 9.4 Loan Management

- Check loan eligibility using the rule that a member can borrow up to 3 times confirmed savings.
- Prevent loans for inactive members.
- Prevent new loans where a member has an active, overdue, or pending loan request.
- Allow members to request loans.
- Allow treasurers to approve or reject loan requests.
- Calculate interest, total payable, installments, and remaining balance.
- Track repayments and mark loans as active, completed, or overdue.

### 9.5 Withdrawal Management

- Allow withdrawal requests.
- Allow treasurer review of pending withdrawals.
- Create a withdrawal record when a request is approved.
- Include member name, member number, amount, reason, status, reviewer, and review time.

### 9.6 Reports and Analytics

- Treasurer dashboard: active members, daily collections, weekly collections, monthly collections, active loans, and pending loan requests.
- Chairman dashboard: total members, total savings, active loans, outstanding loan balance, loan arrears, weekly collections, and monthly collections.
- Analytics: top savers, defaulters, monthly collection trends, income summary, and expenditure summary.

## 10. Non-Functional Requirements

- Security: JWT authentication, password hashing, protected routes, role-based authorization, rate limiting, and HTTP security headers.
- Reliability: database-backed records with transaction handling for loan and withdrawal approvals.
- Usability: simple language, mobile-first layouts, large touch targets, and clear confirmations.
- Performance: indexed database fields for common member, savings, loan, and request queries.
- Maintainability: modular frontend pages and backend routes, controllers, services, validators, and database schema.
- Deployability: environment-based configuration for API, frontend URL, JWT secret, and database URL.

## 11. Technical Approach

The system will use the existing full-stack architecture:

- Frontend: React, Vite, React Router, Context API, Axios, Recharts, and Lucide React.
- Backend: Node.js, Express.js, Zod validation, JWT, bcryptjs, Helmet, CORS, Morgan, Express Rate Limit, and PostgreSQL client.
- Database: PostgreSQL, currently prepared for Neon PostgreSQL using tables for roles, users, members, savings, loans, repayments, loan requests, withdrawal requests, withdrawals, and reports.
- Deployment: Vercel or Render-style hosting configuration for frontend and backend services.

## 12. Expected Benefits

- Better financial transparency for riders.
- Faster savings recording and statement access.
- Reduced dependency on paper books.
- Improved loan decision-making using savings-based eligibility.
- Faster identification of defaulters and overdue loans.
- Stronger trust between members, treasurer, and chairman.
- Easier reporting for SACCO governance meetings.
- Better preparation for future integrations such as SMS, WhatsApp, OTP, and mobile money.

## 13. Key Risks and Mitigation

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Treasurer records savings under the wrong member | High | Add confirmation modal showing member name, member number, and amount before save |
| Riders struggle with email login | High | Support phone-number login and prepare OTP integration |
| Users enter UGX values with commas | Medium | Normalize comma-formatted amounts before validation |
| Mobile tables are hard to read | Medium | Convert narrow-screen tables into responsive transaction cards |
| Poor network at stages | Medium | Add graceful loading states, retry handling, and plan offline support |
| Members do not trust digital records | High | Show member full name, member number, latest deposit confirmation, and receipts |
| Loan decisions are not communicated | Medium | Add SMS or WhatsApp notification roadmap and in-app request status updates |

## 14. Implementation Duration

The proposed completion period is 6 weeks. The work will begin with documentation and critical field-test fixes, then move into workflow completion, reporting, testing, deployment, and pilot preparation.

## 15. Success Criteria

The project will be considered successful when:

- Members can log in, view balances, request loans, and view statements on mobile phones.
- Treasurers can register members, record savings, review loan requests, issue loans, record repayments, and review withdrawals.
- Chairmen can view analytics, reports, defaulters, and SACCO financial summaries.
- Critical financial actions require confirmation before submission.
- UGX amount fields accept common user formats such as `50000` and `50,000`.
- The application works clearly on small Android screens.
- The system is deployed and ready for a controlled SACCO pilot.
- Project documentation, user guidance, and handover notes are complete.

## 16. Conclusion

Bodax SACCO Management System is a practical and relevant solution for boda boda SACCO operations in Mbarara. It already has a strong technical foundation and matches the core workflows of savings, loans, withdrawals, and governance reporting. With the proposed six-week completion plan, the system can move from prototype status to a more field-ready platform that improves transparency, accuracy, and member confidence.
