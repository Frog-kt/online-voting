import { Router } from 'express';
import multer from 'multer';
import { showVotes, searchVoteTitle, searchVoteTag, postVotes, uploadImage } from '../controllers/voteController';
import { requireAuth } from '../middlewares/auth';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

// 開催中の投票一覧取得
router.get('/', showVotes);

export default router;
