/* eslint-disable no-underscore-dangle */
import AbstractObserver from '../utils/abstract-observer';

export default class Offers extends AbstractObserver {
  constructor() {
    super();
    this._offers = [];
  }

  setPoints(offers) {
    this._offers = offers.slice();
  }

  getPoints() {
    return this._offers;
  }
}
