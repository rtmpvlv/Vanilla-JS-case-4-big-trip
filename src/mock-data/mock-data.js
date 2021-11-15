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

export const generateDescription = () => {
  const arr = [];
  for (let i = 1; i < getRandomInteger(1, Descriptions.length); i += 1) {
    arr.push(Descriptions[i]);
  }
  return arr.join(' ');
};

export const generateLandscapePicsArray = () => {
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

export const generateOffers = () => {
  const arr = [];
  for (let i = 0; i < getRandomInteger(0, 5); i += 1) {
    arr.push({
      title: getRandomArrayElement(ExtraOptions),
      price: getRandomInteger(10, 100),
    });
  }
  return arr;
};

export const getTripPointInfo = () => {
  const dateFrom = generateDate(7, 7);
  const dateTo = generateDate(0, 10);
  const duration = dayjs(dateTo).diff(dateFrom, 'm');
  const type = getRandomArrayElement(PointTypes);

  const generateOfferInfo = () => ({
    type,
    offers: generateOffers(),
  });

  return {
    basePrice: getRandomInteger(100, 1000),
    dateFrom,
    dateTo,
    destination: generateDestionationInfo(),
    id: getRandomInteger(1, 100000000),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: generateOfferInfo(),
    type,
    duration,
  };
};
