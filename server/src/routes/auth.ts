import { Router } from 'express';
import {
  register,
  login,
  googleAuth,
  registerValidation,
  loginValidation
} from '../controllers/authController';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/google', googleAuth);

export default router;