import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import getConnection from './database';

const app = express();

app.use(
  cors({
    origin: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);

app.listen('8080', () => {
  // getConnection(connection => {
  //   connection.query('SELECT * FROM `daily-coffee` .users', (error, result) => {
  //     if (error) throw error;
  //     console.log(result);

  //     connection.release();
  //   });
  // });

  console.log(`
  ################################################
  🛡️  Server listening on port: 8080🛡️
  ################################################
`);
});
