import express from 'express';
import sequelize from '../src/models';
import cors from 'cors';
import authRouter from './routes/auth';

const app = express();

app.use(
  cors({
    origin: true,
  })
);

sequelize
  .authenticate()
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch(console.error);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);

app.listen('8080', () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: 8080🛡️
  ################################################
`);
});
