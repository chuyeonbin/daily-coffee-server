import express from 'express';
import {
  createUser,
  findEmailAuthByCode,
  findUserByEmail,
  findUserByNickname,
  updateEmailAuthByLogged,
  upsertEmailAuth,
} from '../database';
import mailer from '../lib/mail';
import { nanoid } from 'nanoid';
import { generateToken } from '../lib/token';

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
        html: `<a href="http://localhost:3000/${
          user ? 'email-login' : 'register'
        }?code=${code}" style="text-decoration: none; width: 400px; text-align:center; display:block; margin: 0 auto; margin-top: 1rem; background: #8b95a1; padding-top: 1rem; color: white; font-size: 1.25rem; padding-bottom: 1rem; font-weight: 600; border-radius: 4px;">계속하기</a>
  
        <div style="text-align: center; margin-top: 1rem; color: #868e96; font-size: 0.85rem;"><div>위 버튼을 클릭하시거나, 다음 링크를 열으세요: <br/> <a style="color: #8b95a1;" href="http://localhost:3000/${
          user ? 'email-login' : 'register'
        }?code=${code}">http://localhost:3000/${
          user ? 'email-login' : 'register'
        }?code=${code}</a></div><br/><div>이 링크는 1시간동안 유효합니다. </div></div>`,
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

    if (!emailAuth) {
      return res.status(404).send('NOT_FOUND');
    }

    if (emailAuth.logged) {
      return res.status(403).send('TOKEN_ALREADY_USED');
    }

    if (
      (new Date().getTime() - emailAuth.updated_at.getTime()) / (60 * 1000) >
      60
    ) {
      return res.status(403).send('EXPIRED_CODE');
    }

    const user = await findUserByEmail(emailAuth.email);

    if (!user) {
      return res.status(200).json({ email: emailAuth.email });
    } else {
      const accessToken = await generateToken(
        { user_id: user.id },
        { expiresIn: '24m', subject: 'access_token' }
      );

      await updateEmailAuthByLogged(user.email);

      return res.status(200).json({
        user: {
          email: user.email,
          nickname: user.nickname,
        },
        access_token: accessToken,
      });
    }
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

router.post('/register', async (req, res) => {
  const email: string = req.body.email;
  const nickname: string = req.body.nickname;
  try {
    await createUser(email, nickname);

    const user = await findUserByEmail(email);

    if (user) {
      const accessToken = await generateToken(
        { user_id: user.id },
        { expiresIn: '24m', subject: 'access_token' }
      );

      await updateEmailAuthByLogged(user.email);

      res.status(201).json({
        user: {
          email: user.email,
          nickname: user.nickname,
        },
        access_token: accessToken,
      });
    }
  } catch (err) {
    throw err;
  }
});

export default router;
