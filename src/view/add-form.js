/* eslint-disable prefer-object-spread */
/* eslint-disable no-underscore-dangle */
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import SmartView from './smart';
import { PointTypes } from '../mock-data/utils-and-const';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const DATE_PICKER_FORMAT = 'd/m/y H:i';

const createAdditionFormTemplate = (offersList, destinationsList, data) => {
  const {
    basePrice, destination, offers, type, dateFrom, dateTo,
  } = data;

  const renderExtraOptions = (list, currentOffers) => {
    if (!currentOffers || currentOffers.length === 0) {
      return '<section class="event__section  event__section--offers"></section>';
    }
    const possibleOffers = list
      .find((element) => element.type === type.toLowerCase()).offers;

    if (!possibleOffers || possibleOffers.length === 0) {
      return '<section class="event__section  event__section--offers"></section>';
    }

    const optionsList = possibleOffers.map(({ title, price }) => `
      <div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="event-offer-${title}-1" type="checkbox"
          name="event-offer-${title}" value="${title}"
          ${currentOffers.some((offer) => offer.title === title) ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${title}-1">
          <span class="event__offer-title">${title}</span>offer
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

  const renderPictures = (point, list) => {
    let pictures = null;
    list.forEach((item) => {
      if (item.name === point.name) {
        pictures = item.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="Event photo"></img>`).join('');
      }
    });
    return pictures;
  };

  const createTypeListTemplate = (array) => (
    array.map((item) => `
      <div class="event__type-item">
        <input id="event-type-${item.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}" ${item === type ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${item.toLowerCase()}" for="event-type-${item.toLowerCase()}-1">${item}</label>
      </div>`).join('')
  );

  const createDestinationCities = (array) => (array.map((item) => `<option value="${item.name}"></option>`).join(''));

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
                ${createTypeListTemplate(PointTypes)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${createDestinationCities(destinationsList)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
          ${renderExtraOptions(offersList, offers)}
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${renderPictures(destination, destinationsList)}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`;
};

export default class AdditionForm extends SmartView {
  constructor(offersModel, destinationsModel) {
    super();
    this._offersModel = offersModel;
    this._offers = this._offersModel.getOffers();
    this._destinationsModel = destinationsModel;
    this._destinationsList = this._destinationsModel.getDestinations();
    this._newPointDefaultInfo = {
      basePrice: 0,
      destination: {
        description: this._destinationsList[0].description,
        name: this._destinationsList[0].name,
        pictures: this._destinationsList[0].pictures,
      },
      offers: this._offers[0].offers,
      type: this._offers[0].type,
      dateFrom: new Date(),
      dateTo: new Date(),
    };
    this._data = AdditionForm.parseFormToData(this._newPointDefaultInfo);

    this._dateFromPicker = null;
    this._dateToPicker = null;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);

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
    return createAdditionFormTemplate(this._offers, this._destinationsList, this._data);
  }

  removeElement() {
    super.removeElement();

    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }

    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }
  }

  restoreHandlers() {
    this._setDateFromDatepicker();
    this._setDateToDatepicker();
    this._setInnerHandlers();
    this.setEditClickHandler(this._callback.editClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  reset(point) {
    this.updateData(AdditionForm.parseFormToData(point));
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._editClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(AdditionForm.parseDataToForm(this._data));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(AdditionForm.parseDataToForm(this._data));
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    if (PointTypes.includes(evt.target.innerText)) {
      try {
        this.updateData({
          type: evt.target.innerText,
          offers: this._offers
            .find((offer) => offer.type === evt.target.innerText.toLowerCase()).offers,
        });
      } catch (e) {
        this.updateData({
          type: evt.target.innerText,
          offers: [],
        });
      }
    }
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: {
        name: evt.target.value,
        description: this._destinationsList
          .find((city) => city.name === evt.target.value).description,
        pictures: this._destinationsList
          .find((city) => city.name === evt.target.value).pictures,
      },
    });
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      basePrice: Number(evt.target.value),
    }, true);
  }

  _offerChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    const pickedOffer = evt.target.value;
    const index = this._data.offers.findIndex((offer) => offer.title === pickedOffer);
    if (index < 0) {
      const availableOffers = this._offers.find((offer) => offer.type === this._data.type).offers;
      const newOffer = availableOffers.find((offer) => offer.title === pickedOffer);
      this.updateData({
        offers: [newOffer, ...this._data.offers],
      }, true);
      return;
    }
    this.updateData({
      offers: [
        ...this._data.offers.slice(0, index),
        ...this._data.offers.slice(index + 1),
      ],
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
    this.getElement()
      .querySelector('.event__section--offers')
      .addEventListener('change', this._offerChangeHandler);
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
