/* eslint-disable no-underscore-dangle */
import { createElement } from '../utils';

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

export default class Price {
  constructor(points) {
    this._element = null;
    this._points = points;
  }

  getTemplate() {
    return createTripPriceTemplate(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
