/* eslint-disable default-case */
/* eslint-disable no-underscore-dangle */
import StatsView from '../view/stats';
import { remove, render, replace } from '../utils/render';

export default class Stats {
  constructor(place, pointModel) {
    this._place = place;
    this._pointModel = pointModel;
    this._statsPresenter = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._pointModel.addObserver(this._handleModelEvent);
  }

  render() {
    this._points = this._pointModel.getPoints();
    const prevStatsPresenter = this._statsPresenter;
    this._statsPresenter = new StatsView(this._points);

    if (prevStatsPresenter === null) {
      render(this._place, this._statsPresenter);
      return;
    }

    replace(this._statsPresenter, prevStatsPresenter);
    remove(prevStatsPresenter);
  }

  destroy() {
    remove(this._statsPresenter);
    this._statsPresenter = null;
  }

  _handleModelEvent() {
    this.render();
  }
}
