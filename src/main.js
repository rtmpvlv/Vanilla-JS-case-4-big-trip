import createTripInformationTemplate from './view/information';
import createTripPriceTemplate from './view/price';
import createMenuTemplate from './view/menu';
import createTripFiltersTemplate from './view/filter';
import createTripSortTemplate from './view/sort';
import createAdditionFormTemplate from './view/addition-form';
import createEditionFormTemplate from './view/edition-form';
import createTripItemTemplate from './view/list-item';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const header = document.querySelector('.trip-main');
const headerMenuNavigation = header.querySelector('.trip-controls__navigation');
const headerMenuFilters = header.querySelector('.trip-controls__filters');
const mainTripEvents = document.querySelector('.trip-events');

render(header, createTripInformationTemplate(), 'afterbegin');
render(headerMenuNavigation, createMenuTemplate(), 'beforeend');
render(headerMenuFilters, createTripFiltersTemplate(), 'beforeend');
render(mainTripEvents, createTripSortTemplate(), 'beforeend');

const tripEventsList = document.createElement('ul');
tripEventsList.classList.add('trip-events__list');
mainTripEvents.appendChild(tripEventsList);
render(tripEventsList, createEditionFormTemplate(), 'beforeend');
render(tripEventsList, createAdditionFormTemplate(), 'beforeend');
render(tripEventsList, createTripItemTemplate(), 'beforeend');
render(tripEventsList, createTripItemTemplate(), 'beforeend');
render(tripEventsList, createTripItemTemplate(), 'beforeend');

const tripInformation = header.querySelector('.trip-main__trip-info');
render(tripInformation, createTripPriceTemplate(), 'beforeend');
