import dayjs from 'dayjs';

export const sortDate = (point1, point2) => new Date(point1.dateFrom) - new Date(point2.dateFrom);
export const sortDateTo = (point1, point2) => new Date(point2.dateTo) - new Date(point1.dateTo);
export const sortPrice = (point1, point2) => point2.basePrice - point1.basePrice;
export const sortDuration = (point1, point2) => dayjs(point2.dateTo).diff(point2.dateFrom, 'm') - dayjs(point1.dateTo).diff(point1.dateFrom, 'm');

export const sortTypesForCosts = (points) => {
  let types = Array.from(new Set(points.map((point) => point.type)));
  let sortedPoints = types
    .map((type) => points.filter((point) => point.type === type))
    .map((elements) => elements.reduce((sum, current) => sum + current.basePrice, 0));

  const arr = [];
  for (let i = 0; i < types.length; i += 1) {
    arr.push([types[i], sortedPoints[i]]);
  }

  arr.sort((a, b) => b[1] - a[1]);
  types = arr.map((item) => item[0].toUpperCase());
  sortedPoints = arr.map((item) => item[1]);

  return [
    types,
    sortedPoints,
  ];
};

export const sortPointsForTypes = (points) => {
  let types = Array.from(new Set(points.map((point) => point.type)));
  let sortedPoints = types
    .map((type) => points.filter((point) => point.type === type))
    .map((element) => element.length);

  const arr = [];
  for (let i = 0; i < types.length; i += 1) {
    arr.push([types[i], sortedPoints[i]]);
  }

  arr.sort((a, b) => b[1] - a[1]);
  types = arr.map((item) => item[0].toUpperCase());
  sortedPoints = arr.map((item) => item[1]);

  return [
    types,
    sortedPoints,
  ];
};

export const sortTypesForDuration = (points) => {
  let types = Array.from(new Set(points.map((point) => point.type)));
  let sortedPoints = types
    .map((type) => points.filter((point) => point.type === type))
    .map((elements) => elements.reduce((sum, current) => sum + dayjs(current.dateTo).diff(current.dateFrom, 'm'), 0));

  const arr = [];
  for (let i = 0; i < types.length; i += 1) {
    arr.push([types[i], sortedPoints[i]]);
  }

  arr.sort((a, b) => b[1] - a[1]);
  types = arr.map((item) => item[0].toUpperCase());
  sortedPoints = arr.map((item) => item[1]);

  return [
    types,
    sortedPoints,
  ];
};
