import moment from 'moment';

interface Day {
  name: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  date: string;
  month: string;
}

interface WeekDays {
  monday: Day;
  tuesday: Day;
  wednesday: Day;
  thursday: Day;
  friday: Day;
}

export const getDate = ({ divider = '-', days = 0}: { divider?: string, days?: number } = {})  => {
  const dateResult = moment().add(days, 'days').format(`YYYY${divider}MM${divider}DD`);
  return dateResult;
};

export const getDaysOfThisWeek = (divider = '-'): WeekDays => {
  const days: any = {};

  // Loop through working week
  for (let weekdayAsNr = 1; weekdayAsNr < 6; weekdayAsNr++) {
    const day = moment().day(weekdayAsNr);
    const name = day.format('dddd').toLowerCase();
    const month = day.format('MMMM').toLowerCase();
    const date = day.format(`YYYY${divider}MM${divider}DD`);
    days[name] = { name, date, month };
  }
  return days;
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
