# Bodax SACCO – Critical Financial Workflow Testing Checklist

**Version:** 1.0  
**Date:** July 2026  
**Purpose:** Manual QA verification for all critical financial actions before deployment or release.

---

## Instructions

For each test case:
- Mark **PASS** if the workflow completes correctly end-to-end.
- Mark **FAIL** if any step produces unexpected behaviour, wrong data, or no response.
- Record the **Tester** name and **Date** tested.

**Tester:** _________________________  **Date:** _________________

---

## 1. Record Savings

| # | Step | Expected Result | Pass | Fail |
|---|------|-----------------|------|------|
| 1.1 | Log in as Treasurer, navigate to **Savings → Record Savings** | Page loads with member dropdown and amount field | ☐ | ☐ |
| 1.2 | Leave member unselected, click **Record savings** | Error: "Select a member before continuing." | ☐ | ☐ |
| 1.3 | Leave amount blank, click **Record savings** | Error: "Enter a valid savings amount in UGX, e.g. 50000 or 50,000." | ☐ | ☐ |
| 1.4 | Enter amount as **50,000** (with comma), click **Record savings** | Confirmation modal opens (no validation error) | ☐ | ☐ |
| 1.5 | In the confirmation modal, verify it shows: member name, member number, amount, date, action | All five fields visible | ☐ | ☐ |
| 1.6 | Click **Cancel** in modal | Modal closes, form is unchanged | ☐ | ☐ |
| 1.7 | Re-open modal, click **Record savings** to confirm | Receipt screen appears showing member name, number, amount, date, treasurer name | ☐ | ☐ |
| 1.8 | Click **Print receipt** | Browser print dialog opens | ☐ | ☐ |
| 1.9 | Click **Record another** | Returns to blank form | ☐ | ☐ |
| 1.10 | Log in as the same member, check dashboard | Total savings updated with new amount | ☐ | ☐ |

**Notes:** ______________________________________________________________________

---

## 2. Approve Loan

| # | Step | Expected Result | Pass | Fail |
|---|------|-----------------|------|------|
| 2.1 | Log in as Treasurer, navigate to **Confirm loans** | Page loads; pending requests show member name, number, amount, savings balance side-by-side | ☐ | ☐ |
| 2.2 | Click **Approve** on an eligible loan | Confirmation modal opens with member name, member number, amount, action | ☐ | ☐ |
| 2.3 | Click **Cancel** | Modal closes; request status unchanged | ☐ | ☐ |
| 2.4 | Re-open modal, click **Approve** to confirm | Loan request status changes to Approved | ☐ | ☐ |
| 2.5 | Check **Loans** page | New loan entry appears for the member | ☐ | ☐ |

**Notes:** ______________________________________________________________________

---

## 3. Reject Loan

| # | Step | Expected Result | Pass | Fail |
|---|------|-----------------|------|------|
| 3.1 | On **Confirm loans**, click **Reject** on a pending request | Confirmation modal opens showing member name, member number, amount, action = "Reject loan request" | ☐ | ☐ |
| 3.2 | Click **Cancel** | Modal closes; request unchanged | ☐ | ☐ |
| 3.3 | Re-open, click **Reject** to confirm | Request status changes to Rejected | ☐ | ☐ |
| 3.4 | Log in as member | Loan request shows **rejected** badge on Loans page | ☐ | ☐ |

**Notes:** ______________________________________________________________________

---

## 4. Issue Loan

| # | Step | Expected Result | Pass | Fail |
|---|------|-----------------|------|------|
| 4.1 | Navigate to **Loans → Issue loan** | Form shows: member dropdown, amount borrowed, interest %, number of payments, due date | ☐ | ☐ |
| 4.2 | Submit with no member selected | Error: "Select a member before continuing." | ☐ | ☐ |
| 4.3 | Enter amount as **1,000,000** (with comma), fill all fields, click **Issue loan** | Confirmation modal opens (no validation error from comma) | ☐ | ☐ |
| 4.4 | Modal shows: member name, number, amount borrowed, interest, number of payments, due date | All fields visible | ☐ | ☐ |
| 4.5 | Click **Cancel** | Modal closes | ☐ | ☐ |
| 4.6 | Click **Issue loan** to confirm | Loan created; appears in Loan book table | ☐ | ☐ |

**Notes:** ______________________________________________________________________

---

## 5. Record Repayment

| # | Step | Expected Result | Pass | Fail |
|---|------|-----------------|------|------|
| 5.1 | Navigate to **Loans → Record repayment** | Loan dropdown lists active/overdue loans with balance and due date | ☐ | ☐ |
| 5.2 | Select a loan from the dropdown | Amount field pre-fills with remaining balance; due date shown below | ☐ | ☐ |
| 5.3 | Leave amount blank, click **Record repayment** | Error: "Enter a valid repayment amount in UGX, e.g. 50,000." | ☐ | ☐ |
| 5.4 | With valid amount, click **Record repayment** | Confirmation modal opens with member name, number, amount, remaining balance | ☐ | ☐ |
| 5.5 | Click **Cancel** | Modal closes | ☐ | ☐ |
| 5.6 | Click **Record repayment** to confirm | Repayment saved; loan balance updated in Loan book | ☐ | ☐ |

**Notes:** ______________________________________________________________________

---

## 6. Approve Withdrawal

| # | Step | Expected Result | Pass | Fail |
|---|------|-----------------|------|------|
| 6.1 | Navigate to **Withdrawals** | Table lists requests with member name, member number, amount, status badge | ☐ | ☐ |
| 6.2 | Click **Approve** on a pending request | Confirmation modal opens showing member name, member number, requested amount, action | ☐ | ☐ |
| 6.3 | Click **Cancel** | Modal closes; status unchanged | ☐ | ☐ |
| 6.4 | Click **Approve** to confirm | Status badge changes to **approved** (green) | ☐ | ☐ |

**Notes:** ______________________________________________________________________

---

## 7. Reject Withdrawal

| # | Step | Expected Result | Pass | Fail |
|---|------|-----------------|------|------|
| 7.1 | On **Withdrawals**, click **Reject** on a pending request | Confirmation modal opens showing member name, member number, requested amount, action = "Reject withdrawal" | ☐ | ☐ |
| 7.2 | Click **Cancel** | Modal closes; status unchanged | ☐ | ☐ |
| 7.3 | Click **Reject** to confirm | Status badge changes to **rejected** (red) | ☐ | ☐ |

**Notes:** ______________________________________________________________________

---

## 8. Cross-Cutting Checks

| # | Check | Expected Result | Pass | Fail |
|---|-------|-----------------|------|------|
| 8.1 | Member opens dashboard | Full name and member number visible **without scrolling** | ☐ | ☐ |
| 8.2 | Enter **50,000** in any amount field | No validation error | ☐ | ☐ |
| 8.3 | View Statements on a 375 px screen | Stacked cards, **no horizontal scroll** | ☐ | ☐ |
| 8.4 | Chairman opens dashboard | Most overdue loan name and amount visible within 5 seconds | ☐ | ☐ |
| 8.5 | Slow or failed API request | Loading spinner appears; Retry button shown on failure | ☐ | ☐ |

**Notes:** ______________________________________________________________________

---

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Tester | | | |
| Treasurer | | | |
| Chairman | | | |
