import moment from 'moment';

interface WeekDates {
  monday: 'string';
  tuesday: 'string';
  wednesday: 'string';
  thursday: 'string';
  friday: 'string';
}

export const getDate = ({ divider = '-', days = 0}: { divider?: string, days?: number } = {})  => {
  const dateResult = moment().add(days, 'days').format(`YYYY${divider}MM${divider}DD`);
  return dateResult;
};

export const getDateOfDayThisWeek = ({ divider = '-', day = '' }: { divider?: string, day?: string } = {}) => {
  if (day === 'monday' || day === 'friday') {
    let weekdayAsNr = 1; // default is monday

    if (day === 'friday') weekdayAsNr = 5;

    const dateResult = moment().day(weekdayAsNr).format(`YYYY${divider}MM${divider}DD`);
    return dateResult;
  }
};

export const getDatesOfThisWeek = ( divider = '-'):WeekDates => {
  const dates: any = {};

  // Loop through working week
  for (let weekdayAsNr = 1; weekdayAsNr < 6; weekdayAsNr++) {
    const day = moment().day(weekdayAsNr);
    const dayName = day.format('dddd').toLowerCase();
    const dateFormat = day.format(`YYYY${divider}MM${divider}DD`);
    dates[dayName] = dateFormat;
  }

  return dates as WeekDates;
};

export const getMonthOfDayThisWeek = (day: string) => {
  if (day === 'monday' || day === 'friday') {
    let weekdayAsNr = 1; // default is monday

    if (day === 'friday') weekdayAsNr = 5;

    const month = moment().day(weekdayAsNr).format('MMMM').toLowerCase();
    return month;
  }
};

export const getMonth = (days = 0) => {
  const monthAsNr = moment().add(days, 'days').month();
  const month = moment.months(monthAsNr).toLowerCase();
  return month;
};

export const getLastMonth = (days = 0) => {
  const monthAsNr = (moment().add(days, 'days').month()) - 1;
  const month = moment.months(monthAsNr).toLowerCase();
  return month;
};

export const getWeekday = (days = 0) => {
  const weekdayAsNr = moment().add(days, 'days').weekday();
  const weekday = moment.weekdays(weekdayAsNr).toLowerCase();
  return weekday;
};

export const isWeekend = (days = 0) => {
  const weekday = getWeekday(days);

  if (weekday === 'saturday' || weekday === 'sunday') {
    return true;
  }
  return false;
};
