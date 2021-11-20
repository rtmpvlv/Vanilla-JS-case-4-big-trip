import { isPast, isFuture } from './point';
import { FilterType } from './constants';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuture(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => isPast(point.dateFrom)),
};

export default filter;
