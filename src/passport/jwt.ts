import passport from 'passport';
import {
  ExtractJwt,
  Strategy as JWTStrategy,
  VerifiedCallback,
} from 'passport-jwt';
import dotenv from 'dotenv';
import { findUserById } from '../database';
import { JwtPayload } from 'jsonwebtoken';
dotenv.config();

const JWTOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

const JWTVerify = async (jwtPayload: JwtPayload, done: VerifiedCallback) => {
  try {
    if (jwtPayload.sub !== 'access_token') {
      return done(null, false, { reason: '올바르지 않은 인증정보 입니다.' });
    }

    const user = await findUserById(jwtPayload.user_id);

    if (user) {
      return done(null, user);
    }

    return done(null, false, { reason: '존재하지 않는 유저입니다.' });
  } catch (error) {
    console.error(error);
    done(error, false);
  }
};

export default () => {
  passport.use('jwt', new JWTStrategy(JWTOptions, JWTVerify));
};
