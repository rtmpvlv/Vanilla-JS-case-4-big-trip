import PointModel from './model/points';
import FilterModel from './model/filter';
import OffersModel from './model/offers';
import DestinationsModel from './model/destinations';
import MenuView from './view/menu';
import StatsPresenter from './presenter/stats';
import ListPresenter from './presenter/list';
import FilterPresenter from './presenter/filter';
import PathPresenter from './presenter/path-info';
import ButtonPresenter from './presenter/button';
import { render } from './utils/render';
import {
  MenuItem,
  SortType,
  UpdateType,
  FilterType
} from './utils/constants';
import toast from './utils/toast';
import Api from './api/api';
import Store from './api/store';
import Provider from './api/provider';

const AUTHORIZATION = 'Basic rtmpvlv';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'big-trip-localstorage';
const STORE_VER = 'v15';
const STORE_POINTS_NAME = `${STORE_PREFIX}-points-${STORE_VER}`;
const STORE_OFFERS_NAME = `${STORE_PREFIX}-offers-${STORE_VER}`;
const STORE_DESTINATIONS_NAME = `${STORE_PREFIX}-destinations-${STORE_VER}`;

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
const storePoints = new Store(STORE_POINTS_NAME, window.localStorage);
const storeOffers = new Store(STORE_OFFERS_NAME, window.localStorage);
const storeDestinations = new Store(STORE_DESTINATIONS_NAME, window.localStorage);
const apiWithProvider = new Provider(api, storePoints, storeOffers, storeDestinations);

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
  apiWithProvider,
);

function handleButtonClick() {
  statsPresenter.destroy();
  menuView.setTableLinkActive();
  if (!window.navigator.onLine) {
    toast('Can\'t create new point offline.');
  }
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

apiWithProvider.getDestinations()
  .then((destinations) => {
    destinationsModel.setDestinations(destinations);
    return apiWithProvider.getOffers();
  })
  .then((offers) => {
    offersModel.setOffers(offers);
    return apiWithProvider.getPoints();
  })
  .then((points) => {
    pointModel.setPoints(UpdateType.INIT, points);
    render(headerMenuNavigation, menuView);
    menuView.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    destinationsModel.setDestinations([]);
    offersModel.setOffers([]);
    pointModel.setPoints(UpdateType.INIT, []);
    render(headerMenuNavigation, menuView);
    menuView.setMenuClickHandler(handleSiteMenuClick);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/service-worker.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});

// Не отрабатывает кнопка Добавить на пустом листе
// Дата окончания может быть меньше даты начала события. 49
// Отключить клики на заблокированной сортировке
