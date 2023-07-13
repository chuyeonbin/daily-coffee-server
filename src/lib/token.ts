import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || '';

export const generateToken = async (
  payload: string | object | Buffer,
  options: SignOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET_KEY, options, (error, encoded) => {
      if (error) reject(encoded);
      if (encoded) resolve(encoded);
    });
  });
};
