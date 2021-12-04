/* eslint-disable default-case */
/* eslint-disable no-underscore-dangle */
import PathInfoView from '../view/path-info';
import {
  remove,
  render,
  RenderPosition,
  replace
} from '../utils/render';

export default class pathInfo {
  constructor(place, pointModel) {
    this._place = place;
    this._pointModel = pointModel;

    this._pathInfoPresenter = null;
    this._totalCostPresenter = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointModel.addObserver(this._handleModelEvent);
  }

  render() {
    this._points = this._pointModel.getPoints();
    const prevPathInfoPresenter = this._pathInfoPresenter;
    const prevTotalCostPresenter = this._totalCostPresenter;

    this._pathInfoPresenter = new PathInfoView(this._points);

    if (prevPathInfoPresenter === null && prevTotalCostPresenter === null) {
      render(this._place, this._pathInfoPresenter, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._pathInfoPresenter, prevPathInfoPresenter);
    remove(prevPathInfoPresenter);
  }

  _handleModelEvent() {
    this.render();
  }
}
