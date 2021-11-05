/* eslint-disable no-underscore-dangle */
import AbstractView from './abstract';

const createTripFiltersTemplate = ((filters) => {
  const filterItemTemplate = filters.map(({ name, filtredPoints }) => `
  <div class="trip-filters__filter">
     <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything">
     <label class="trip-filters__filter-label" for="filter-everything">${name} ${filtredPoints}</label>
  </div>`).join('');

  return `
  <form class="trip-filters" action="#" method="get">
    ${filterItemTemplate}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
  `;
});

export default class Filter extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createTripFiltersTemplate(this._filters);
  }
}
