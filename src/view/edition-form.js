/* eslint-disable prefer-object-spread */
/* eslint-disable no-underscore-dangle */
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import SmartView from './smart';
import { PointTypes, DestinationPoints } from '../mock-data/utils-and-const';
import { generateOffers, generateDescription, generateLandscapePicsArray } from '../mock-data/mock-data';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const DATE_PICKER_FORMAT = 'd/m/y H:i';

const createEditionFormTemplate = (data) => {
  const {
    basePrice, dateFrom, dateTo, destination, offers, type,
  } = data;

  const date1 = dayjs(dateFrom).format('DD/MM/YY HH:mm');
  const date2 = dayjs(dateTo).format('DD/MM/YY HH:mm');

  const renderExtraOptions = (array) => {
    if (!array || array.length === 0) {
      return '';
    }

    const optionsList = array.map(({ title, price }) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer-${title}">
      <label class="event__offer-label" for="event-offer-${title}-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
      </div>`).join('');

    const optionSection = `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${optionsList}
        </div>
      </section>`;
    return optionSection;
  };

  const renderPhotos = (array) => (array.map((item) => `<img class="event__photo" src="${item.src}" alt="Event photo"></img>`).join(''));

  const createTypeListTemplate = (array) => (array.map((item) => `
      <div class="event__type-item">
        <input id="event-type-${item.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}" ${item === type ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${item.toLowerCase()}" for="event-type-${item.toLowerCase()}-1">${item}</label>
      </div>`).join('')
  );

  const createDestinationCities = (array) => (array.map((item) => `<option value="${item}"></option>`).join(''));

  const repeatingTemplate = createTypeListTemplate(PointTypes);
  const extraOptionsTemplate = renderExtraOptions(offers.offers);
  const photosTemplate = renderPhotos(destination.pictures);
  const destinationList = createDestinationCities(DestinationPoints);

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${repeatingTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
             ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
            ${destinationList}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${date1}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${date2}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${extraOptionsTemplate}

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${photosTemplate}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>
  `;
};

export default class EditionForm extends SmartView {
  constructor(point) {
    super();
    this._data = EditionForm.parseFormToData(point);

    this._dateFromPicker = null;
    this._dateToPicker = null;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._setDateFromDatepicker();
    this._setDateToDatepicker();
    this._setInnerHandlers();
  }

  static parseFormToData(point) {
    return Object.assign({}, point);
  }

  static parseDataToForm(data) {
    return Object.assign({}, data);
  }

  getTemplate() {
    return createEditionFormTemplate(this._data);
  }

  restoreHandlers() {
    this._setDateFromDatepicker();
    this._setDateToDatepicker();
    this._setInnerHandlers();
    this.setEditClickHandler(this._callback.editClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  reset(point) {
    this.updateData(EditionForm.parseFormToData(point));
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('.event--edit').addEventListener('submit', this._formSubmitHandler);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditionForm.parseDataToForm(this._data));
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    if (PointTypes.includes(evt.target.innerText)) {
      this.updateData({
        type: evt.target.innerText,
        offers: {
          type: evt.target.innerText,
          offers: generateOffers(),
        },
      });
    }
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: {
        name: evt.target.value,
        description: generateDescription(),
        pictures: generateLandscapePicsArray(),
      },
    });
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      basePrice: evt.target.value,
    }, true);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('click', this._typeChangeHandler);
    this.getElement()
      .querySelector('#event-destination-1')
      .addEventListener('change', this._destinationChangeHandler);
    this.getElement()
      .querySelector('#event-price-1')
      .addEventListener('change', this._priceChangeHandler);
  }

  _setDateFromDatepicker() {
    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }

    this._dateFromPicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        enableTime: true,
        time_24hr: true,
        dateFormat: DATE_PICKER_FORMAT,
        defaultDate: this._data.dateFrom,
        onChange: this._dateFromChangeHandler,
      },
    );
  }

  _dateFromChangeHandler(userDate) {
    this.updateData({
      dateFrom: userDate,
      duration: dayjs(this._data.dateTo).diff(userDate, 'm'),
    });
  }

  _setDateToDatepicker() {
    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }

    this._dateToPicker = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        enableTime: true,
        time_24hr: true,
        dateFormat: DATE_PICKER_FORMAT,
        defaultDate: this._data.dateTo,
        onChange: this._dateToChangeHandler,
      },
    );
  }

  _dateToChangeHandler(userDate) {
    this.updateData({
      dateTo: userDate,
      duration: dayjs(userDate).diff(this._data.dateFrom, 'm'),
    });
  }
}
