import { JwtUser } from 'src/common/types/auth.type';

declare module 'express' {
  interface Request {
    user?: JwtUser;
  }
}
