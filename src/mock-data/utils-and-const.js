import dayjs from 'dayjs';

const PointTypes = [
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

const DestinationPoints = [
  'Saint-Petersburg',
  'Lipetsk',
  'Rostov-on-Don',
  'Krasnodar',
  'Sochi',
  'Adler',
  'Moscow',
  'Volgograd',
  'Kazan',
  'Saratov',
  'Samara',
  'Arkhangelsk',
  'Tambov',
];

const Descriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const ExtraOptions = [
  'Prepaid Baggage',
  'Flight insurance',
  'Aeroexpress',
  'Multimodal itineraries',
  'Travel class upgrade',
  'Preselect Seats',
  'A la Carte Menu',
  'Hotel reservation',
  'Car rental',
  'Medical insurance',
  'Transfer with meet & greet',
  'Sightseeing tours',
];

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);
const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];
const generateDate = (daysBefore, daysAFter) => {
  const daysGap = getRandomInteger(-daysBefore, daysAFter);
  const hourGap = getRandomInteger(0, 23);
  const minuteGap = getRandomInteger(0, 60);
  return dayjs()
    .add(daysGap, 'day')
    .add(hourGap, 'hour')
    .add(minuteGap, 'minute')
    .toDate();
};
const isPast = (startTime) => dayjs().isAfter(startTime, 'D');
const isFuture = (startTime) => dayjs().isBefore(startTime, 'D') || dayjs().isSame(startTime, 'D');
const convertDuration = (runtime) => {
  const mins = runtime % 60;
  const hours = (runtime / 60).toFixed(0);
  return `${hours}h ${mins}m`;
};

export const updateItem = (items, changedItem) => {
  const index = items.findIndex((item) => item.id === changedItem.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    changedItem,
    ...items.slice(index + 1),
  ];
};

export {
  PointTypes,
  DestinationPoints,
  Descriptions,
  ExtraOptions,
  getRandomInteger,
  getRandomArrayElement,
  generateDate,
  isPast,
  isFuture,
  convertDuration
};
