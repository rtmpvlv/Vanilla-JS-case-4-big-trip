import createTripInformationTemplate from './view/information';
import createTripPriceTemplate from './view/price';
import createMenuTemplate from './view/menu';
import createTripFiltersTemplate from './view/filter';
import createTripSortTemplate from './view/sort';
import createAdditionFormTemplate from './view/addition-form';
import createEditionFormTemplate from './view/edition-form';
import createTripItemTemplate from './view/list-item';
import getTripPointInfo from './mock-data/mock-data';
import setFiltering from './mock-data/filtering';

const POINTS_COUNT = 15;
const INSERT_PLACE = 'beforeend';

const tripPoints = new Array(POINTS_COUNT).fill().map(getTripPointInfo);
tripPoints.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
const filters = setFiltering(tripPoints);

const render = (container, template, place = INSERT_PLACE) => {
  container.insertAdjacentHTML(place, template);
};

const header = document.querySelector('.trip-main');
const headerMenuNavigation = header.querySelector('.trip-controls__navigation');
const headerMenuFilters = header.querySelector('.trip-controls__filters');
const mainTripEventsSection = document.querySelector('.trip-events');

render(header, createTripInformationTemplate(tripPoints), 'afterbegin');
render(headerMenuNavigation, createMenuTemplate());
render(headerMenuFilters, createTripFiltersTemplate(filters));
render(mainTripEventsSection, createTripSortTemplate());

const tripEventsList = document.createElement('ul');
tripEventsList.classList.add('trip-events__list');
mainTripEventsSection.appendChild(tripEventsList);
render(tripEventsList, createEditionFormTemplate(tripPoints[0]));
render(tripEventsList, createAdditionFormTemplate(tripPoints[1]));

for (let i = 2; i < POINTS_COUNT; i += 1) {
  render(tripEventsList, createTripItemTemplate(tripPoints[i]));
}

const tripInformation = header.querySelector('.trip-main__trip-info');
render(tripInformation, createTripPriceTemplate(tripPoints));

export default POINTS_COUNT;
