/* eslint-disable no-underscore-dangle */
import dayjs from 'dayjs';
import { sortDate, sortDateTo } from '../utils/sort-utils';
import AbstractView from './abstract';

const renderTripPoints = (array) => {
  const uniquePoint = new Set(array.map(({ destination }) => destination.name));
  return Array.from(uniquePoint).join('&nbsp;&mdash;&nbsp;');
};

const renderDateInformation = ((array) => {
  const earliestDateFrom = array.sort(sortDate)[0];
  const latestDateTo = array.sort(sortDateTo)[0];
  return `${dayjs(earliestDateFrom.dateFrom).format('DD MMM')}&nbsp;&mdash;&nbsp;${dayjs(latestDateTo.dateTo).format('DD MMM')}`;
});

const calcTotalPrice = (array) => {
  let sum = 0;
  array.forEach((element) => {
    sum += element.basePrice;
  });
  return sum;
};

const createTripInformationTemplate = (points) => (`
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${renderTripPoints(points)}</h1>
        <p class="trip-info__dates">${renderDateInformation(points)}</p>
      </div>
      <p class="trip-info__cost">Total: &euro;&nbsp;<span class="trip-info__cost-value">${calcTotalPrice(points)}</span></p>
    </section>`
);

export default class Information extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInformationTemplate(this._points);
  }
}
