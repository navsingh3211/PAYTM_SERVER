import express from 'express';
import {
  getUserAccountBalance,
  transferMoney
} from '../controllers/account.controller.js';
import {verifyToken} from '../middlewares/auth_middleware.js';

const router = express.Router();

router.get('/account-balance',verifyToken,getUserAccountBalance);
router.post('/transfer-money',verifyToken,transferMoney);

export default router;