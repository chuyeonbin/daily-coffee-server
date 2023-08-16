import express from 'express';
import { isLoggedIn } from './middlewares';
import { UserType, createDateRecord, findUserByEmail } from '../database';
import { format as timeZoneFormat } from 'date-fns-tz';

const router = express.Router();

router.post('/', isLoggedIn, async (req, res) => {
  const { email } = req.user as UserType;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).send('NOT_FOUND');
    }

    const { id: userId } = user;

    const parseDate = new Date(JSON.parse(req.body.date as string));
    const date = timeZoneFormat(parseDate, 'yyyy-MM-dd HH:mm:ss');

    const { price, cafe, coffee } = req.body;
    await createDateRecord(price, cafe, coffee, date, userId);

    return res.status(201).send('CREATE_DATE_LOG');
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export default router;
