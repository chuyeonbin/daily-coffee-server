import express from 'express';
import { isLoggedIn } from './middlewares';
import {
  UserType,
  createDateRecord,
  deleteDateRecordById,
  findUserByEmail,
  seachYearOfMonthDataById,
  updateDateLogById,
} from '../database';
import { format as timeZoneFormat } from 'date-fns-tz';
import { getMonth, getYear } from 'date-fns';

const router = express.Router();

router.get('/:date', isLoggedIn, async (req, res) => {
  const { email } = req.user as UserType;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).send('NOT_FOUND');
    }

    const { id: userId } = user;

    const date = new Date(req.params.date);
    const currentYear = getYear(date);
    const currnentMonth = getMonth(date) + 1;

    const logs = await seachYearOfMonthDataById(
      userId,
      currentYear,
      currnentMonth
    );

    if (!logs) {
      return res.status(404).send('NOT_FOUND');
    }

    const changeTimezoneLogs = logs.map(log => {
      const date = timeZoneFormat(new Date(log.date), 'yyyy-MM-dd HH:mm:ss');
      const createdAt = timeZoneFormat(
        new Date(log.created_at),
        'yyyy-MM-dd HH:mm:ss'
      );
      const updatedAt = timeZoneFormat(
        new Date(log.updated_at),
        'yyyy-MM-dd HH:mm:ss'
      );

      return { ...log, date, created_at: createdAt, updated_at: updatedAt };
    });

    return res.status(200).json({ logs: changeTimezoneLogs });
  } catch (error) {
    console.error(error);
    throw error;
  }
});

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

router.patch('/', isLoggedIn, async (req, res) => {
  const { email } = req.user as UserType;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).send('NOT_FOUND');
    }

    const { id: userId } = user;

    const parseDate = new Date(JSON.parse(req.body.date as string));
    const date = timeZoneFormat(parseDate, 'yyyy-MM-dd HH:mm:ss');

    const { price, cafe, coffee, id } = req.body;

    await updateDateLogById(id, price, cafe, coffee, date, userId);

    return res.status(201).send('UPDATE_DATE_LOG');
  } catch (error) {
    console.error(error);
    throw error;
  }
});

router.delete('/:id', isLoggedIn, async (req, res) => {
  const { email } = req.user as UserType;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).send('NOT_FOUND');
    }

    const id = parseInt(req.params.id);

    await deleteDateRecordById(id);

    return res.status(200).json({ id });
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export default router;
