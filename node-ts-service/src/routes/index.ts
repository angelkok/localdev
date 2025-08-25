import { Router } from 'express';
import defaultRoutes from './default.routes';

const router = Router();

// Add more route files here
// e.g. router.use('/users', userRoutes);
router.use('/', defaultRoutes);

export default router;
