import { query, transaction } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

export async function createWithdrawalRequest(payload) {
  const { rows } = await query(
    `INSERT INTO withdrawal_requests (member_id, amount, reason)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [payload.member_id, payload.amount, payload.reason || null],
  );
  return rows[0];
}

export async function listWithdrawalRequests(status) {
  const params = [];
  const where = status ? 'WHERE wr.status = $1' : '';
  if (status) params.push(status);
  const { rows } = await query(
    `SELECT wr.*, m.full_name, m.member_number
     FROM withdrawal_requests wr
     JOIN members m ON m.id = wr.member_id
     ${where}
     ORDER BY wr.requested_at DESC`,
    params,
  );
  return rows;
}

export async function reviewWithdrawalRequest(id, action, reviewedBy) {
  return transaction(async (client) => {
    const found = await client.query('SELECT * FROM withdrawal_requests WHERE id = $1 FOR UPDATE', [id]);
    const request = found.rows[0];
    if (!request) throw new AppError('Withdrawal request not found', 404);
    if (request.status !== 'pending') throw new AppError('Request has already been reviewed', 409);

    const status = action === 'approve' ? 'approved' : 'rejected';
    const reviewed = await client.query(
      `UPDATE withdrawal_requests
       SET status = $2, reviewed_by = $3, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, status, reviewedBy],
    );

    let withdrawal = null;
    if (status === 'approved') {
      const created = await client.query(
        `INSERT INTO withdrawals (request_id, member_id, recorded_by, amount, notes)
         VALUES ($1,$2,$3,$4,$5)
         RETURNING *`,
        [id, request.member_id, reviewedBy, request.amount, request.reason],
      );
      withdrawal = created.rows[0];
    }

    return { request: reviewed.rows[0], withdrawal };
  });
}
