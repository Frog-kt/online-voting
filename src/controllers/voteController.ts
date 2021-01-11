import { prisma } from '@/prisma';
import Joi, { number } from 'joi';

import ErrorHandler from '../utils/ErrorHandler';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import { sendJwtToken, getJwtToken } from '../utils/jwt';
import config from '../config';



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
