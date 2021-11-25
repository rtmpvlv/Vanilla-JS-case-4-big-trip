/* eslint-disable no-underscore-dangle */
import AbstractObserver from '../utils/abstract-observer';

export default class Offers extends AbstractObserver {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers.slice();
  }

  getOffers() {
    return this._offers;
  }

  updateOffer(updateType, update) {
    const index = this._offers.findIndex((offer) => offer.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting offer.');
    }

    this._offers = [
      ...this._offers.slice(0, index),
      update,
      ...this._offers.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addOffer(updateType, update) {
    this._offers = [
      update,
      ...this._offers,
    ];

    this._notify(updateType, update);
  }

  deleteOffer(updateType, update) {
    const index = this._offers.findIndex((offer) => offer.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting offer.');
    }

    this._offers.splice(index, 1);
    this._notify(updateType);
  }
}
