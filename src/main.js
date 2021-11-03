import FilterView from './view/filter';
import PathInfoView from './view/path-info';
import PriceView from './view/price';
import MenuView from './view/menu';
import SortView from './view/sort';
// import AddFormView from './view/addition-form';
import EditFormView from './view/edition-form';
import ListItemView from './view/list-item';
import NoTaskView from './view/no-trippoints';
import getTripPointInfo from './mock-data/mock-data';
import setFiltering from './mock-data/filtering';
import { render, RenderPosition } from './utils';

const POINTS_COUNT = 15;

const tripPoints = new Array(POINTS_COUNT).fill().map(getTripPointInfo);
tripPoints.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
const filteredPoints = setFiltering(tripPoints);

const header = document.querySelector('.trip-main');
const headerMenuNavigation = header.querySelector('.trip-controls__navigation');
const headerMenuFilters = header.querySelector('.trip-controls__filters');
const mainTripEventsSection = document.querySelector('.trip-events');
const eventsList = document.createElement('ul');
eventsList.classList.add('trip-events__list');
mainTripEventsSection.appendChild(eventsList);

const renderListItem = (place, point) => {
  const listItemForm = new ListItemView(point);
  const editItemForm = new EditFormView(point);

  const replaceListItemToForm = () => {
    place.replaceChild(editItemForm.getElement(), listItemForm.getElement());
  };

  const replaceFormToListItem = () => {
    place.replaceChild(listItemForm.getElement(), editItemForm.getElement());
  };

  const keyPressed = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc' || evt.key === 'ArrowUp') {
      evt.preventDefault();
      replaceFormToListItem();
      document.removeEventListener('keydown', keyPressed);
    }
  };

  listItemForm.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    document.addEventListener('keydown', keyPressed);
    replaceListItemToForm();
  });

  editItemForm.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToListItem();
    document.removeEventListener('keydown', keyPressed);
  });

  editItemForm.getElement().querySelector('.event__rollup-btn').addEventListener('click', replaceFormToListItem);

  render(place, listItemForm.getElement(), RenderPosition.BEFOREEND);
};

const renderView = (points, filters) => {
  render(headerMenuNavigation, new MenuView().getElement(), RenderPosition.BEFOREEND);
  render(headerMenuFilters, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);

  if (!points || points.length === 0) {
    render(eventsList, new NoTaskView().getElement(), RenderPosition.BEFOREEND);
  } else {
    render(header, new PathInfoView(points).getElement(), RenderPosition.AFTERBEGIN);
    const tripInformation = header.querySelector('.trip-main__trip-info');
    render(tripInformation, new PriceView(points).getElement(), RenderPosition.BEFOREEND);
    render(mainTripEventsSection, new SortView().getElement(), RenderPosition.AFTERBEGIN);
    points.forEach((item) => renderListItem(eventsList, item));
  }
  // render(eventsList, new AddFormView().getElement(), RenderPosition.BEFOREEND);
};
renderView(tripPoints, filteredPoints);

export default POINTS_COUNT;
