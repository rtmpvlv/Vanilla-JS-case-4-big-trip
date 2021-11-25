/* eslint-disable prefer-object-spread */
/* eslint-disable no-underscore-dangle */
import AddFormView from '../view/add-form';
import { render, remove, RenderPosition } from '../utils/render';
import { UserAction, UpdateType } from '../utils/constants';
import { getRandomInteger } from '../mock-data/utils-and-const';

export default class AddForm {
  constructor(place, changeData, buttonPresenter) {
    this._place = place;
    this._changeData = changeData;
    this._buttonPresenter = buttonPresenter;

    this._addForm = null;

    this._keyPressed = this._keyPressed.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  renderAddForm() {
    this._addForm = new AddFormView();
    this._addForm.setFormSubmitHandler(this._handleFormSubmit);
    this._addForm.setDeleteClickHandler(this._handleDeleteClick);
    render(this._place, this._addForm, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this._keyPressed);
  }

  destroy() {
    this._buttonPresenter.renderButton();
    if (this._addForm === null) {
      return;
    }
    remove(this._addForm);
    this._addForm = null;
    document.removeEventListener('keydown', this._keyPressed);
  }

  _keyPressed(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc' || evt.key === 'ArrowUp') {
      evt.preventDefault();
      this.destroy();
      document.removeEventListener('keydown', this._keyPressed);
    }
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      Object.assign({ id: getRandomInteger(1, 10000000) }, point),
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }
}
