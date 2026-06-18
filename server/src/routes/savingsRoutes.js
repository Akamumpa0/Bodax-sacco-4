import { Router } from 'express';
import * as controller from '../controllers/savingsController.js';
import { authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { idParamSchema, savingSchema, statementSchema } from '../validators/schemas.js';

const router = Router();

router.post('/', authorize('TREASURER'), validate(savingSchema), controller.recordSaving);
router.get('/statement', authorize('MEMBER', 'TREASURER', 'CHAIRMAN'), validate(statementSchema), controller.memberStatement);
router.get('/members/:id/summary', authorize('TREASURER', 'CHAIRMAN'), validate(idParamSchema), controller.memberSavingsSummary);

export default router;
