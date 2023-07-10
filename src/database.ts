import { PoolOptions, RowDataPacket, createPool } from 'mysql2';
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

const getConnection = async () => {
  try {
    const conn = await pool.getConnection();
    return conn;
  } catch (error) {
    console.error(error);
    return null;
  }
};

interface UserType extends RowDataPacket {
  id: number;
  email: string;
  nickname: string;
  create_at: Date;
  updated_at: Date;
}

export const findUserByEmail = async (email: string) => {
  let connection = null;
  try {
    connection = await getConnection();

    if (connection) {
      const [user] = await connection.execute<UserType[]>(
        'SELECT * FROM `daily-coffee`.users WHERE `email`=' + `"${email}"`
      );
      return user[0];
    }
  } catch (e) {
    throw e;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export default pool;
