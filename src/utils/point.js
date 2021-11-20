import dayjs from 'dayjs';

export const isPast = (startTime) => dayjs().isAfter(startTime, 'D');
export const isFuture = (startTime) => dayjs().isBefore(startTime, 'D') || dayjs().isSame(startTime, 'D');
export const isDateEquial = (date1, date2) => dayjs(date1).isSame(date2);
