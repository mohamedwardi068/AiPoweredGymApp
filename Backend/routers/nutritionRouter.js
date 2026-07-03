import express from 'express';
import {
  getPlans,
  savePlan,
  updatePlan,
  deletePlan,
  searchFoods,
  getFavorites,
  addFavorite,
  removeFavorite,
  getRecents,
  addRecent
} from '../controllers/nutritionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/plans', getPlans);
router.post('/plans', savePlan);
router.put('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan);

// Food Database endpoints
router.get('/foods', searchFoods);
router.get('/foods/favorites', getFavorites);
router.post('/foods/favorites', addFavorite);
router.delete('/foods/favorites/:id', removeFavorite);
router.get('/foods/recent', getRecents);
router.post('/foods/recent', addRecent);

export default router;
