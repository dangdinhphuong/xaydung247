import 'express-session';
import { AuthUser } from '../common/types';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
      csrfToken?: () => string;
    }
  }
}

export {};
