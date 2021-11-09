/* eslint-disable no-underscore-dangle */
import TripEventsListView from '../view/trips-event-list';
import SortView from '../view/sort';
import NoPointsView from '../view/no-trippoints';
import TripEventsListItem from './trip-point';
import { render } from '../utils/render';
import { updateItem } from '../mock-data/utils-and-const';

export default class TripEventsList {
  constructor(points, tripsEventSection) {
    this._points = points.slice();
    this._tripEventsSection = tripsEventSection;

    this._tripEventsList = new TripEventsListView();
    this._sortView = new SortView();
    this._noPointsView = new NoPointsView();

    this._listItemPresenter = new Map();

    this._changeData = this._changeData.bind(this);
    this._changeMode = this._changeMode.bind(this);
  }

  _renderSort() {
    render(this._tripEventsSection, this._sortView);
  }

  _renderEventsList() {
    render(this._tripEventsSection, this._tripEventsList);
  }

  _renderListItem(point) {
    const listItemPresenter = new TripEventsListItem(
      this._tripEventsList,
      this._changeData,
      this._changeMode,
    );
    listItemPresenter.renderListItem(point);
    this._listItemPresenter.set(point.id, listItemPresenter);
  }

  _renderEvents() {
    this._points.forEach((point) => this._renderListItem(point));
  }

  _renderNoPoints() {
    render(this._tripEventsList, this._noPointsView);
  }

  _clearEventsList() {
    this._listItemPresenter.forEach((item) => item.destroy());
    this._listItemPresenter.clear();
  }

  _changeData(changedPoint) {
    this._points = updateItem(this._points, changedPoint);
    this._listItemPresenter.get(changedPoint.id).renderListItem(changedPoint);
  }

  _changeMode() {
    this._listItemPresenter.forEach((presenter) => presenter.resetView());
  }

  renderView() {
    if (this._points.length === 0) {
      this._renderNoPoints();
    } else {
      this._renderSort();
      this._renderEventsList();
      this._renderEvents();
    }
  }
}
