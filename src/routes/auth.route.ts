import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { loginSchema } from '../validators/auth.validator';
import { validateRequest } from '../middleware/validation.middleware';

const router = Router();
const authController = new AuthController();

router.post('/login', validateRequest(loginSchema), authController.login);

export { router as authRoutes };