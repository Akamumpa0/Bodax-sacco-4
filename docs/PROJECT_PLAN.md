# Bodax SACCO Management System Project Plan

## 1. Plan Overview

This project plan covers the remaining 6-week completion period for Bodax SACCO Management System. The plan focuses on turning the current working prototype into a cleaner, better documented, field-ready SACCO platform for boda boda riders, treasurers, and chairmen.

The plan is based on:

- The current React, Express, and PostgreSQL codebase.
- Existing modules for members, savings, loans, withdrawals, dashboards, and reports.
- Field-test feedback from Mile 4 Boda Boda Stage in Mbarara.
- The need for clear project documentation, user guidance, testing, and deployment readiness.

## 2. Project Duration

Total duration: 6 weeks.

Suggested timeline:

- Week 1: Documentation baseline and critical data-entry safety.
- Week 2: Authentication and member trust improvements.
- Week 3: Savings, statements, withdrawals, and mobile usability.
- Week 4: Loans, repayments, reminders, and chairman visibility.
- Week 5: Reporting, testing, deployment hardening, and training materials.
- Week 6: User acceptance testing, fixes, final documentation, and handover.

## 3. Project Objectives for the 6 Weeks

- Complete clear project proposal, documentation, and implementation plan.
- Improve field usability for boda boda riders using small Android phones.
- Reduce financial data-entry mistakes in savings, loans, and withdrawals.
- Strengthen phone-first member access and account identity.
- Improve loan request, approval, repayment, and overdue tracking.
- Prepare dashboards and reports for real SACCO committee use.
- Test the system end to end before pilot rollout.
- Deliver final handover documentation.

## 4. Work Breakdown by Week

### Week 1: Documentation Baseline and Critical Safety

Main goal: Establish clear documentation and fix the highest-risk financial workflow issue.

Planned activities:

- Prepare project proposal, project documentation, and project plan.
- Review existing modules and confirm system scope.
- Document current business rules for savings, loans, withdrawals, and reports.
- Add confirmation prompts before important financial submissions:
  - Record savings.
  - Approve loan request.
  - Reject loan request.
  - Issue loan.
  - Record repayment.
  - Approve withdrawal.
  - Reject withdrawal.
- Ensure confirmation text shows member name, member number, amount, and action.
- Review current validation messages and make them clearer for field users.
- Create a testing checklist for critical financial workflows.

Deliverables:

- Project proposal document.
- Project documentation document.
- Project plan document.
- Confirmation workflow design.
- Updated financial action screens.
- Week 1 test notes.

Acceptance criteria:

- Documentation exists and reflects the current system.
- Treasurer cannot accidentally submit major financial actions without seeing a confirmation message.
- Confirmation messages use human-readable member details, not only IDs.

### Week 2: Authentication and Member Trust

Main goal: Make login and member identity easier and more trustworthy for riders.

Planned activities:

- Improve login screen wording so riders understand they can use phone number or email where supported.
- Prepare phone-number-first login flow.
- Review member signup and member credential assignment.
- Display member full name and member number prominently on the member dashboard.
- Add or prepare space for member photo/avatar if required.
- Improve profile page to clearly show SACCO identity details.
- Make password change flow clearer.
- Document recommended OTP integration approach for future SMS login.
- Review authentication and authorization edge cases.

Deliverables:

- Improved login and member identity screens.
- Updated member dashboard identity header.
- Authentication notes in documentation.
- OTP integration recommendation.

Acceptance criteria:

- A member can clearly identify that the dashboard belongs to them.
- The login experience is less email-dependent in wording and flow.
- Profile information is understandable to ordinary SACCO members.

### Week 3: Savings, Statements, Withdrawals, and Mobile Usability

Main goal: Improve day-to-day SACCO transactions and small-screen use.

Planned activities:

- Update UGX amount inputs to accept values such as `50000` and `50,000`.
- Normalize formatted amounts before API submission or validation.
- Improve validation messages for amount fields.
- Improve savings record form layout and field labels.
- Add deposit success details that can act as a simple receipt summary.
- Improve member statements for mobile screens by using responsive cards or better table behavior.
- Improve withdrawal request and withdrawal review screens.
- Confirm statement records show savings, loan repayments, and withdrawals clearly.
- Test on narrow mobile widths representing low-cost Android phones.

Deliverables:

