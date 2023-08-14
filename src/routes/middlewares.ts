import { RequestHandler } from 'express';
import passport from 'passport';
import { UserType } from '../database';

export const isLoggedIn: RequestHandler = (req, res, next) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (error: any, user: UserType, info: { reason: string }) => {
      if (error) {
        console.error(error);
        next(error);
      }

      if (info) {
        return res.status(401).send(info.reason);
      }

      req.user = user;
      next();
    }
  )(req, res, next);
};
