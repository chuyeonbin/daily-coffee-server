import express from 'express';
import { isLoggedIn } from './middlewares';
import { UserType } from '../database';

const router = express.Router();

router.get('/', isLoggedIn, (req, res, next) => {
  const { email, nickname } = req.user as UserType;

  return res.status(201).json({
    email,
    nickname,
  });
});

router.post('/logout', isLoggedIn, (req, res, next) => {
  // reset Cookie;
  return res.status(204).send('ok');
});

export default router;
