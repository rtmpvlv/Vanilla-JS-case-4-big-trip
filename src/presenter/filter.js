/* eslint-disable default-case */
/* eslint-disable no-underscore-dangle */
import FilterView from '../view/filter';
import { remove, render, replace } from '../utils/render';
import filter from '../utils/filter';
import { FilterType, UpdateType } from '../utils/constants';

export default class Filter {
  constructor(place, pointModel, filterModel) {
    this._filterContainer = place;
    this._pointModel = pointModel;
    this._filterModel = filterModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._pointModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(
      this._getFilters(),
      this._filterModel.getFilter(),
      false,
    );
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  isDisabled() {
    const prevFilterComponent = this._filterComponent;
    this._filterComponent = new FilterView(this._getFilters(), this._filterModel.getFilter(), true);
    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent);
      return;
    }
    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const points = this._pointModel.getPoints();
    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything',
        count: filter[FilterType.EVERYTHING](points).length,
      },
      {
        type: FilterType.FUTURE,
        name: 'Future',
        count: filter[FilterType.FUTURE](points).length,
      },
      {
        type: FilterType.PAST,
        name: 'Past',
        count: filter[FilterType.PAST](points).length,
      },
    ];
  }
}
