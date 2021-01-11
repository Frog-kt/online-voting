import { prisma } from '@/prisma';
import Joi from 'joi';

import ErrorHandler from '../utils/ErrorHandler';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import { sendJwtToken, getJwtToken } from '../utils/jwt';
import { matchPassword } from '@/lib';
import config from '../config';
import Role from '../utils/role';

interface NewAccountArgs {
  name: string;
  email: string;
  password: string;
}

interface LoginArgs {
  email: string;
  password: string;
}

// *新規アカウント登録
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
    return next(new ErrorHandler(err, 401));
  }

  sendJwtToken({ id: saveUser.id, role: [Role.USER] }, 200, res);
});

// *ログイン
export const login = catchAsyncErrors(async (req, res, next) => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(255).required(),
  });

  let request;
  try {
    request = await loginSchema.validateAsync(req.body);
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }

  const { email, password } = request as LoginArgs;

  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
  } catch (err) {
    return next(new ErrorHandler(err, 401));
  }

  if (!(await matchPassword(password, user.password))) {
    return next(new ErrorHandler('Invalid Email or Password.', 401));
  }
  console.log(user);

  sendJwtToken({ id: user.id, role: [Role.USER] }, 200, res);
});
