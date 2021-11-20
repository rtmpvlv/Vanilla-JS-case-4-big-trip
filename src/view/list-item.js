/* eslint-disable no-underscore-dangle */
import he from 'he';
import dayjs from 'dayjs';
import { convertDuration } from '../mock-data/utils-and-const';
import AbstractView from './abstract';

const createTripItemTemplate = (tripPoint) => {
  const {
    basePrice, dateFrom, dateTo, destination, isFavorite, offers, type, duration,
  } = tripPoint;

  const renderExtraOptions = (array) => {
    if (!array || array.length === 0) {
      return '';
    }
    return array.map((item) => `
    <li class="event__offer">
      <span class="event__offer-title">${item.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${item.price}</span>
    </li>`).join('');
  };

  const extraOptionsTemplate = renderExtraOptions(offers.offers);

  return `
      <li class="trip-events__item">
        <div class="event">
          <time class="event__date">${dayjs(dateFrom).format('MMM D')}</time>
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${type} ${he.encode(destination.name)}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time">${dayjs(dateFrom).format('H:mm')}</time>
              &mdash;
              <time class="event__end-time">${dayjs(dateTo).format('H:mm')}</time>
            </p>
            <p class="event__duration">${convertDuration(duration)}</p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
          </p>
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${extraOptionsTemplate}
          </ul>
          <button class="event__favorite-btn event__favorite-btn${isFavorite ? '--active' : ''}" type="button">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>`;
};

export default class ListItem extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createTripItemTemplate(this._points);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
