const moment = require('moment');

const getDate = (divider = '-') => {
  const dateNow = moment().format(`YYYY${divider}MM${divider}DD`);
  return dateNow;
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
  getWeekday,
  isWeekend,
};
