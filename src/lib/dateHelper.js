const moment = require('moment');

const getDate = () => {
  const dateNow = moment().format('YYYY-MM-DD');
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
  } else {
    return false;
  }
};

module.exports = {
  getDate,
  getWeekday,
  isWeekend,
};
