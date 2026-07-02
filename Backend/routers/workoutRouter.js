import express from 'express';
import {
  getPlans,
  savePlan,
  deletePlan,
  getSchedule,
  addSchedule,
  deleteSchedule,
  autoSchedule,
  pushSchedule,
} from '../controllers/workoutController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/plans', getPlans);
router.post('/plans', savePlan);
router.delete('/plans/:id', deletePlan);

router.get('/schedule', getSchedule);
router.post('/schedule', addSchedule);
router.delete('/schedule/:id', deleteSchedule);
router.post('/schedule/auto', autoSchedule);
router.post('/schedule/push', pushSchedule);

export default router;
