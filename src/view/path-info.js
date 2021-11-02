/* eslint-disable no-underscore-dangle */
import dayjs from 'dayjs';
import { createElement } from '../utils';

const renderTripPoints = (array) => {
  const uniquePoint = new Set(array.map(({ destination }) => destination.name));
  return Array.from(uniquePoint).join('&nbsp;&mdash;&nbsp;');
};

const renderDataInformation = ((array) => `${dayjs(array[0].dateFrom).format('DD MMM')}&nbsp;&mdash;&nbsp;${dayjs(array[array.length - 1].dateTo).format('DD MMM')}`);

const createTripInformationTemplate = (points) => (`
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
      <h1 class="trip-info__title">${renderTripPoints(points)}</h1>
        <p class="trip-info__dates">${renderDataInformation(points)}</p>
      </div>
    </section>`
);

export default class Information {
  constructor(points) {
    this._element = null;
    this._points = points;
  }

  getTemplate() {
    return createTripInformationTemplate(this._points);
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
