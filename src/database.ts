import { PoolConnection, PoolOptions, createPool } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: PoolOptions = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT as unknown as number,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MTSQL_DATABASE,
  connectionLimit: 30,
};

const pool = createPool(dbConfig).promise();

export default pool;
