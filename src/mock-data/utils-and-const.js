import dayjs from 'dayjs';

const pointTypes = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Transport',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);
const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];
const isPast = (startTime) => dayjs().isAfter(startTime, 'D');
const isFuture = (startTime) => dayjs().isBefore(startTime, 'D') || dayjs().isSame(startTime, 'D');

export {
  pointTypes,
  getRandomInteger,
  getRandomArrayElement,
  isPast,
  isFuture
};
