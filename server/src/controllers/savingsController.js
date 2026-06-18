import * as savingsService from '../services/savingsService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const recordSaving = asyncHandler(async (req, res) => {
  res.status(201).json(await savingsService.recordSaving(req.validated.body, req.user.id));
});

export const memberSavingsSummary = asyncHandler(async (req, res) => {
  res.json(await savingsService.memberSavingsSummary(req.params.id));
});

export const memberStatement = asyncHandler(async (req, res) => {
  const memberId = req.user.role_code === 'MEMBER' ? req.user.member_id : req.validated.query.member_id;
  res.json(await savingsService.statement(memberId, req.validated.query.from, req.validated.query.to));
});
