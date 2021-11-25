export const sortDate = (point1, point2) => new Date(point1.dateFrom) - new Date(point2.dateFrom);
export const sortDateTo = (point1, point2) => new Date(point2.dateTo) - new Date(point1.dateTo);
export const sortPrice = (point1, point2) => point2.basePrice - point1.basePrice;
export const sortDuration = (point1, point2) => point2.duration - point1.duration;
export const sortTypesForCosts = (points) => {
  const types = Array.from(new Set(points.map((point) => point.type)));
  const sortedPoints = types
    .map((type) => points.filter((point) => point.type === type))
    .map((elements) => elements.reduce((sum, current) => sum + current.basePrice, 0))
    .sort((a, b) => b - a);
  return [
    types,
    sortedPoints,
  ];
};
export const sortPointsForTypes = (points) => {
  const types = Array.from(new Set(points.map((point) => point.type)));
  const sortedPoints = types
    .map((type) => points.filter((point) => point.type === type))
    .map((element) => element.length)
    .sort((a, b) => b - a);
  return [
    types,
    sortedPoints,
  ];
};

export const sortTypesForDuration = (points) => {
  const types = Array.from(new Set(points.map((point) => point.type)));
  const sortedPoints = types
    .map((type) => points.filter((point) => point.type === type))
    .map((elements) => elements.reduce((sum, current) => sum + current.duration, 0))
    .sort((a, b) => b - a);
  return [
    types,
    sortedPoints,
  ];
};
