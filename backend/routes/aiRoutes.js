import express from 'express'
const router = express.Router();
import { generateChapterContent, generateOutline} from '../controllers/aiController.js'
import protect from '../middlewares/authMiddleware.js';

// Apply protect middleware to all routes
router.use(protect)

router.post('/generate-outline', generateOutline);
router.post('/generate-chapter-content', generateChapterContent);

export default router