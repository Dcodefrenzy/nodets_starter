import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        JWT_SECRET: string;
        NODE_ENV: 'development' | 'production';
        PORT?: string;
      }
    }
  }