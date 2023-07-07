import express from 'express';
import getConnection from '../database';
import sendEmail, { transporter } from '../lib/mail';

const router = express.Router();

router.post('/sendemail', async (req, res) => {
  const email: string = req.body.email;

  try {
    const info = await sendEmail(email);

    console.log(info);
    transporter.close();
  } catch (err) {
    res.status(400).json('fail');
    throw err;
  }

  res.status(200).json('ok');
});

export default router;
