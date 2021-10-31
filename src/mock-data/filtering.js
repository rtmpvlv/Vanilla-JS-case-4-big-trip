import {
  isPast,
  isFuture
} from './utils-and-const';

const tripPointsToFilterMap = {
  Everything: (points) => points.length,
  Future: (points) => points.filter((point) => isFuture(point.dateFrom)).length,
  Past: (points) => points.filter((point) => isPast(point.dateFrom)).length,
};

const setFiltering = (points) => Object.entries(tripPointsToFilterMap).map(
  ([filterName, filterPoints]) => ({
    name: filterName,
    filtredPoints: filterPoints(points),
  }),
);

export default setFiltering;
