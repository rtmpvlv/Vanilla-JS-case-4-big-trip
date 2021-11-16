/* eslint-disable no-underscore-dangle */

import AbstractView from './abstract';
import SortType from '../utils/constants';

let CHECKED_SORT_TYPE = SortType.DAY;
export default class Sort extends AbstractView {
  constructor() {
    super();
    this._markup = `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <div class="trip-sort__item  trip-sort__item--day">
        <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" ${CHECKED_SORT_TYPE === SortType.DAY ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-day" id="sort-day" data-sort-type="${SortType.DAY}">Day</label>
      </div>
      <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>
      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" ${CHECKED_SORT_TYPE === SortType.TIME ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-time" id="sort-time" data-sort-type="${SortType.TIME}">Time</label>
      </div>
      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" ${CHECKED_SORT_TYPE === SortType.PRICE ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-price" id="sort-price" data-sort-type="${SortType.PRICE}">Price</label>
      </div>
      <div class="trip-sort__item  trip-sort__item--offer">
        <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
      </div>
    </form>
  `;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return this._markup;
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }
    evt.preventDefault();
    CHECKED_SORT_TYPE = evt.target.dataset.sortType;
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
