/* eslint-disable no-underscore-dangle */

import AbstractView from './abstract';

export default class TripsEventSection extends AbstractView {
  constructor() {
    super();
    this._markup = '<ul class="trip-events__list"></ul>';
  }

  getTemplate() {
    return this._markup;
  }
}
