# Bodax SACCO – SMS / WhatsApp Notification Event Table

**Version:** 1.0  
**Date:** July 2026  
**Purpose:** Defines all automated notification events, the message recipient, and the exact trigger condition that fires each notification.

---

## Notification Events

| # | Event | Recipient | Trigger Condition |
|---|-------|-----------|------------------|
| 1 | **Deposit recorded** | Member | A savings transaction is created for the member and `confirmed = true` is set by the treasurer |
| 2 | **Loan approved** | Member | A loan request with status `pending` is updated to `approved` by the treasurer via `PATCH /loans/requests/:id/review` with `action = "approve"` |
| 3 | **Loan rejected** | Member | A loan request with status `pending` is updated to `rejected` by the treasurer via `PATCH /loans/requests/:id/review` with `action = "reject"` |
| 4 | **Loan due soon** | Member | A scheduled daily job finds an active loan whose `due_date` falls within the next **7 days** and no full repayment has been recorded yet |
| 5 | **Loan overdue** | Member | A scheduled daily job finds an active loan whose `due_date` has passed (`due_date < CURRENT_DATE`) and the outstanding balance is greater than zero |
| 6 | **Withdrawal approved** | Member | A withdrawal request with status `pending` is updated to `approved` by the treasurer via `PATCH /withdrawals/requests/:id/review` with `action = "approve"` |

---

## Proposed SMS Message Templates

| Event | Template |
|-------|----------|
| Deposit recorded | `Bodax SACCO: Your savings of UGX {amount} have been received on {date}. Total savings: UGX {total}. Thank you.` |
| Loan approved | `Bodax SACCO: Your loan request of UGX {amount} has been approved. The funds will be disbursed shortly. Repayment due: {due_date}.` |
| Loan rejected | `Bodax SACCO: Your loan request of UGX {amount} was not approved. Reason: {reason}. Contact your treasurer for details.` |
| Loan due soon | `Bodax SACCO: Reminder – your loan repayment of UGX {remaining_balance} is due on {due_date}. Please repay on time to avoid penalties.` |
| Loan overdue | `Bodax SACCO: URGENT – Your loan repayment of UGX {remaining_balance} was due on {due_date} and is now overdue. Please repay immediately.` |
| Withdrawal approved | `Bodax SACCO: Your withdrawal of UGX {amount} has been approved and will be processed. Contact your treasurer if you have questions.` |

---

## Technical Notes

- **Provider:** Africa's Talking (see `OTP_INTEGRATION_RECOMMENDATION.md`)
- **Scheduling:** Events 4 and 5 (loan due soon / overdue) require a cron job running daily at 08:00 EAT using a scheduler such as `node-cron`
- **Deduplication:** Events 4 and 5 should record the `last_notified_at` date per loan so members do not receive the same reminder multiple times for the same loan in the same day
- **Character limit:** Standard SMS is 160 characters. All templates above fit within this limit
- **WhatsApp alternative:** Africa's Talking also supports WhatsApp Business API for richer formatting; the same trigger conditions apply

---

*Bodax SACCO – Mbarara Boda Boda Savings and Loans*
