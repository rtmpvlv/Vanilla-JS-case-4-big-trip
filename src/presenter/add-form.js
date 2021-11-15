/* eslint-disable prefer-object-spread */
/* eslint-disable no-underscore-dangle */
import AddFormView from '../view/addition-form';
import { render, remove, RenderPosition } from '../utils/render';

export default class AddForm {
  constructor(tripEventsList, changeData) {
    this._tripEventsList = tripEventsList;
    this._changeData = changeData;

    this._keyPressed = this._keyPressed.bind(this);
  }

  renderAddForm(point) {
    this._point = point;
    this._addFormView = new AddFormView(this._point);
    this._addFormView.setFormSubmitHandler(this._handleFormSubmit);
    render(this._tripEventsList, this._addFormView, RenderPosition.AFTERBEGIN);
  }

  _keyPressed(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc' || evt.key === 'ArrowUp') {
      evt.preventDefault();
      this._addFormView.reset(this._point);
      this._destroy();
      document.removeEventListener('keydown', this._keyPressed);
    }
  }

  _destroy() {
    remove(this._addFormView);
  }

  _handleFormSubmit(point) {
    this._changeData(point);
    this._replaceFormToListItem();
  }
}
