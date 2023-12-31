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
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export interface UserType extends RowDataPacket {
  id: number;
  email: string;
  nickname: string;
  create_at: Date;
  updated_at: Date;
}

interface EmailAuthType extends RowDataPacket {
  id: number;
  email: string;
  code: string;
  logged: boolean;
  create_at: Date;
  updated_at: Date;
}

interface DateRecordType extends RowDataPacket {
  id: number;
  date: string;
  cafe: string;
  coffee: string;
  price: number;
  create_at: string;
  updated_at: string;
}

export const findUserById = async (id: number) => {
  let connection = null;
  try {
    connection = await getConnection();

    if (connection) {
      const [user] = await connection.execute<UserType[]>(
        'SELECT * FROM `daily-coffee`.users WHERE `id`=' + `"${id}"`
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

export const upsertEmailAuth = async (email: string, code: string) => {
  let connection = null;

  try {
    connection = await getConnection();

    if (connection) {
      await connection.execute(
        'INSERT INTO `daily-coffee`.email_auth (email, code, logged) VALUES ' +
          `("${email}", "${code}", FALSE) ` +
          'ON DUPLICATE KEY UPDATE email=' +
          `"${email}", code="${code}", logged=FALSE`
      );
    }
  } catch (e) {
    throw e;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const updateEmailAuthByLogged = async (email: string) => {
  let connection = null;

  try {
    connection = await getConnection();

    if (connection) {
      await connection.execute(
        'UPDATE `daily-coffee`.email_auth SET logged=TRUE WHERE ' +
          `email="${email}"`
      );
    }
  } catch (e) {
    throw e;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const findEmailAuthByCode = async (code: string) => {
  let connection = null;
  try {
    connection = await getConnection();

    if (connection) {
      const [emailAuth] = await connection.execute<EmailAuthType[]>(
        'SELECT * FROM `daily-coffee`.email_auth WHERE `code`=' + `"${code}"`
      );
      return emailAuth[0];
    }
  } catch (e) {
    throw e;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const findUserByNickname = async (nickname: string) => {
  let connection = null;
  try {
    connection = await getConnection();

    if (connection) {
      const [user] = await connection.execute<UserType[]>(
        'SELECT * FROM `daily-coffee`.users WHERE `nickname`=' + `"${nickname}"`
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

export const createUser = async (email: string, nickname: string) => {
  let connection = null;
  try {
    connection = await getConnection();

    if (connection) {
      await connection.execute(
        'INSERT INTO `daily-coffee`.users (email, nickname) VALUES ' +
          `("${email}", "${nickname}")`
      );
    }
  } catch (e) {
    throw e;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const createDateRecord = async (
  price: number,
  cafe: string,
  coffee: string,
  date: string,
  userId: number
) => {
  let connection = null;
  try {
    connection = await getConnection();

    if (connection) {
      await connection.execute(
        'INSERT INTO `daily-coffee`.date_record (price, cafe, coffee, date, user_id) VALUES ' +
          `("${price}", "${cafe}", "${coffee}", "${date}", "${userId}")`
      );
    }
  } catch (e) {
    throw e;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const seachYearOfMonthDataById = async (
  id: number,
  year: number,
  month: number
) => {
  let connection = null;
  try {
    connection = await getConnection();

    if (connection) {
      const [field] = await connection.execute<DateRecordType[]>(
        'SELECT * FROM `daily-coffee`.date_record WHERE user_id=' +
          `${id}` +
          ' AND YEAR(date) = ' +
          `${year}` +
          ' AND MONTH(date) = ' +
          `${month}` +
          ' ORDER BY date'
      );
      return field;
    }
  } catch (e) {
    throw e;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const updateDateLogById = async (
  id: number,
  price: number,
  cafe: string,
  coffee: string,
  date: string,
  userId: number
) => {
  let connection = null;
  try {
    connection = await getConnection();

    if (connection) {
      await connection.execute<DateRecordType[]>(
        'UPDATE `daily-coffee`.date_record SET ' +
          `date="${date}", ` +
          `cafe="${cafe}", ` +
          `coffee="${coffee}", ` +
          `price= ${price} ` +
          'WHERE ' +
          `id=${id} AND user_id=${userId}`
      );
    }
  } catch (e) {
    throw e;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const deleteDateRecordById = async (id: number) => {
  let connection = null;
  try {
    connection = await getConnection();

    if (connection) {
      await connection.execute(
        'DELETE FROM `daily-coffee`.date_record WHERE id=' + `${id}`
      );
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
