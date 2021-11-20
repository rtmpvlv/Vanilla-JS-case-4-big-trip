import PathInfoView from './view/path-info';
import TotalCostView from './view/total-cost';
import MenuView from './view/menu';
import { getTripPointInfo } from './mock-data/mock-data';
import { render, RenderPosition } from './utils/render';
import ListPresenter from './presenter/list';
import FilterPresenter from './presenter/filter';
import PointModel from './model/points';
import FilterModel from './model/filter';

const POINTS_COUNT = 15;
const tripPoints = new Array(POINTS_COUNT).fill().map(getTripPointInfo);

const header = document.querySelector('.trip-main');
const headerMenuNavigation = header.querySelector('.trip-controls__navigation');
const headerMenuFilters = header.querySelector('.trip-controls__filters');
const mainTripEventsSection = document.querySelector('.trip-events');

const pointModel = new PointModel();
pointModel.setPoints(tripPoints);
const filterModel = new FilterModel();

const listPresenter = new ListPresenter(mainTripEventsSection, pointModel, filterModel);
const filterPresenter = new FilterPresenter(headerMenuFilters, pointModel, filterModel);
listPresenter.renderView();
filterPresenter.init();

render(headerMenuNavigation, new MenuView());
if (tripPoints.length > 0) {
  render(header, new PathInfoView(tripPoints), RenderPosition.AFTERBEGIN);
  const tripInformation = header.querySelector('.trip-main__trip-info');
  render(tripInformation, new TotalCostView(tripPoints));
}

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  listPresenter.createPoint();
});

export default POINTS_COUNT;
