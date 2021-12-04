/* eslint-disable quote-props */
/* eslint-disable prefer-object-spread */
/* eslint-disable no-underscore-dangle */
import AbstractObserver from '../utils/abstract-observer';

export default class Points extends AbstractObserver {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._points.splice(index, 1);
    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedData = Object.assign(
      {},
      point,
      {
        dateFrom: point.date_from !== null ? new Date(point.date_from) : point.date_from,
        dateTo: point.date_to !== null ? new Date(point.date_to) : point.date_to,
        basePrice: point.base_price,
        isFavorite: point.is_favorite,
      },
    );

    delete adaptedData.date_from;
    delete adaptedData.date_to;
    delete adaptedData.base_price;
    delete adaptedData.is_favorite;
    return adaptedData;
  }

  static adaptToServer(point) {
    const adaptedData = Object.assign(
      {},
      point,
      {
        'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
        'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
        'base_price': point.basePrice,
        'is_favorite': point.isFavorite,
      },
    );

    delete adaptedData.dateFrom;
    delete adaptedData.dateTo;
    delete adaptedData.basePrice;
    delete adaptedData.isFavorite;
    return adaptedData;
  }
}
