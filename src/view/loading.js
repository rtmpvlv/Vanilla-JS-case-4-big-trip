/* eslint-disable no-underscore-dangle */
import AbstractView from './abstract';

export default class Loading extends AbstractView {
  constructor() {
    super();
    this._markup = '<p class="trip-events__msg">Loading...</p>';
  }

  getTemplate() {
    return this._markup;
  }
}
