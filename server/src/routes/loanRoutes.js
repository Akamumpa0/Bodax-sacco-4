import { Router } from 'express';
import * as controller from '../controllers/loanController.js';
import { authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { loanSchema, repaymentSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', authorize('MEMBER', 'TREASURER', 'CHAIRMAN'), controller.listLoans);
router.post('/', authorize('TREASURER'), validate(loanSchema), controller.issueLoan);
router.post('/repayments', authorize('TREASURER'), validate(repaymentSchema), controller.recordRepayment);

export default router;
