const moment = require('moment');

const getDate = (divider = '-') => {
  const dateNow = moment().format(`YYYY${divider}MM${divider}DD`);
  return dateNow;
};

const getMonth = () => {
  const monthAsNr = moment().month();
  const month = moment.months(monthAsNr).toLowerCase();
  return month;
};

const getLastMonth = () => {
  const monthAsNr = (moment().month()) - 1;
  const month = moment.months(monthAsNr).toLowerCase();
  return month;
};

const getWeekday = () => {
  const weekdayAsNr = moment().weekday();
  const weekday = moment.weekdays(weekdayAsNr).toLowerCase();
  return weekday;
};

const isWeekend = () => {
  const weekday = getWeekday();

  if (weekday === 'saturday' || weekday === 'sunday') {
    return true;
  }
  return false;
};

module.exports = {
  getDate,
  getMonth,
  getLastMonth,
  getWeekday,
  isWeekend,
};
