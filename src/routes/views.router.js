import express from 'express';
import { renderHome, renderRealTimeProducts } from '../controllers/viewsController.js';

const router = express.Router();

router.get('/', renderHome);
router.get('/realtimeproducts', renderRealTimeProducts);

export default router;
