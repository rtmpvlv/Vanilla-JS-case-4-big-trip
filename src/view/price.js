/* eslint-disable no-underscore-dangle */
import AbstractView from './abstract';

const calcTotalPrice = (array) => {
  let price = 0;
  array.forEach((element) => {
    price += element.basePrice;
  });
  return price;
};

const createTripPriceTemplate = (points) => (
  `
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${calcTotalPrice(points)}</span>
      </p>
  `
);

export default class Price extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripPriceTemplate(this._points);
  }
}
