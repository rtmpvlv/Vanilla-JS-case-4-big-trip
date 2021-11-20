export const sortDate = (point1, point2) => new Date(point1.dateFrom) - new Date(point2.dateFrom);
export const sortPrice = (point1, point2) => point2.basePrice - point1.basePrice;
export const sortDuration = (point1, point2) => point2.duration - point1.duration;
