import {
  isPast,
  isFuture
} from './utils-and-const';

const tripPointsToFilterMap = {
  everything: (points) => points,
  future: (points) => points.filter((point) => isFuture(point.startTime)),
  past: (points) => points.filter((point) => isPast(point.startTime)),
};

const setFiltering = (points) => Object.entries(tripPointsToFilterMap).map(
  ([filterName, filterPoints]) => ({
    name: filterName,
    filtredPoinsts: filterPoints(points),
  }),
);

export default setFiltering;
