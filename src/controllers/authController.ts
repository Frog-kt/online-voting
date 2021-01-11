import { RequestHandler, Response } from 'express';
import { prisma } from '@/prisma';
import { hashPassword, matchPassword, sendTokenResponse } from '@/lib';
import Joi from 'joi';

import ErrorHandler from '../utils/ErrorHandler';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import { sendJwtToken, getJwtToken } from '../utils/jwt';
import { matchPassword } from '@/lib';
import config from '../config';
// import { ModelUser } from '@/db.types';

interface NewAccountArgs {
  name: string;
  email: string;
  password: string;
}

interface LoginArgs {
  email: string;
  password: string;
}

export const signup = catchAsyncErrors(async (req, res, next) => {
  const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(3).max(32).required(),
    password: Joi.string().min(8).max(255).required(),
  });

  let request;
  try {
    request = await signupSchema.validateAsync(req.body);
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }

  const { name, email, password } = request as NewAccountArgs;

  let saveUser;
  try {
    saveUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }

  console.log(saveUser.id);

  await sendTokenResponse(saveUser.id, res);
});
