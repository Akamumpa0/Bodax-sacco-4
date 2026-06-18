import { query, transaction } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

function calculateLoan({ principal, interest_rate = 10, installment_count = 4 }) {
  const interestAmount = Number(principal) * (Number(interest_rate) / 100);
  const totalPayable = Number(principal) + interestAmount;
  return {
    interest_amount: interestAmount,
    total_payable: totalPayable,
    installment_amount: totalPayable / Number(installment_count),
  };
}

export async function issueLoan(payload, issuedBy) {
  const calculated = calculateLoan(payload);
  const { rows } = await query(
    `INSERT INTO loans
      (member_id, issued_by, principal, interest_rate, interest_amount, total_payable,
       installment_count, installment_amount, issued_date, due_date, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,COALESCE($9, CURRENT_DATE),$10,$11)
     RETURNING *`,
    [
      payload.member_id,
      issuedBy,
      payload.principal,
      payload.interest_rate ?? 10,
      calculated.interest_amount,
      calculated.total_payable,
      payload.installment_count ?? 4,
      calculated.installment_amount,
      payload.issued_date || null,
      payload.due_date,
      payload.notes || null,
    ],
  );
  return rows[0];
}

export async function refreshLoanStatus(client, loanId) {
  const { rows } = await client.query(
    `SELECT l.id, l.total_payable, l.due_date, l.status,
            COALESCE(SUM(r.amount), 0) AS paid
     FROM loans l
     LEFT JOIN loan_repayments r ON r.loan_id = l.id
     WHERE l.id = $1
     GROUP BY l.id`,
    [loanId],
  );
  const loan = rows[0];
  if (!loan) throw new AppError('Loan not found', 404);

  const balance = Number(loan.total_payable) - Number(loan.paid);
  const status = balance <= 0 ? 'completed' : new Date(loan.due_date) < new Date() ? 'overdue' : 'active';

  await client.query('UPDATE loans SET status = $2, updated_at = NOW() WHERE id = $1', [loanId, status]);
  return { ...loan, remaining_balance: Math.max(balance, 0), status };
}

export async function recordRepayment(payload, recordedBy) {
  return transaction(async (client) => {
    const loanResult = await client.query('SELECT * FROM loans WHERE id = $1', [payload.loan_id]);
    const loan = loanResult.rows[0];
    if (!loan) throw new AppError('Loan not found', 404);

    const repayment = await client.query(
      `INSERT INTO loan_repayments (loan_id, member_id, recorded_by, amount, payment_date, notes)
       VALUES ($1,$2,$3,$4,COALESCE($5, CURRENT_DATE),$6)
       RETURNING *`,
      [payload.loan_id, loan.member_id, recordedBy, payload.amount, payload.payment_date || null, payload.notes || null],
    );

    const summary = await refreshLoanStatus(client, payload.loan_id);
    return { repayment: repayment.rows[0], loan: summary };
  });
}

export async function listLoans({ memberId, status } = {}) {
  const params = [];
  const filters = [];
  if (memberId) {
    params.push(memberId);
    filters.push(`l.member_id = $${params.length}`);
  }
  if (status) {
    params.push(status);
    filters.push(`l.status = $${params.length}`);
  }
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const { rows } = await query(
    `SELECT l.*, m.full_name, m.member_number,
            COALESCE(SUM(r.amount), 0) AS amount_paid,
            GREATEST(l.total_payable - COALESCE(SUM(r.amount), 0), 0) AS remaining_balance
     FROM loans l
     JOIN members m ON m.id = l.member_id
     LEFT JOIN loan_repayments r ON r.loan_id = l.id
     ${where}
     GROUP BY l.id, m.full_name, m.member_number
     ORDER BY l.created_at DESC`,
    params,
  );
  return rows;
}

export async function memberActiveLoan(memberId) {
  const loans = await listLoans({ memberId, status: 'active' });
  return loans[0] || null;
}
