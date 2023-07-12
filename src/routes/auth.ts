import express from 'express';
import { findUserByEmail, upsertEmailAuth } from '../database';
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
        html: '<b>Hello world?</b>',
      });
    } catch (err) {
      throw err;
    } finally {
      mailer.closeMail();
    }
  } catch (err) {
    res.status(400).json('fail');
    throw err;
  }

  res.status(200).json('ok');
});

export default router;
