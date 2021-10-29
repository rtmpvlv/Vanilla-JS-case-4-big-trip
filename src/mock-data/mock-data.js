import dayjs from 'dayjs';
import {
  pointTypes,
  getRandomArrayElement,
  getRandomInteger
} from './utils-and-const';

const getLandscapePic = () => {
  const arr = [];
  for (let i = 1; i < getRandomInteger(2, 5); i += 1) {
    arr.push(`http://picsum.photos/248/152?r${getRandomInteger(1, 100)}`);
  }
  return arr;
};

const getPrice = () => getRandomInteger(100, 1000);

const getPointType = () => getRandomArrayElement(pointTypes);

const getDestinationPoint = () => {
  const destinationPoints = [
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
  return getRandomArrayElement(destinationPoints);
};

const getDescriptions = () => {
  const descriptions = [
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
  const arr = [];
  for (let i = 1; i < getRandomInteger(2, descriptions.length); i += 1) {
    arr.push(descriptions[i]);
  }
  return arr.join(' ');
};

const getExtraOptions = (type) => {
  const extraOptions = {
    Taxi: {
      Option1: 1,
      Option2: 2,
      Option3: 3,
      Option4: 4,
      Option5: 5,
    },
    Bus: {
      Option6: 6,
      Option7: 7,
      Option8: 8,
      Option9: 9,
      Option10: 10,
    },
    Train: {
      Option11: 11,
      Option12: 12,
      Option13: 13,
      Option14: 14,
      Option15: 15,
    },
    Ship: {
      Option16: 16,
      Option17: 17,
      Option18: 18,
      Option19: 19,
      Option20: 20,
    },
    Transport: {},
    Drive: {
      Option22: 22,
    },
    Flight: {
      Option23: 23,
    },
    'Check-in': {},
    Sightseeing: {},
    Restaurant: {},
  };
  return extraOptions[type];
};

const generateDate = () => {
  const daysGap = getRandomInteger(-14, 0);
  const hourGap = getRandomInteger(0, 23);
  const minuteGap = getRandomInteger(0, 60);
  return dayjs()
    .add(daysGap, 'day')
    .add(hourGap, 'hour')
    .add(minuteGap, 'minute');
};

const getTripPointInfo = () => {
  const pointType = getPointType();
  const startTime = generateDate();
  const duration = getRandomInteger(30, 720);
  const endTime = startTime.add(duration, 'minute');

  return {
    pointType,
    destinationPoint: getDestinationPoint(),
    destinationPointInfo: getDescriptions(),
    landscape: getLandscapePic(),
    extraOptions: getExtraOptions(pointType),
    startTime: startTime.toDate(),
    duration,
    endTime: endTime.toDate(),
    price: getPrice(),
  };
};

export default getTripPointInfo;
