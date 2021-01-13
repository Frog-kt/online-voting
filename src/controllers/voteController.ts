import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { prisma } from '@/prisma';
import Joi, { number } from 'joi';
import getStream from 'into-stream';
import fs from 'fs';

import ErrorHandler from '../utils/ErrorHandler';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import { sendJwtToken, getJwtToken } from '../utils/jwt';
import config from '../config';
import vote from '@/routes/vote';

interface NewVoteArgs {
  title: string;
  imagePath: string;
  endDateTime: Date;
  leftImageTitle: string;
  rightImageTitle: string;
}

// *投票の一覧を表示 (人気順)
export const showVotes = catchAsyncErrors(async (req, res, next) => {
  const resObj = {
    1: {
      id: '8',
      endDatetime: '',
      title: '史上最強のエディター',
      imagePath: 'http://img.com/example.png',
      left: {
        title: 'Vim',
        score: 20,
      },
      right: {
        title: 'Emacs',
        score: 30,
      },
    },
    2: {
      id: '5',
      endDatetime: '',
      title: 'きのこの山・たけのこの里',
      imagePath: 'http://img.com/example.png',
      left: {
        title: 'Vim',
        score: 20,
      },
      right: {
        title: 'Emacs',
        score: 30,
      },
    },
  };

  res.status(200).json(resObj);
});

// *タイトルで投票を検索する
export const searchVoteTitle = catchAsyncErrors(async (req, res, next) => {
  console.log(req.params);

  const word = req.params.title;

  const val = await prisma.vote.findMany({
    where: {
      title: {
        contains: word,
      },
    },
  });

  console.log(val);

  const resObj = {
    1: {
      id: '8',
      endDatetime: '',
      title: '史上最強のエディター',
      imagePath: 'http://img.com/example.png',
      left: {
        title: 'Vim',
        score: 20,
      },
      right: {
        title: 'Emacs',
        score: 30,
      },
    },
    2: {
      id: '5',
      endDatetime: '',
      title: 'きのこの山・たけのこの里',
      imagePath: 'http://img.com/example.png',
      left: {
        title: 'Vim',
        score: 20,
      },
      right: {
        title: 'Emacs',
        score: 30,
      },
    },
  };

  res.status(200).json(resObj);
});

// *タグで投票を検索する
export const searchVoteTag = catchAsyncErrors(async (req, res, next) => {
  const resObj = {
    1: {
      id: '8',
      endDatetime: '',
      title: '史上最強のエディター',
      imagePath: 'http://img.com/example.png',
      left: {
        title: 'Vim',
        score: 20,
      },
      right: {
        title: 'Emacs',
        score: 30,
      },
    },
    2: {
      id: '5',
      endDatetime: '',
      title: 'きのこの山・たけのこの里',
      imagePath: 'http://img.com/example.png',
      left: {
        title: 'Vim',
        score: 20,
      },
      right: {
        title: 'Emacs',
        score: 30,
      },
    },
  };

  res.status(200).json(resObj);
});

// 新しい投票の作成
export const postVotes = catchAsyncErrors(async (req, res, next) => {
  const createVoteSchema = Joi.object({
    title: Joi.string().min(5).max(32).required(),
    imagePath: Joi.string().uri().required(),
    endDateTime: Joi.date().timestamp(),
    leftImageTitle: Joi.string().required(),
    rightImageTitle: Joi.string().required(),
  });

  let request;
  try {
    request = await createVoteSchema.validateAsync(req.body);
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }

  const { title, imagePath, endDateTime, leftImageTitle, rightImageTitle } = request as NewVoteArgs;

  let saveVote;
  try {
    saveVote = await prisma.vote.create({
      data: {
        title,
        imagePath,
        leftImageTitle,
        rightImageTitle,
        leftCounter: 0,
        rightCounter: 0,
        endDateTime,
      },
    });
  } catch (err) {
    return next(new ErrorHandler(err, 401));
  }

  res.status(200).json(saveVote);
});

// 新しい投票用の画像をアップロード
export const uploadImage = catchAsyncErrors(async (req, res, next) => {
  // !ここヘルプ
});

// 投票に参加する
export const participateInVoting = catchAsyncErrors(async (req, res, next) => {
  const destination: 'left' | 'right' = req.body.destination;
  const voteId = req.params.voteId;
  const vorterId = req.user;

  console.log(vorterId, voteId);

  // 投票が存在するか調べる
  const voteDoesExist = await prisma.vote.findUnique({
    where: {
      id: voteId,
    },
  });

  if (!voteDoesExist) {
    return next(new ErrorHandler('Vote Not Found.', 404));
  }

  // 既に投票しているかを調べる
  const voteCount = await prisma.isVoted.count({
    where: {
      vorterId: vorterId,
      voteId: voteId,
    },
  });

  if (!(voteCount === 0)) {
    return next(new ErrorHandler('Already voted.', 400));
  }

  // 投票トランザクション
  // 投票を実行
  const voteCountExec = prisma.voteAggregate.create({
    data: {
      isVotedWhere: destination,
      vote: {
        connect: { id: voteId },
      },
    },
  });
  const isVoted = prisma.isVoted.create({
    data: {
      vorter: { connect: { id: vorterId } },
      vote: { connect: { id: voteId } },
    },
  });

  let incrementVote;
  if (destination === 'left') {
    incrementVote = prisma.vote.update({
      where: { id: voteId },
      data: {
        leftCounter: { increment: 1 },
      },
    });
  } else if (destination === 'right') {
    incrementVote = prisma.vote.update({
      where: { id: voteId },
      data: {
        rightCounter: { increment: 1 },
      },
    });
  } else {
    return next(new ErrorHandler('error', 500));
  }

  try {
    const [resVoteCountExec, resIsVoted, resIncrimentCount] = await prisma.$transaction([
      voteCountExec,
      isVoted,
      incrementVote,
    ]);
  } catch (err) {
    return next(new ErrorHandler(err, 500));
  }

  res.status(200).json({ success: true });
});

// 指定したIDの投票を見る
export const showVoteById = catchAsyncErrors(async (req, res, next) => {
  const voteId = req.params.voteId;
  const vorterId = req.user;

  const voteById = await prisma.vote.findUnique({
    where: { id: voteId },
    include: {
      isVoted: {
        where: {
          vorterId,
          voteId,
        },
      },
    },
  });

  let isVoted = false;
  if (!(voteById.isVoted.length > 0)) isVoted = true;

  const voteResponse = {
    id: voteById.id,
    title: voteById.title,
    imagePath: voteById.imagePath,
    leftTitle: voteById.leftImageTitle,
    rightTitle: voteById.rightImageTitle,
    count: {
      left: voteById.leftCounter,
      right: voteById.rightCounter,
      all: voteById.leftCounter + voteById.rightCounter,
    },
    endDatetime: voteById.endDateTime,
    isVoted: isVoted,
  };

  res.status(200).json(voteResponse);
});
