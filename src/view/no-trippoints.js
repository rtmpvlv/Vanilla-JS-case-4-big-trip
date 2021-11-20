/* eslint-disable no-underscore-dangle */
import AbstractView from './abstract';
import { FilterType } from '../utils/constants';

const NoPointsText = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};
export default class NoPoints extends AbstractView {
  constructor(filterType) {
    super();
    this._filterType = filterType;
    this._markup = `
    <p class="trip-events__msg">${NoPointsText[this._filterType]}</p>`;
  }

  getTemplate() {
    return this._markup;
  }
}
