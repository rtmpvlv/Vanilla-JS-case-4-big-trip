import dayjs from 'dayjs';

import {
  PointTypes,
  DestinationPoints,
  Descriptions,
  ExtraOptions,
  generateDate,
  getRandomArrayElement,
  getRandomInteger
} from './utils-and-const';

const generateDescription = () => {
  const arr = [];
  for (let i = 1; i < getRandomInteger(1, Descriptions.length); i += 1) {
    arr.push(Descriptions[i]);
  }
  return arr.join(' ');
};

const generateLandscapePicsArray = () => {
  const arr = [];
  for (let i = 1; i < getRandomInteger(2, 5); i += 1) {
    arr.push({
      src: `http://picsum.photos/248/152?r${getRandomInteger(1, 100)}`,
      description: generateDescription(),
    });
  }
  return arr;
};

const generateDestionationInfo = () => ({
  description: generateDescription(),
  name: getRandomArrayElement(DestinationPoints),
  pictures: generateLandscapePicsArray(),
});

const generateOffers = () => {
  const arr = [];
  for (let i = 0; i < getRandomInteger(0, 5); i += 1) {
    arr.push({
      title: getRandomArrayElement(ExtraOptions),
      price: getRandomInteger(10, 100),
    });
  }
  return arr;
};

const generateOfferInfo = () => ({
  type: getRandomArrayElement(PointTypes),
  offers: generateOffers(),
});

const getTripPointInfo = () => {
  const dateFrom = generateDate(7, 7);
  const duration = getRandomInteger(30, 720);
  const dateTo = dayjs(dateFrom).add(duration, 'minute');

  return {
    basePrice: getRandomInteger(100, 1000),
    dateFrom,
    dateTo,
    destination: generateDestionationInfo(),
    id: getRandomInteger(1, 100000000),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: generateOfferInfo(),
    type: getRandomArrayElement(PointTypes),
    duration,
  };
};

export default getTripPointInfo;