- Improved amount input handling.
- Mobile-friendly statements view.
- Clear savings success/receipt summary.
- Improved withdrawal workflow screens.
- Week 3 mobile test notes.

Acceptance criteria:

- Users can enter `50,000` without validation confusion.
- Statements are readable on small screens.
- Savings and withdrawal workflows use clearer member-facing language.

### Week 4: Loans, Repayments, Reminders, and Chairman Visibility

Main goal: Strengthen the SACCO loan workflow and oversight experience.

Planned activities:

- Review loan eligibility messages and simplify loan terminology.
- Replace confusing terms where needed:
  - `Installment count` becomes `Number of payments`.
  - `Principal` becomes `Amount borrowed` where user-facing.
- Improve loan request status display for members.
- Improve loan approval/rejection screens for treasurer.
- Ensure active, completed, and overdue loans display clearly.
- Improve repayment recording workflow.
- Review overdue loan status refresh behavior.
- Improve chairman view of defaulters and overdue loans.
- Ensure chairman and treasurer views show member names and member numbers instead of technical IDs.
- Prepare SMS or WhatsApp notification event list:
  - Deposit recorded.
  - Loan approved.
  - Loan rejected.
  - Loan due soon.
  - Loan overdue.
  - Withdrawal approved.

Deliverables:

- Clearer loan forms and loan status pages.
- Improved overdue loan and defaulter visibility.
- Notification event plan.
- Week 4 loan workflow test notes.

Acceptance criteria:

- Members understand loan request fields and status.
- Treasurer can approve/reject and record repayments confidently.
- Chairman can identify overdue loans by member name and amount.

### Week 5: Reporting, Testing, Deployment, and Training Materials

Main goal: Stabilize the system and prepare it for a controlled pilot.

Planned activities:

- Verify treasurer dashboard totals.
- Verify chairman dashboard totals.
- Verify analytics for top savers, defaulters, collections, income, and expenditure.
- Add or document report interpretation notes for SACCO leaders.
- Test all major API endpoints.
- Test role-based access for Member, Treasurer, and Chairman.
- Review deployment environment variables.
- Confirm health check endpoint works.
- Review Render and Vercel deployment setup.
- Prepare training materials:
  - Treasurer quick guide.
  - Member quick guide.
  - Chairman quick guide.
  - Pilot support checklist.

Deliverables:

- Tested dashboards and reports.
- Deployment checklist.
- User training guides.
- Role-based testing checklist.
- Week 5 test report.

Acceptance criteria:

- Dashboard numbers match expected database records.
- Each role can access only the correct screens.
- Deployment steps and environment variables are documented.
- Training guides are ready for SACCO users.

### Week 6: User Acceptance Testing, Final Fixes, and Handover

Main goal: Complete final validation and prepare for SACCO committee sign-off.

Planned activities:

- Conduct full end-to-end testing:
  - Register member.
  - Assign login.
  - Record savings.
  - View member dashboard.
  - Request loan.
  - Approve loan.
  - Record repayment.
  - Track overdue/completed status.
  - Request withdrawal.
  - Approve withdrawal.
  - View reports.
- Conduct user acceptance testing with sample users.
- Fix defects discovered during final testing.
- Finalize project proposal, documentation, and plan.
- Prepare final handover package.
- Prepare pilot rollout recommendations.
- Record known limitations and future enhancements.

Deliverables:

- Final tested application.
- Final project documentation.
- Final user guides.
- UAT report.
- Handover notes.
- Pilot rollout recommendation.

Acceptance criteria:

- Core SACCO workflows run successfully end to end.
- Critical field-test issues are fixed or clearly documented for the next phase.
- SACCO committee can review the project with clear documents and test evidence.

## 5. Documentation Plan

Documentation will be maintained throughout the 6 weeks instead of being written only at the end.

| Week | Documentation Work |
| --- | --- |
| Week 1 | Create proposal, project documentation, and project plan; document current modules and business rules |
| Week 2 | Update authentication, member identity, and profile documentation |
| Week 3 | Add savings, statement, withdrawal, mobile usability, and receipt notes |
| Week 4 | Add loan workflow, repayment, eligibility, overdue loan, and notification documentation |
| Week 5 | Add reporting, deployment, testing, and user training guides |
| Week 6 | Finalize all documents, add UAT findings, known limitations, and handover notes |

