import FilterView from './view/filter';
import PathInfoView from './view/path-info';
import PriceView from './view/price';
import MenuView from './view/menu';
import SortView from './view/sort';
// import AddFormView from './view/addition-form';
import EditFormView from './view/edition-form';
import ListItemView from './view/list-item';
import getTripPointInfo from './mock-data/mock-data';
import setFiltering from './mock-data/filtering';
import { render, RenderPosition } from './utils';

const POINTS_COUNT = 15;

const tripPoints = new Array(POINTS_COUNT).fill().map(getTripPointInfo);
tripPoints.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
const filters = setFiltering(tripPoints);

const header = document.querySelector('.trip-main');
const headerMenuNavigation = header.querySelector('.trip-controls__navigation');
const headerMenuFilters = header.querySelector('.trip-controls__filters');
const mainTripEventsSection = document.querySelector('.trip-events');

render(header, new PathInfoView(tripPoints).getElement(), RenderPosition.AFTERBEGIN);

const tripInformation = header.querySelector('.trip-main__trip-info');

render(tripInformation, new PriceView(tripPoints).getElement(), RenderPosition.BEFOREEND);
render(headerMenuNavigation, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(mainTripEventsSection, new SortView().getElement(), RenderPosition.BEFOREEND);
render(headerMenuFilters, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);

const renderListItem = (place, point) => {
  const listItemForm = new ListItemView(point);
  const editItemForm = new EditFormView(point);

  const replaceListItemToForm = () => {
    place.replaceChild(editItemForm.getElement(), listItemForm.getElement());
  };

  const replaceFormToListItem = () => {
    place.replaceChild(listItemForm.getElement(), editItemForm.getElement());
  };

  listItemForm.getElement().querySelector('.event__rollup-btn').addEventListener('click', replaceListItemToForm);

  editItemForm.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToListItem();
  });
  editItemForm.getElement().querySelector('.event__rollup-btn').addEventListener('click', replaceFormToListItem);

  render(place, listItemForm.getElement(), RenderPosition.BEFOREEND);
};

const eventsList = document.createElement('ul');
eventsList.classList.add('trip-events__list');
mainTripEventsSection.appendChild(eventsList);

tripPoints.forEach((item) => renderListItem(eventsList, item));
// render(eventsList, new AddFormView().getElement(), RenderPosition.BEFOREEND);

export default POINTS_COUNT;
