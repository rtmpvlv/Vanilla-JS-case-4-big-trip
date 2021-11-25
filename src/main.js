import { getTripPointInfo } from './mock-data/mock-data';
import MenuView from './view/menu';
import StatsPresenter from './presenter/stats';
import ListPresenter from './presenter/list';
import FilterPresenter from './presenter/filter';
import TripInfo from './presenter/trip-info';
import PointModel from './model/points';
import FilterModel from './model/filter';
import { render } from './utils/render';
import {
  MenuItem,
  SortType,
  UpdateType,
  FilterType
} from './utils/constants';
import ButtonPresenter from './presenter/button';

const POINTS_COUNT = 15;
const tripPoints = new Array(POINTS_COUNT).fill().map(getTripPointInfo);

const header = document.querySelector('.trip-main');
const headerMenuNavigation = header.querySelector('.trip-controls__navigation');
const headerMenuFilters = header.querySelector('.trip-controls__filters');
const pageBodyContainer = document.querySelector('#body-container');
const mainTripEventsSection = document.querySelector('.trip-events');

const pointModel = new PointModel();
pointModel.setPoints(tripPoints);
const filterModel = new FilterModel();
const tripInfoPresenter = new TripInfo(header, pointModel);
const menuView = new MenuView();
const statsPresenter = new StatsPresenter(pageBodyContainer, pointModel);
const filterPresenter = new FilterPresenter(headerMenuFilters, pointModel, filterModel);
const buttonPresenter = new ButtonPresenter(header, handleButtonClick);
const listPresenter = new ListPresenter(
  mainTripEventsSection,
  pointModel,
  filterModel,
  buttonPresenter,
);

function handleButtonClick() {
  statsPresenter.destroy();
  menuView.setTableLinkActive();
  listPresenter.openAddForm();
  listPresenter.show();
  buttonPresenter.isDisabled();
}

if (pointModel.getPoints().length > 0) {
  tripInfoPresenter.render();
}
buttonPresenter.renderButton();
render(headerMenuNavigation, menuView);
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
menuView.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
listPresenter.renderView();

export default POINTS_COUNT;

// Не отрабатывает кнопка Добавить на пустом листе
// Нет возможности выбора офферов
// Дата окончания может быть меньше даты начала события. 49
