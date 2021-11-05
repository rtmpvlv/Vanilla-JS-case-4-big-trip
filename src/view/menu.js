/* eslint-disable no-underscore-dangle */
import AbstractView from './abstract';

export default class Menu extends AbstractView {
  constructor() {
    super();
    this._markup = `
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>
  `;
  }

  getTemplate() {
    return this._markup;
  }
}
