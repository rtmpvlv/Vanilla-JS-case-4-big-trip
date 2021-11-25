/* eslint-disable no-underscore-dangle */
import ButtonView from '../view/button';
import { remove, render, replace } from '../utils/render';

export default class Button {
  constructor(place, callback) {
    this._place = place;
    this._callback = callback;
    this._buttonView = null;
  }

  renderButton() {
    const prevButtonView = this._buttonView;
    this._buttonView = new ButtonView(false);
    this._buttonView.setButtonClickHandler(this._callback);
    if (prevButtonView === null) {
      render(this._place, this._buttonView);
      return;
    }
    replace(this._buttonView, prevButtonView);
    remove(prevButtonView);
  }

  isDisabled() {
    remove(this._buttonView);
    this._buttonView = new ButtonView(true);
    render(this._place, this._buttonView);
  }
}
