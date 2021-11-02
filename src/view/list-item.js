/* eslint-disable no-underscore-dangle */
import dayjs from 'dayjs';
import { convertDuration } from '../mock-data/utils-and-const';
import { createElement } from '../utils';

const createTripItemTemplate = (tripPoint) => {
  const {
    basePrice, dateFrom, dateTo, destination, isFavorite, offers, type, duration,
  } = tripPoint;

  const tripDate = dayjs(dateFrom).format('MMM D');
  const time1 = dayjs(dateFrom).format('H:mm');
  const time2 = dayjs(dateTo).format('H:mm');

  const renderExtraOptions = (array) => {
    if (!array || array.length === 0) {
      return '';
    }
    return `
    <li class="event__offer">
      <span class="event__offer-title">${array[0].title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${array[0].price}</span>
    </li>`;
  };

  const convertedDuration = convertDuration(duration);
  const extraOptionsTemplate = renderExtraOptions(offers.offers);

  return `
      <li class="trip-events__item">
        <div class="event">
          <time class="event__date">${tripDate}</time>
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${type} ${destination.name}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time">${time1}</time>
              &mdash;
              <time class="event__end-time">${time2}</time>
            </p>
            <p class="event__duration">${convertedDuration}</p>
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
      </li>
    `;
};

export default class ListItem {
  constructor(points) {
    this._element = null;
    this._points = points;
  }

  getTemplate() {
    return createTripItemTemplate(this._points);
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
