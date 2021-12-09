/* eslint-disable prefer-object-spread */
/* eslint-disable no-underscore-dangle */
import AddFormView from '../view/add-form';
import { render, remove, RenderPosition } from '../utils/render';
import { UserAction, UpdateType } from '../utils/constants';
import toast from '../utils/toast';

export default class AddForm {
  constructor(place, changeData, buttonPresenter, offersModel, destinationsModel) {
    this._place = place;
    this._changeData = changeData;
    this._buttonPresenter = buttonPresenter;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._addFormElement = null;

    this._keyPressed = this._keyPressed.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  renderAddForm() {
    this._addFormElement = new AddFormView(this._offersModel, this._destinationsModel);
    this._addFormElement.setFormSubmitHandler(this._handleFormSubmit);
    this._addFormElement.setDeleteClickHandler(this._handleDeleteClick);
    render(this._place, this._addFormElement, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this._keyPressed);
  }

  destroy() {
    this._buttonPresenter.renderButton();
    if (this._addFormElement === null) {
      return;
    }
    remove(this._addFormElement);
    this._addFormElement = null;
    document.removeEventListener('keydown', this._keyPressed);
  }

  setSaving() {
    this._addFormElement.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._addFormElement.updateData({
        isDisabled: false,
        isSaving: false,
      });
    };

    this._addFormElement.shake(resetFormState);
  }

  _keyPressed(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc' || evt.key === 'ArrowUp') {
      evt.preventDefault();
      this.destroy();
      document.removeEventListener('keydown', this._keyPressed);
    }
  }

  _handleFormSubmit(point) {
    if (!window.navigator.onLine) {
      toast('Can\'t create new point offline.');
    }
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  _handleDeleteClick() {
    this.destroy();
  }
}
