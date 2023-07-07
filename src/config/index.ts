import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    username: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'daily-coffee',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'daily-coffee',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'daily-coffee',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
