/* eslint-disable no-underscore-dangle */
import { createElement } from '../utils';

export default class Menu {
  constructor() {
    this._element = null;
    this._markup = `
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>
  `;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._markup);
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
