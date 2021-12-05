/* eslint-disable no-underscore-dangle */
import SmartView from './smart';
import { MenuItem } from '../utils/constants';

export default class Button extends SmartView {
  constructor(isDisabled) {
    super();
    this._isDisabled = isDisabled;
    this._markup = `
    <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" id ="${MenuItem.ADD}" ${this._isDisabled ? 'disabled' : ''}>New event</button>`;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return this._markup;
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.onButtonClick(evt.target.id);
  }

  setButtonClickHandler(callback) {
    this._callback.onButtonClick = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }
}
