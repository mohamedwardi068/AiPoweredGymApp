import express from 'express';
import { getPlans, savePlan, deletePlan } from '../controllers/nutritionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/plans', getPlans);
router.post('/plans', savePlan);
router.delete('/plans/:id', deletePlan);

export default router;
