import express from 'express';
import {
  findEmailAuthByCode,
  findUserByEmail,
  findUserByNickname,
  upsertEmailAuth,
} from '../database';
import mailer from '../lib/mail';
import { nanoid } from 'nanoid';

const router = express.Router();

router.post('/sendemail', async (req, res) => {
  const email: string = req.body.email;

  try {
    const user = await findUserByEmail(email);

    const code = nanoid(16);
    await upsertEmailAuth(email, code);

    try {
      await mailer.sendEmail({
        from: `"verify@daily-coffee.io" ${process.env.EMAIL_USER}`,
        to: email,
        subject: 'daily coffee 로그인',
        text: '노드 패키지 nodemailer를 이용해 보낸 이메일임',
        html: `<b>Hello world?</b><br /><a href=""/>`,
      });
    } catch (err) {
      throw err;
    } finally {
      mailer.closeMail();
    }
  } catch (err) {
    res.status(400).send('fail');
    throw err;
  }

  res.status(201).send('ok');
});

router.get('/code/:code', async (req, res) => {
  const code = req.params.code;

  try {
    const emailAuth = await findEmailAuthByCode(code);

    if (!emailAuth || emailAuth.logged) {
      return res.status(201).json({ checked: false });
    }

    if (
      (new Date().getTime() - emailAuth.updated_at.getTime()) / (60 * 1000) >
      60
    ) {
      return res.status(201).json({ checked: false });
    }

    const user = await findUserByEmail(emailAuth.email);

    if (!user) {
      return res.status(201).json({ checked: true });
    } else {
      // 유저정보랑 jwt token 넘겨주기
    }

    res.status(500).json(null);
  } catch (err) {
    throw err;
  }
});

router.post('/duplicate', async (req, res) => {
  const nickname = req.body.nickname;
  try {
    const user = await findUserByNickname(nickname);

    if (!user) {
      return res.status(201).json({ checked: true });
    }
    return res.status(201).json({ checked: false });
  } catch (err) {
    throw err;
  }
});

export default router;
