/* eslint-disable no-underscore-dangle */
import AbstractView from './abstract';
import { MenuItem } from '../utils/constants';

export default class Menu extends AbstractView {
  constructor() {
    super();
    this._markup = `
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" id="${MenuItem.TABLE}">${MenuItem.TABLE}</a>
      <a class="trip-tabs__btn" id="${MenuItem.STATS}">${MenuItem.STATS}</a>
    </nav>`;
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return this._markup;
  }

  setTableLinkActive() {
    const links = this.getElement().querySelectorAll('a');
    links.forEach((link) => link.classList.remove('trip-tabs__btn--active'));
    this.getElement().querySelector(`#${MenuItem.TABLE}`).classList.add('trip-tabs__btn--active');
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'A') {
      return;
    }
    const links = this.getElement().querySelectorAll('a');
    links.forEach((link) => link.classList.remove('trip-tabs__btn--active'));
    evt.target.classList.add('trip-tabs__btn--active');
    this._callback.menuClick(evt.target.id);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }
}
