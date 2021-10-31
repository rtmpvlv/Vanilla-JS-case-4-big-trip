const createFilterItemTemplate = ((array) => array.map(({ name, filtredPoints }) => `
    <div class="trip-filters__filter">
       <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything">
       <label class="trip-filters__filter-label" for="filter-everything">${name} ${filtredPoints}</label>
    </div>`).join(''));

const createTripFiltersTemplate = ((filter) => `
  <form class="trip-filters" action="#" method="get">
    ${createFilterItemTemplate(filter)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
  `
);

export default createTripFiltersTemplate;
