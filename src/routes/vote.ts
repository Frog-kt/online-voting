import { Router } from 'express';
import multer from 'multer';
import {
  showVotes,
  searchVoteTitle,
  searchVoteTag,
  postVotes,
  uploadImage,
  participateInVoting,
  showVoteById,
} from '../controllers/voteController';
import { requireAuth } from '../middlewares/auth';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get('/', showVotes); // 開催中の投票一覧取得
router.post('/', requireAuth, postVotes); // 新しい投票を作成
router.post('/image', requireAuth, upload.single('image'), uploadImage); // 画像のアップロード

router.get('/search/title/:keyword', searchVoteTitle); // タイトルで検索
router.get('/search/tag/:tagName', searchVoteTag); // タグで検索？

router.get('/:voteId', showVoteById); // 指定した投票を表示する
router.post('/:voteId', requireAuth, participateInVoting); // 指定した投票に参加(投票)する

export default router;
