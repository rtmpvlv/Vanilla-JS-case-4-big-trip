import FilterView from './view/filter';
import PathInfoView from './view/path-info';
import TotalCostView from './view/total-cost';
import MenuView from './view/menu';
import { getTripPointInfo } from './mock-data/mock-data';
import setFiltering from './mock-data/filtering';
import { render, RenderPosition } from './utils/render';
import TripEventsList from './presenter/trip-events-list';

// mock-data

const POINTS_COUNT = 15;
const tripPoints = new Array(POINTS_COUNT).fill().map(getTripPointInfo);
tripPoints.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
const filteredPoints = setFiltering(tripPoints);

const header = document.querySelector('.trip-main');
const headerMenuNavigation = header.querySelector('.trip-controls__navigation');
const headerMenuFilters = header.querySelector('.trip-controls__filters');
const mainTripEventsSection = document.querySelector('.trip-events');

// trip point list presenter

const tripEventsList = new TripEventsList(tripPoints, mainTripEventsSection);
tripEventsList.renderView();

const renderView = (points, filters) => {
  render(headerMenuNavigation, new MenuView());
  render(headerMenuFilters, new FilterView(filters));
  if (points.length > 0) {
    render(header, new PathInfoView(points), RenderPosition.AFTERBEGIN);
    const tripInformation = header.querySelector('.trip-main__trip-info');
    render(tripInformation, new TotalCostView(points));
  }
};
renderView(tripPoints, filteredPoints);

export default POINTS_COUNT;
