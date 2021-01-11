import { Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import Role from './role';

type TRole<T> = [T, ...T[]];

/**
 * JWTトークンの作成
 * @param userId
 * @param userRole
 */
export const getJwtToken = (userId: string, userRole: TRole<string>): string => {
  return jwt.sign(
    {
      id: userId,
      role: userRole,
    },
    config.jwt.secret,
    {
      algorithm: 'HS256',
      expiresIn: config.jwt.expires,
    },
  );
};

/**
 * TokenをCookieとresponseに送信
 * @param user
 * @param statusCode
 * @param res
 */
export const sendJwtToken = (user: { id: string; role: TRole<string> }, statusCode: number, res: Response): void => {
  // JWT Tokenの作成
  const token = getJwtToken(user.id, user.role);

  // Cookieの設定
  const options = {
    expires: new Date(Date.now() + config.cookie.expires * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};
