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

  console.log(request);

  const { title, imagePath, endDateTime, leftImageTitle, rightImageTitle } = request as NewVoteArgs;

  let saveVote;
  try {
    saveVote = await prisma.vote.create({
      data: {
        title,
        imagePath,
        leftImageTitle,
        rightImageTitle,
        endDateTime,
      },
    });
  } catch (err) {
    return next(new ErrorHandler(err, 401));
  }

  console.log(saveVote);

  res.status(200).json(saveVote);
});

// 新しい投票用の画像をアップロード
export const uploadImage = catchAsyncErrors(async (req, res, next) => {
  // !ここヘルプ
});
