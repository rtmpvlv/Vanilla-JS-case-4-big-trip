/* eslint-disable no-underscore-dangle */
import AbstractView from './abstract';

const calcTotalPrice = (array) => {
  let sum = 0;
  array.forEach((element) => {
    sum += element.basePrice;
  });
  return sum;
};

const createTripPriceTemplate = (points) => (`
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${calcTotalPrice(points)}</span>
      </p>`
);

export default class TotalCost extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripPriceTemplate(this._points);
  }
}
