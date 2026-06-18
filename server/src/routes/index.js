import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import authRoutes from './authRoutes.js';
import loanRoutes from './loanRoutes.js';
import memberRoutes from './memberRoutes.js';
import reportRoutes from './reportRoutes.js';
import savingsRoutes from './savingsRoutes.js';
import withdrawalRoutes from './withdrawalRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/members', authenticate, memberRoutes);
router.use('/savings', authenticate, savingsRoutes);
router.use('/loans', authenticate, loanRoutes);
router.use('/withdrawals', authenticate, withdrawalRoutes);
router.use('/reports', authenticate, reportRoutes);

export default router;
