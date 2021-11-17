/* eslint-disable no-underscore-dangle */
import TripEventsListView from '../view/trips-event-list';
import SortView from '../view/sort';
import NoPointsView from '../view/no-trippoints';
import TripEventsListItem from './trip-point';
import { remove, render, replace } from '../utils/render';
import { updateItem } from '../mock-data/utils-and-const';
import SortType from '../utils/constants';
import { sortPrice, sortDuration } from '../utils/sort-utils';
// import AddForm from './add-form';

export default class TripEventsList {
  constructor(points, place) {
    this._points = points.slice();
    this._sourcedPoints = points.slice();
    this._tripEventsSection = place;
    this._currentSortType = SortType.DAY;

    this._tripEventsList = new TripEventsListView();
    this._sortView = new SortView();
    this._noPointsView = new NoPointsView();
    this._listItemPresenter = new Map();

    this._changeData = this._changeData.bind(this);
    this._changeMode = this._changeMode.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  renderView() {
    if (this._points.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    // this._renderAdditionForm();
    this._renderEventsList();
    this._renderEvents();
  }

  _renderSort() {
    render(this._tripEventsSection, this._sortView);
    this._sortView.setSortTypeHandler(this._handleSortTypeChange);
  }

  _renderEventsList() {
    render(this._tripEventsSection, this._tripEventsList);
  }

  _renderEvents() {
    this._points.forEach((point) => this._renderListItem(point));
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

  // _renderAdditionForm() {
  //   const addFormPresenter = new AddForm(this._tripEventsList, this._changeData);
  //   addFormPresenter.renderAddForm();
  //   this._listItemPresenter.set(addFormPresenter.id, addFormPresenter);
  // }

  _renderNoPoints() {
    render(this._tripEventsList, this._noPointsView);
  }

  _clearEventsList() {
    this._listItemPresenter.forEach((item) => item._destroy());
    this._listItemPresenter.clear();
  }

  _changeData(changedPoint) {
    this._points = updateItem(this._points, changedPoint);
    this._sourcedPoints = updateItem(this._sourcedPoints, changedPoint);
    this._listItemPresenter.get(changedPoint.id).renderListItem(changedPoint);
  }

  _changeMode() {
    this._listItemPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType || !sortType) {
      return;
    }
    this._sortPoints(sortType);
    this._clearEventsList();
    this._sortViewRefresh();
    this._renderEvents();
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._points.sort(sortDuration);
        break;
      case SortType.PRICE:
        this._points.sort(sortPrice);
        break;
      default:
        this._points = this._sourcedPoints.slice();
    }

    this._currentSortType = sortType;
  }

  _sortViewRefresh() {
    const previousSortView = this._sortView;
    this._sortView = new SortView();
    replace(this._sortView, previousSortView);
    this._sortView.setSortTypeHandler(this._handleSortTypeChange);
    remove(previousSortView);
  }
}
