/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-object-spread */
import PointModel from '../model/points';

const getSyncedPoints = (items) => items
  .filter(({ success }) => success)
  .map(({ payload }) => payload.point);

const createPointsStoreStructure = (items) => items
  .reduce((acc, current) => Object.assign({}, acc, {
    [current.id]: current,
  }), {});

const createOffersStoreStructure = (items) => items
  .reduce((acc, current) => Object.assign({}, acc, {
    [current.type]: current,
  }), {});

const createDestinationsStoreStructure = (items) => items
  .reduce((acc, current) => Object.assign({}, acc, {
    [current.name]: current,
  }), {});

export default class Provider {
  constructor(api, storePoints, storeOffers, storeDestinations) {
    this._api = api;
    this._storePoints = storePoints;
    this._storeDestinations = storeDestinations;
    this._storeOffers = storeOffers;
  }

  getPoints() {
    if (window.navigator.onLine) {
      return this._api.getPoints()
        .then((points) => {
          const items = createPointsStoreStructure(points.map(PointModel.adaptToServer));
          this._storePoints.setItems(items);
          return points;
        });
    }
    const storePoints = Object.values(this._storePoints.getItems());
    return Promise.resolve(storePoints.map(PointModel.adaptToClient));
  }

  getDestinations() {
    if (window.navigator.onLine) {
      return this._api.getDestinations()
        .then((destinations) => {
          const items = createDestinationsStoreStructure(destinations);
          this._storeDestinations.setItems(items);
          return destinations;
        });
    }
    const storeDestinations = Object.values(this._storeDestinations.getItems());
    return Promise.resolve(storeDestinations);
  }

  getOffers() {
    if (window.navigator.onLine) {
      return this._api.getOffers()
        .then((offers) => {
          const items = createOffersStoreStructure(offers);
          this._storeOffers.setItems(items);
          return offers;
        });
    }
    const storeOffers = Object.values(this._storeOffers.getItems());
    return Promise.resolve(storeOffers);
  }

  updatePoint(point) {
    if (window.navigator.onLine) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._storePoints.setItem(updatedPoint.id, PointModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._storePoints.setItem(point.id, PointModel.adaptToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  addPoint(point) {
    if (window.navigator.onLine) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._storePoints.setItem(newPoint.id, PointModel.adaptToServer(newPoint));
          return newPoint;
        });
    }

    return Promise.reject(new Error('Add point failed'));
  }

  deletePoint(point) {
    if (window.navigator.onLine) {
      return this._api.deletePoint(point)
        .then(() => this._storePoints.removeItem(point.id));
    }

    return Promise.reject(new Error('Delete point failed'));
  }

  sync() {
    if (window.navigator.onLine) {
      const storePoints = Object.values(this._storePoints.getItems());

      return this._api.sync(storePoints)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createPointsStoreStructure([...createdPoints, ...updatedPoints]);

          this._storePoints.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
