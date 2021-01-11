import { Router } from 'express';
import { showVotes } from '../controllers/voteController';

const router = Router();

// 開催中の投票一覧取得
router.get('/', showVotes);

export default router;
