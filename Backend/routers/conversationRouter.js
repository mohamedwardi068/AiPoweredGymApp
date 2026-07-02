import express from 'express';
import {
  getConversations,
  syncConversation,
  renameConversation,
  pinConversation,
  deleteConversation,
  likeMessage,
} from '../controllers/conversationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getConversations);
router.post('/', syncConversation);
router.post('/:id/rename', renameConversation);
router.post('/:id/pin', pinConversation);
router.delete('/:id', deleteConversation);
router.post('/:id/messages/:messageId/like', likeMessage);

export default router;
