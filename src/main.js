import MenuView from './view/menu';
import StatsPresenter from './presenter/stats';
import ListPresenter from './presenter/list';
import FilterPresenter from './presenter/filter';
import PathPresenter from './presenter/path-info';
import PointModel from './model/points';
import FilterModel from './model/filter';
import OffersModel from './model/offers';
import DestinationsModel from './model/destinations';
import { render } from './utils/render';
import {
  MenuItem,
  SortType,
  UpdateType,
  FilterType
} from './utils/constants';
import ButtonPresenter from './presenter/button';
import Api from './api';

const AUTHORIZATION = 'Basic rtmpvlv';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const header = document.querySelector('.trip-main');
const headerMenuNavigation = header.querySelector('.trip-controls__navigation');
const headerMenuFilters = header.querySelector('.trip-controls__filters');
const pageBodyContainer = document.querySelector('#body-container');
const mainTripEventsSection = document.querySelector('.trip-events');

const pointModel = new PointModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const api = new Api(END_POINT, AUTHORIZATION);

const menuView = new MenuView();
const pathPresenter = new PathPresenter(header, pointModel);
const statsPresenter = new StatsPresenter(pageBodyContainer, pointModel);
const filterPresenter = new FilterPresenter(headerMenuFilters, pointModel, filterModel);
const buttonPresenter = new ButtonPresenter(header, handleButtonClick);
const listPresenter = new ListPresenter(
  mainTripEventsSection,
  pointModel,
  filterModel,
  buttonPresenter,
  offersModel,
  destinationsModel,
  api,
);

function handleButtonClick() {
  statsPresenter.destroy();
  menuView.setTableLinkActive();
  listPresenter.openAddForm();
  listPresenter.show();
  buttonPresenter.isDisabled();
}

if (pointModel.getPoints().length > 0) {
  pathPresenter.render();
}
buttonPresenter.renderButton();
statsPresenter.destroy();

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      statsPresenter.destroy();
      listPresenter.changeMode();
      listPresenter.handleSortTypeChange(SortType.DAY);
      listPresenter.show();
      buttonPresenter.renderButton();
      filterPresenter.init();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      break;
    case MenuItem.STATS:
      listPresenter.hide();
      statsPresenter.render();
      buttonPresenter.isDisabled();
      filterPresenter.isDisabled();
      break;
    default:
      throw new Error('Unexpected menu item.');
  }
};

filterPresenter.init();
listPresenter.renderView();

api.getDestinations()
  .then((destinations) => {
    destinationsModel.setDestinations(destinations);
    return api.getOffers();
  })
  .then((offers) => {
    offersModel.setOffers(offers);
    return api.getPoints();
  })
  .then((points) => {
    pointModel.setPoints(UpdateType.INIT, points);
    render(headerMenuNavigation, menuView);
    menuView.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    pointModel.setPoints(UpdateType.INIT, []);
    render(headerMenuNavigation, menuView);
    menuView.setMenuClickHandler(handleSiteMenuClick);
  });

// Не отрабатывает кнопка Добавить на пустом листе
// Дата окончания может быть меньше даты начала события. 49
