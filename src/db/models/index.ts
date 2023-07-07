import { Sequelize } from 'sequelize';
import conf from '../config';
import dotenv from 'dotenv';
dotenv.config();

const env = !process.env.NODE_ENV ? 'development' : 'production';
const config = conf[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: 'mysql',
  }
);

export default sequelize;
