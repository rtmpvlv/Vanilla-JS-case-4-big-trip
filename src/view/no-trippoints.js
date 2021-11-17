/* eslint-disable no-underscore-dangle */
import AbstractView from './abstract';

export default class NoPoints extends AbstractView {
  constructor() {
    super();
    this._markup = `
    <p class="trip-events__msg">Click New Event to create your first point</p>`;
  }

  getTemplate() {
    return this._markup;
  }
}
