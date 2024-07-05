import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema, loginUserSchema } from '../validation/auth.js';
import { validateBody } from '../middleware/validateBody.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
} from '../controllers/auth.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', authenticate, ctrlWrapper(logoutUserController));
router.post(
  '/refresh',
  authenticate,
  ctrlWrapper(refreshUserSessionController),
);

export default router;
