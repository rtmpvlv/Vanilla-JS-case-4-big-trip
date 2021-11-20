/* eslint-disable default-case */
/* eslint-disable no-underscore-dangle */
import TripEventsListView from '../view/trips-event-list';
import SortView from '../view/sort';
import NoPointsView from '../view/no-trippoints';
import ListItem from './point';
import AddFormPresenter from './add-form';
import { remove, render, RenderPosition } from '../utils/render';
import {
  SortType,
  UserAction,
  UpdateType,
  FilterType
} from '../utils/constants';
import { sortPrice, sortDate, sortDuration } from '../utils/sort-utils';
import filter from '../utils/filter';

export default class TripEventsList {
  constructor(place, pointModel, filterModel) {
    this._tripEventsSection = place;
    this._pointModel = pointModel;
    this._filterModel = filterModel;
    this._filterType = FilterType.EVERYTHING;
    this._currentSortType = SortType.DAY;

    this._tripEventsList = new TripEventsListView();
    this._sortView = null;
    this._noPointsView = null;
    this._listItemPresenter = new Map();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._changeMode = this._changeMode.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._addFormPresenter = new AddFormPresenter(this._tripEventsList, this._handleViewAction);
  }

  renderView() {
    if (this._pointModel.getPoints().length === 0) {
      this._renderNoPoints();
      return;
    }
    this._renderSort();
    this._renderEventsList();
    this._renderEvents();
  }

  createPoint() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._addFormPresenter.renderAddForm();
  }

  _getPoints() {
    this._filterType = this._filterModel.getFilter();
    const points = this._pointModel.getPoints();
    const filteredPoints = filter[this._filterType](points);
    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortDate);
      case SortType.TIME:
        return filteredPoints.sort(sortDuration);
      case SortType.PRICE:
        return filteredPoints.sort(sortPrice);
    }
    return filteredPoints;
  }

  _renderSort() {
    if (this._sortView !== null) {
      this._sortView = null;
    }
    this._sortView = new SortView(this._currentSortType);
    this._sortView.setSortTypeHandler(this._handleSortTypeChange);
    render(this._tripEventsSection, this._sortView, RenderPosition.AFTERBEGIN);
  }

  _renderEventsList() {
    render(this._tripEventsSection, this._tripEventsList);
  }

  _renderEvents() {
    this._getPoints().forEach((point) => this._renderListItem(point));
  }

  _renderListItem(point) {
    const listItemPresenter = new ListItem(
      this._tripEventsList,
      this._handleViewAction,
      this._changeMode,
    );
    listItemPresenter.renderListItem(point);
    this._listItemPresenter.set(point.id, listItemPresenter);
  }

  _renderNoPoints() {
    this._noPointsView = new NoPointsView(this._filterType);
    render(this._tripEventsList, this._noPointsView, RenderPosition.AFTERBEGIN);
  }

  _clearEventsList() {
    this._addFormPresenter.destroy();
    this._listItemPresenter.forEach((item) => item._destroy());
    this._listItemPresenter.clear();
    remove(this._sortView);
    if (this._noPointsView) {
      remove(this._noPointsView);
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._listItemPresenter.get(data.id).renderListItem(data);
        break;
      case UpdateType.MINOR:
        this._clearEventsList();
        this.renderView();
        break;
      case UpdateType.MAJOR:
        this._clearEventsList();
        this.renderView();
        break;
    }
  }

  _changeMode() {
    this._addFormPresenter.destroy();
    this._listItemPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearEventsList();
    this.renderView();
  }
}
