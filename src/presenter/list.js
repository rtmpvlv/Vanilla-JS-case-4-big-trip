/* eslint-disable default-case */
/* eslint-disable no-underscore-dangle */
import TripEventsListView from '../view/trips-event-list';
import SortView from '../view/sort';
import NoPointsView from '../view/no-trippoints';
import LoadingView from '../view/loading';
import Point, { State as PointPresenterViewState } from './point';
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
  constructor(
    place,
    pointModel,
    filterModel,
    buttonPresenter,
    offersModel,
    destinationsModel,
    api,
  ) {
    this._tripEventsSection = place;
    this._pointModel = pointModel;
    this._filterModel = filterModel;
    this._buttonPresenter = buttonPresenter;
    this._offersmodel = offersModel;
    this._destinationsModel = destinationsModel;
    this._api = api;

    this._isLoading = true;
    this._filterType = FilterType.EVERYTHING;
    this._currentSortType = SortType.DAY;

    this._tripEventsList = new TripEventsListView();
    this._sortView = null;
    this._noPointsView = null;
    this._listItemPresenter = new Map();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.handleSortTypeChange = this.handleSortTypeChange.bind(this);

    this._pointModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._addFormPresenter = new AddFormPresenter(
      this._tripEventsList,
      this._handleViewAction,
      this._buttonPresenter,
      this._offersmodel,
      this._destinationsModel,
    );
  }

  renderView() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    if (this._getPoints().length === 0) {
      this._renderNoPoints();
      return;
    }
    this._renderSort();
    this._renderEventsList();
    this._renderEvents();
  }

  openAddForm() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._addFormPresenter.renderAddForm();
  }

  hide() {
    this._tripEventsSection.classList.add('visually-hidden');
  }

  show() {
    this._tripEventsSection.classList.remove('visually-hidden');
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
      default:
        throw new Error('Unexpected sort type.');
    }
  }

  _renderSort() {
    if (this._sortView !== null) {
      this._sortView = null;
    }
    this._sortView = new SortView(this._currentSortType);
    this._sortView.setSortTypeHandler(this.handleSortTypeChange);
    render(this._tripEventsSection, this._sortView, RenderPosition.AFTERBEGIN);
  }

  _renderEventsList() {
    render(this._tripEventsSection, this._tripEventsList);
  }

  _renderEvents() {
    this._getPoints().forEach((point) => this._renderListItem(point));
  }

  _renderListItem(point) {
    const listItemPresenter = new Point(
      this._tripEventsList,
      this._handleViewAction,
      this.changeMode,
      this._offersmodel,
      this._destinationsModel,
    );
    listItemPresenter.renderListItem(point);
    this._listItemPresenter.set(point.id, listItemPresenter);
  }

  _renderNoPoints() {
    this._noPointsView = new NoPointsView(this._filterType);
    render(this._tripEventsSection, this._noPointsView);
  }

  _renderLoading() {
    render(this._tripEventsSection, this._loadingComponent);
  }

  _clearEventsList() {
    this._addFormPresenter.destroy();
    this._listItemPresenter.forEach((item) => item._destroy());
    this._listItemPresenter.clear();
    remove(this._sortView);
    remove(this._loadingComponent);
    if (this._noPointsView) {
      remove(this._noPointsView);
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._listItemPresenter.get(update.id)
          .setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => this._pointModel.updatePoint(updateType, response))
          .catch(() => this._listItemPresenter.get(update.id)
            .setViewState(PointPresenterViewState.ABORTING));
        break;
      case UserAction.ADD_POINT:
        this._addFormPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => this._pointModel.addPoint(updateType, response))
          .catch(() => this._addFormPresenter.setAborting());
        break;
      case UserAction.DELETE_POINT:
        this._listItemPresenter.get(update.id)
          .setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => this._pointModel.deletePoint(updateType, update))
          .catch(() => this._listItemPresenter
            .get(update.id)
            .setViewState(PointPresenterViewState.ABORTING));
        break;
      default:
        throw new Error('Unexpected user\'s action.');
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this.renderView();
        break;
      default:
        throw new Error('Unexpected update type.');
    }
  }

  changeMode() {
    this._addFormPresenter.destroy();
    this._listItemPresenter.forEach((presenter) => presenter.resetView());
  }

  handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearEventsList();
    this.renderView();
  }
}
