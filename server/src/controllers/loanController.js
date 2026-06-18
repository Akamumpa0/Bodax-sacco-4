import * as loanService from '../services/loanService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const issueLoan = asyncHandler(async (req, res) => {
  res.status(201).json(await loanService.issueLoan(req.validated.body, req.user.id));
});

export const recordRepayment = asyncHandler(async (req, res) => {
  res.status(201).json(await loanService.recordRepayment(req.validated.body, req.user.id));
});

export const listLoans = asyncHandler(async (req, res) => {
  const memberId = req.user.role_code === 'MEMBER' ? req.user.member_id : req.query.member_id;
  res.json(await loanService.listLoans({ memberId, status: req.query.status }));
});
