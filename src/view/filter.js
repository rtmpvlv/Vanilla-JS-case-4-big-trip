/* eslint-disable no-underscore-dangle */
import AbstractView from './abstract';

const createTripFiltersTemplate = ((filter, currentType) => {
  const filterItemTemplate = filter.map(({ type, name, count }) => `
  <div class="trip-filters__filter">
     <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentType ? 'checked' : ''}>
     <label class="trip-filters__filter-label" for="filter-${name}">${name} ${count}</label>
  </div>`).join('');

  return `
  <form class="trip-filters" action="#" method="get">
    ${filterItemTemplate}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
  `;
});

export default class Filter extends AbstractView {
  constructor(filters, currentType) {
    super();
    this._filters = filters;
    this._currentType = currentType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripFiltersTemplate(this._filters, this._currentType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}
