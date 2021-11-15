/* eslint-disable prefer-object-spread */
/* eslint-disable no-underscore-dangle */
import EditFormView from '../view/edition-form';
import ListItemView from '../view/list-item';
import { render, replace, remove } from '../utils/render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class TripEventsListItem {
  constructor(tripEventsList, changeData, changeMode) {
    this._tripEventsList = tripEventsList;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._listItemView = null;
    this._editFormView = null;
    this._mode = Mode.DEFAULT;

    this._replaceListItemToForm = this._replaceListItemToForm.bind(this);
    this._replaceFormToListItem = this._replaceFormToListItem.bind(this);
    this._keyPressed = this._keyPressed.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  renderListItem(point) {
    this._point = point;
    const prevListItem = this._listItemView;
    const prevEditFrom = this._editFormView;
    this._listItemView = new ListItemView(this._point);
    this._editFormView = new EditFormView(this._point);

    this._listItemView.setEditClickHandler(this._replaceListItemToForm);
    this._listItemView.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editFormView.setEditClickHandler(this._replaceFormToListItem);
    this._editFormView.setFormSubmitHandler(this._handleFormSubmit);

    if (prevListItem === null || prevEditFrom === null) {
      render(this._tripEventsList, this._listItemView);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._listItemView, prevListItem);
    } else if (this._mode === Mode.EDITING) {
      replace(this._editFormView, prevEditFrom);
    }

    remove(prevListItem);
    remove(prevEditFrom);
  }

  _replaceListItemToForm() {
    replace(this._editFormView, this._listItemView);
    document.addEventListener('keydown', this._keyPressed);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToListItem() {
    this._editFormView.reset(this._point);
    replace(this._listItemView, this._editFormView);
    document.removeEventListener('keydown', this._keyPressed);
    this._mode = Mode.DEFAULT;
  }

  _keyPressed(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc' || evt.key === 'ArrowUp') {
      evt.preventDefault();
      this._editFormView.reset(this._point);
      this._replaceFormToListItem();
      document.removeEventListener('keydown', this._keyPressed);
    }
  }

  _destroy() {
    remove(this._listItemView);
    remove(this._editFormView);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToListItem();
    }
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }

  _handleFormSubmit(point) {
    this._changeData(point);
    this._replaceFormToListItem();
  }
}
