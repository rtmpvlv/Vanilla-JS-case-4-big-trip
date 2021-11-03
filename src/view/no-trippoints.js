/* eslint-disable no-underscore-dangle */
import { createElement } from '../utils';

export default class NoTask {
  constructor() {
    this._element = null;
    this._markup = `
    <p class="trip-events__msg">Click New Event to create your first point</p>
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
