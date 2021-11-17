/* eslint-disable prefer-object-spread */
/* eslint-disable no-underscore-dangle */
import AddFormView from '../view/addition-form';
import {
  render,
  remove,
  RenderPosition,
  replace
} from '../utils/render';
import ListItem from '../view/list-item';

export default class AddForm {
  constructor(tripEventsList, changeData) {
    this._tripEventsList = tripEventsList;
    this._changeData = changeData;

    this._listItemView = new ListItem();

    this._keyPressed = this._keyPressed.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  renderAddForm(point) {
    this._point = point;
    this._addFormView = new AddFormView(this._point);
    this._addFormView.setFormSubmitHandler(this._handleFormSubmit);
    document.addEventListener('keydown', this._keyPressed);
    render(this._tripEventsList, this._addFormView, RenderPosition.AFTERBEGIN);
  }

  get id() {
    return this._addFormView.id;
  }

  _keyPressed(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc' || evt.key === 'ArrowUp') {
      evt.preventDefault();
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

  _replaceFormToListItem() {
    replace(this._listItemView, this._addFormView);
    this._destroy();
    document.removeEventListener('keydown', this._keyPressed);
  }
}
