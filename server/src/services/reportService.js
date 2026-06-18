import { query } from '../config/db.js';
import { monthStart, weekStart } from '../utils/dates.js';

export async function treasurerDashboard() {
  const today = new Date();
  const { rows } = await query(
    `SELECT
       (SELECT COUNT(*)::int FROM members WHERE status = 'active') AS active_members,
       (SELECT COALESCE(SUM(amount), 0) FROM savings_transactions WHERE transaction_date = CURRENT_DATE) AS daily_collections,
       (SELECT COALESCE(SUM(amount), 0) FROM savings_transactions WHERE transaction_date >= $1) AS weekly_collections,
       (SELECT COALESCE(SUM(amount), 0) FROM savings_transactions WHERE transaction_date >= $2) AS monthly_collections,
       (SELECT COUNT(*)::int FROM withdrawal_requests WHERE status = 'pending') AS pending_withdrawals,
       (SELECT COUNT(*)::int FROM loans WHERE status = 'active') AS active_loans`,
    [weekStart(today), monthStart(today)],
  );
  return rows[0];
}

export async function chairmanDashboard() {
  const today = new Date();
  const { rows } = await query(
    `SELECT
       (SELECT COUNT(*)::int FROM members) AS members,
       (SELECT COALESCE(SUM(amount), 0) FROM savings_transactions) AS total_savings,
       (SELECT COUNT(*)::int FROM loans WHERE status = 'active') AS active_loans,
       (SELECT COALESCE(SUM(balance), 0)
        FROM (
          SELECT GREATEST(l.total_payable - COALESCE(SUM(r.amount), 0), 0) AS balance
          FROM loans l LEFT JOIN loan_repayments r ON r.loan_id = l.id
          WHERE l.status IN ('active','overdue')
          GROUP BY l.id
        ) loan_balances) AS outstanding_loan_balance,
       (SELECT COALESCE(SUM(balance), 0)
        FROM (
          SELECT GREATEST(l.total_payable - COALESCE(SUM(r.amount), 0), 0) AS balance
          FROM loans l LEFT JOIN loan_repayments r ON r.loan_id = l.id
          WHERE l.status = 'overdue' OR (l.status = 'active' AND l.due_date < CURRENT_DATE)
          GROUP BY l.id
        ) arrears) AS loan_arrears,
       (SELECT COALESCE(SUM(amount), 0) FROM savings_transactions WHERE transaction_date >= $1) AS weekly_collections,
       (SELECT COALESCE(SUM(amount), 0) FROM savings_transactions WHERE transaction_date >= $2) AS monthly_collections`,
    [weekStart(today), monthStart(today)],
  );
  return rows[0];
}

export async function memberDashboard(memberId) {
  const { rows } = await query(
    `SELECT
       (SELECT COALESCE(SUM(amount), 0) FROM savings_transactions WHERE member_id = $1) AS total_savings,
       (SELECT COALESCE(SUM(amount), 0) FROM savings_transactions WHERE member_id = $1 AND transaction_date >= $2) AS week_savings,
       (SELECT COALESCE(SUM(amount), 0) FROM savings_transactions WHERE member_id = $1 AND transaction_date >= $3) AS month_savings,
       (SELECT COALESCE(SUM(balance), 0)
        FROM (
          SELECT GREATEST(l.total_payable - COALESCE(SUM(r.amount), 0), 0) AS balance
          FROM loans l LEFT JOIN loan_repayments r ON r.loan_id = l.id
          WHERE l.member_id = $1 AND l.status IN ('active','overdue')
          GROUP BY l.id
        ) member_loan_balances) AS active_loan_balance,
       (SELECT COALESCE(SUM(amount), 0) FROM loan_repayments WHERE member_id = $1 AND payment_date >= $2) AS paid_this_week`,
    [memberId, weekStart(new Date()), monthStart(new Date())],
  );
  return rows[0];
}

export async function topSavers() {
  const { rows } = await query(
    `SELECT m.full_name, m.member_number, COALESCE(SUM(s.amount), 0) AS total
     FROM members m
     LEFT JOIN savings_transactions s ON s.member_id = m.id
     GROUP BY m.id
     ORDER BY total DESC
     LIMIT 10`,
  );
  return rows;
}

export async function defaulters() {
  const { rows } = await query(
    `SELECT m.full_name, m.member_number, l.due_date,
            GREATEST(l.total_payable - COALESCE(SUM(r.amount), 0), 0) AS balance
     FROM loans l
     JOIN members m ON m.id = l.member_id
     LEFT JOIN loan_repayments r ON r.loan_id = l.id
     WHERE l.status = 'overdue'
     GROUP BY l.id, m.full_name, m.member_number
     ORDER BY balance DESC`,
  );
  return rows;
}

export async function collectionTrend(months = 6) {
  const { rows } = await query(
    `SELECT to_char(date_trunc('month', transaction_date), 'Mon YYYY') AS period,
            COALESCE(SUM(amount), 0) AS savings
     FROM savings_transactions
     WHERE transaction_date >= date_trunc('month', CURRENT_DATE) - (($1::int - 1) * interval '1 month')
     GROUP BY date_trunc('month', transaction_date)
     ORDER BY date_trunc('month', transaction_date)`,
    [months],
  );
  return rows;
}

export async function incomeSummary() {
  const { rows } = await query(
    `SELECT
       (SELECT COALESCE(SUM(amount), 0) FROM savings_transactions) AS savings_collected,
       (SELECT COALESCE(SUM(amount), 0) FROM loan_repayments) AS loan_repayments,
       (SELECT COALESCE(SUM(interest_amount), 0) FROM loans) AS interest_income`,
  );
  return rows[0];
}

export async function expenditureSummary() {
  const { rows } = await query(
    `SELECT COALESCE(SUM(amount), 0) AS withdrawals_paid, COUNT(*)::int AS withdrawal_count
     FROM withdrawals`,
  );
  return rows[0];
}
