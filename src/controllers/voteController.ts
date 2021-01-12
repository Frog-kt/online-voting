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
  res.status(200).send('OK');
});

// 新しい投票用の画像をアップロード
export const uploadImage = catchAsyncErrors(async (req, res, next) => {
  // const file = req.file;
  // console.log(file);
  // const imageId = uuid();

  // if (!checkFileExt(file.mimetype)) {
  //   return next(new ErrorHandler('Upload only accept jpeg, png, svg, gif and webp file.', 400));
  // }

  // try {
  //   fs.writeFileSync(`./upload/${imageId}.jpg`, file.buffer, 'binary');
  // } catch (err) {
  //   console.log(err);
  //   return next(new ErrorHandler('Upload failed.', 500));
  // }
  const tmp_path = req.file.path;
  const target_path = 'upload/' + req.file.originalname;

  console.log(tmp_path);
  console.log(target_path);

  const src = fs.createReadStream(tmp_path);
  const dest = fs.createWriteStream(target_path);
  src.pipe(dest);

  res.status(200).send('ok');
});
