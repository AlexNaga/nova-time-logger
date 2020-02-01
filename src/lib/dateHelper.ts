import moment from 'moment';

export const getDate = (divider = '-') => {
  const dateNow = moment().format(`YYYY${divider}MM${divider}DD`);
  return dateNow;
};

export const getMonth = () => {
  const monthAsNr = moment().month();
  const month = moment.months(monthAsNr).toLowerCase();
  return month;
};

export const getLastMonth = () => {
  const monthAsNr = (moment().month()) - 1;
  const month = moment.months(monthAsNr).toLowerCase();
  return month;
};

export const getWeekday = () => {
  const weekdayAsNr = moment().weekday();
  const weekday = moment.weekdays(weekdayAsNr).toLowerCase();
  return weekday;
};

export const isWeekend = () => {
  const weekday = getWeekday();

  if (weekday === 'saturday' || weekday === 'sunday') {
    return true;
  }
  return false;
};