Required documents by completion:

- Project Proposal.
- Project Documentation.
- Project Plan.
- Treasurer User Guide.
- Member User Guide.
- Chairman User Guide.
- Deployment Checklist.
- Testing and UAT Report.
- Handover Notes.

## 6. Testing Plan by Week

| Week | Testing Focus |
| --- | --- |
| Week 1 | Confirmation prompts and financial action safety |
| Week 2 | Login, role access, member identity, profile, password changes |
| Week 3 | Savings entry, amount validation, statements, withdrawals, mobile layout |
| Week 4 | Loan eligibility, requests, approvals, repayments, overdue status |
| Week 5 | Reports, dashboards, API endpoints, deployment configuration |
| Week 6 | Full end-to-end testing and user acceptance testing |

## 7. Roles and Responsibilities

| Role | Responsibility |
| --- | --- |
| Project Lead | Coordinate weekly tasks, track completion, approve scope changes |
| Frontend Developer | Implement React pages, forms, responsive layouts, and role screens |
| Backend Developer | Implement API logic, validation, database queries, and business rules |
| Database Lead | Maintain schema, indexes, seed data, and data integrity |
| Tester | Validate workflows, mobile views, role access, and field-test fixes |
| SACCO Treasurer | Provide operational feedback and test real savings/loan workflows |
| SACCO Chairman | Validate reports, defaulters, arrears, and governance requirements |
| Member Representatives | Test usability from the rider perspective |

## 8. Priority Backlog

### Critical

- Confirmation prompts before financial actions.
- Phone-friendly login and account identification.
- UGX amount fields that accept comma formatting.
- Mobile-readable statements and loan tables.
- Member names displayed clearly in treasurer and chairman views.

### High Priority

- SMS or WhatsApp notification integration plan.
- Deposit receipt or shareable transaction proof.
- Improved loan terminology for riders.
- Overdue loan dashboard for chairman.
- Better role-specific training materials.

### Medium Priority

- Local language support for common labels and errors.
- Offline mode planning.
- Optional member photo/avatar.
- More advanced audit logs.
- Exportable reports.

## 9. Risk Management

| Risk | Likelihood | Impact | Response |
| --- | --- | --- | --- |
| Scope grows beyond 6 weeks | Medium | High | Keep v1 focused on core SACCO workflows and move extras to future backlog |
| SMS/OTP integration takes longer than expected | Medium | Medium | Document provider plan first and implement only if core work is stable |
| Database errors affect financial records | Low | High | Use transactions, validation, confirmation prompts, and careful testing |
| Users struggle with English terminology | Medium | Medium | Simplify wording first, then plan Runyankore translations |
| Mobile layouts fail on small devices | Medium | High | Test weekly at narrow widths and convert complex tables to cards |
| Deployment environment variables are misconfigured | Medium | Medium | Maintain a deployment checklist and verify `/health` endpoint |

## 10. Milestone Summary

| Milestone | Target Week | Output |
| --- | --- | --- |
| Documentation baseline complete | Week 1 | Proposal, documentation, plan |
| Critical financial safety improved | Week 1 | Confirmation prompts |
| Member trust improvements complete | Week 2 | Better login wording and identity display |
| Transaction workflows improved | Week 3 | Savings, statements, withdrawals, amount inputs |
| Loan workflow strengthened | Week 4 | Loan requests, approvals, repayments, overdue visibility |
| Reports and deployment validated | Week 5 | Dashboards, analytics, deployment checklist |
| Final UAT and handover complete | Week 6 | Final docs, test report, pilot recommendation |

## 11. Definition of Done

A feature or document is considered done when:

- It matches the agreed SACCO workflow.
- It is understandable to its intended user role.
- It has been tested with valid and invalid inputs.
- It handles errors clearly.
- It does not expose another member's private data.
- It works on desktop and mobile screen sizes.
- Its relevant documentation has been updated.

## 12. Final Handover Package

At the end of week 6, the project should include:

- Working deployed application.
- Source code in the repository.
- Database schema and setup instructions.
- Project proposal.
- Project documentation.
- Project plan.
- User guides for Member, Treasurer, and Chairman.
- Deployment checklist.
- Testing and UAT report.
- Known issues and future enhancement list.
- Pilot rollout recommendation for the SACCO committee.
