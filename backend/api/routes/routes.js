import express from 'express';
import { 
    registerUser,
    loginUser,
    deposit,
    borrowLoan,
    payLoan,
    invest,
    getDashboard
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.use(protect);

// Wallet routes
router.post('/deposit', deposit);
router.post('/borrow', borrowLoan);
router.post('/pay', payLoan);

// Investment routes
router.post('/invest', invest);
router.get('/dashboard', getDashboard);

export default router;
