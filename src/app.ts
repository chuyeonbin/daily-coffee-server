import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import passport from 'passport';
import passportConfig from './passport/jwt';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
passportConfig();

app.use('/auth', authRouter);
app.use('/user', userRouter);

app.listen('8080', () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: 8080🛡️
  ################################################
`);
});
