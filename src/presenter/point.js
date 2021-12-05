/* eslint-disable prefer-object-spread */
/* eslint-disable no-underscore-dangle */
import EditFormView from '../view/edit-form';
import ListItemView from '../view/list-item';
import { render, replace, remove } from '../utils/render';
import { UserAction, UpdateType } from '../utils/constants';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class TripEventsListItem {
  constructor(tripEventsList, changeData, changeMode, offersModel, destinationsModel) {
    this._tripEventsList = tripEventsList;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._listItemElement = null;
    this._editFormElement = null;
    this._mode = Mode.DEFAULT;

    this._replaceListItemToForm = this._replaceListItemToForm.bind(this);
    this._replaceFormToListItem = this._replaceFormToListItem.bind(this);
    this._keyPressed = this._keyPressed.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  renderListItem(point) {
    this._point = point;
    const prevListItem = this._listItemElement;
    const prevEditFrom = this._editFormElement;
    this._listItemElement = new ListItemView(this._point);
    this._editFormElement = new EditFormView(
      this._offersModel,
      this._destinationsModel,
      this._point,
    );

    this._listItemElement.setEditClickHandler(this._replaceListItemToForm);
    this._listItemElement.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editFormElement.setEditClickHandler(this._replaceFormToListItem);
    this._editFormElement.setFormSubmitHandler(this._handleFormSubmit);
    this._editFormElement.setDeleteClickHandler(this._handleDeleteClick);

    if (prevListItem === null || prevEditFrom === null) {
      render(this._tripEventsList, this._listItemElement);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._listItemElement, prevListItem);
      return;
    }

    if (this._mode === Mode.EDITING) {
      replace(this._listItemElement, prevEditFrom);
      this._mode = Mode.DEFAULT;
      return;
    }

    remove(prevListItem);
    remove(prevEditFrom);
  }

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._editFormElement.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._editFormElement.updateData({
          isDisabled: true,
          isSaving: true,
          isDeleting: false,
        });
        break;
      case State.DELETING:
        this._editFormElement.updateData({
          isDisabled: true,
          isSaving: false,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._listItemElement.shake(resetFormState);
        this._editFormElement.shake(resetFormState);
        break;
      default:
        throw new Error('Unexpected point state.');
    }
  }

  _replaceListItemToForm() {
    replace(this._editFormElement, this._listItemElement);
    document.addEventListener('keydown', this._keyPressed);
    this._changeMode(); // ?
    this._mode = Mode.EDITING;
  }

  _replaceFormToListItem() {
    this._editFormElement.reset(this._point);
    replace(this._listItemElement, this._editFormElement);
    document.removeEventListener('keydown', this._keyPressed);
    this._mode = Mode.DEFAULT;
  }

  _keyPressed(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc' || evt.key === 'ArrowUp') {
      evt.preventDefault();
      this._replaceFormToListItem();
      document.removeEventListener('keydown', this._keyPressed);
    }
  }

  _destroy() {
    remove(this._listItemElement);
    remove(this._editFormElement);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToListItem();
    }
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }

  _handleFormSubmit(update) {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      update,
    );
  }

  _handleDeleteClick(point) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }
}
