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


export const showVotes = catchAsyncErrors(async (req, res, next) => {
  const resObj = {
    1: {
      id: '8',
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
