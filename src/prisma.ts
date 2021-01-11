import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

import { hashPassword } from '@/lib';

// DBにパスワードを保存するときにデータをハッシュ化
prisma.$use(async (params, next) => {
  if (params.model === 'User') {
    if (params.action === ('create' || 'update')) {
      if (params.args.data.password) {
        const hashedPassword = await hashPassword(params.args.data.password);
        params.args.data.password = hashedPassword;
      }
    }
  }
  return next(params);
});
