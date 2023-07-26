import express from 'express';
import passport from 'passport';
import { UserType } from '../database';

const router = express.Router();

router.get('/', (req, res, next) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (error: any, user: UserType, info: any) => {
      if (error) {
        console.error(error);
        return next(error);
      }

      if (info) {
        return res.status(401).send(info.reason);
      }

      return res.status(201).json({
        email: user.email,
        nickname: user.nickname,
      });
    }
  )(req, res, next);
});

export default router;
