import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: true,
});

export default function sendEmail(email: string) {
  return transporter.sendMail({
    from: `"verify@daily-coffee.io" ${process.env.EMAIL_USER}`,
    to: email,
    subject: 'daily coffee 로그인',
    text: '노드 패키지 nodemailer를 이용해 보낸 이메일임',
    html: '<b>Hello world?</b>',
  });
}
