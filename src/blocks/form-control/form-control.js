/**
 * Represent custom drop down control.
 * Implement requred logic: building html tags, set evevent handlers, binds with native element and etc
 */
export class DropDownControl {
  /**
   *
   * @param {HTMLElement} nativeControl native selecte HTML element
   * @param {object} customControlConfig configuration for custom control
   */
  constructor(nativeControl, { customControlTemplate, customItemTemplate }) {
    this._nativeControl = nativeControl;
    this._customControlTemplate = customControlTemplate;
    this._customItemTemplate = customItemTemplate;
    this.isOpen = false;
  }

  /**
   * Set selected value
   * @param {number} index selected option index
   * @returns void
   */
  select(index) {
    if (!this._nativeControl) {
      return;
    }

    this._nativeControl.selectedIndex = index;

    const currentValue = this._customControl.querySelector('.form-control__select-custom-current');

    currentValue.textContent = this._nativeControl.options[index].text;

    if (index) {
      currentValue.classList.add('form-control__select-custom-current_selected');
    } else {
      currentValue.classList.remove('form-control__select-custom-current_selected');
    }

    const event = document.createEvent('HTMLEvents');
    event.initEvent('input', true, false);
    event.skipUpdateCustom = true;
    this._nativeControl.dispatchEvent(event);
  }

  /**
   * Updates data from native control in custom
   */
  refresh() {
    const currentValue = this._customControl.querySelector('.form-control__select-custom-current');
    currentValue.textContent = this._nativeControl.options[this._nativeControl.selectedIndex].text;

    if (this._nativeControl.selectedIndex) {
      currentValue.classList.add('form-control__select-custom-current_selected');
    } else {
      currentValue.classList.remove('form-control__select-custom-current_selected');
    }
  }

  /**
   * Handler for input event
   * @param {object} event event data
   */
  _inputHandler(event) {
    if (!event.skipUpdateCustom) {
      this.refresh();
    }
  }

  /**
   * Builds custom control based on native html element
   * @returns void
   */
  build() {
    if (!this._nativeControl) {
      return;
    }

    this._nativeControl.addEventListener('input', this._inputHandler.bind(this));

    const customControl = document.getElementById(this._customControlTemplate).content.cloneNode(true);
    const itemList = customControl.querySelector('.form-control__select-custom-items');

    this._customControl = customControl.querySelector('.form-control__select-custom ');

    this._initCurrentControl(customControl);
    this._buildCustomOptions(itemList);

    this._insertCustomControl(customControl);
  }

  /**
   * Create and initialize current(selected) value element
   * @param {HTMLElement} customControl custom control html element
   * @returns void
   */
  _initCurrentControl(customControl) {
    const currentValue = customControl.querySelector('.form-control__select-custom-current');
    currentValue.textContent = this._nativeControl.options[this._nativeControl.selectedIndex].text;

    currentValue.addEventListener('click', this._currentClickHandler.bind(this));

    document.addEventListener('click', this._documentClickHandler.bind(this));
    document.addEventListener('keydown', this._documentEscapeHandler.bind(this));

    return currentValue;
  }

  /**
   * Opens drop down list of options
   */
  openSelection() {
    const itemList = this._customControl.querySelector('.form-control__select-custom-items');
    itemList.classList.add('form-control__select-custom-items_opened');

    const currentSelection = this._customControl.querySelector('.form-control__select-custom-current');

    currentSelection.classList.add('form-control__select-custom-current_opened');

    this.isOpen = true;
  }

  /**
   * Closes drop down list
   */
  closeSelection() {
    const itemList = this._customControl.querySelector('.form-control__select-custom-items');
    itemList.classList.remove('form-control__select-custom-items_opened');

    const currentSelection = this._customControl.querySelector('.form-control__select-custom-current');

    currentSelection.classList.remove('form-control__select-custom-current_opened');

    this.isOpen = false;
  }

  /**
   * Handler for click event on current (selected) value element
   * @param {obj} event event data
   */
  _currentClickHandler(event) {
    event.stopPropagation();

    if (this.isOpen) {
      this.closeSelection();
    } else {
      this.openSelection();
    }
  }

  /**
   * Handler for click event on option element
   * @param {obj} event data event
   */
  _optionClickHandler(event) {
    this.closeSelection();

    this.select(event.target.dataset.index);
  }

  /**
   * Createa and add to custom container options from native element
   * @param {object} customOptionList container for options
   */
  _buildCustomOptions(customOptionList) {
    for (let optionIndex = 0; optionIndex < this._nativeControl.options.length; optionIndex++) {
      const option = this._nativeControl.options[optionIndex];

      if (option.index === this._nativeControl.selectedIndex) {
        continue;
      }

      const newOption = this._initCustomOption(option);

      customOptionList.appendChild(newOption);
    }
  }

  /**
   * Inititalize custom option from native option
   * @param {HTMLElement} nativeOption option from native select elemet
   * @returns custom option
   */
  _initCustomOption(nativeOption) {
    const customOption = document.getElementById(this._customItemTemplate).content.cloneNode(true);

    const item = customOption.querySelector('.form-control__select-custom-item');
    item.textContent = nativeOption.text;
    item.dataset.index = nativeOption.index;

    item.addEventListener('click', this._optionClickHandler.bind(this));
    return customOption;
  }

  /**
   * Insert custom element into DOM
   * @param {HTMLElement} newCustomControl custom drop down control
   */
  _insertCustomControl(newCustomControl) {
    this._nativeControl.after(newCustomControl);
  }

  /**
   * Handler for click event on document
   */
  _documentClickHandler() {
    if (this.isOpen) {
      this.closeSelection();
    }
  }

  /**
   * Handler for key Escape on document
   * @param {object} event event data
   */
  _documentEscapeHandler(event) {
    if (event.key === 'Escape' && this.isOpen) {
      this.closeSelection();
    }
  }
}

/**
 * Represent submit button
 * Keep related logic
 */
export class SubmitButtonControl {
  /**
   * Class constructor
   * @param {HTMLElement} buttonElement submit button HTML element
   */
  constructor(buttonElement) {
    this._buttonElement = buttonElement;
  }

  /**
   * Clear button mods
   */
  _clearState() {
    this._buttonElement.classList.remove('form-control__submit_state_disabled');
    this._buttonElement.classList.remove('form-control__submit_state_processed');
  }

  /**
   * Set button to ready state
   */
  setStatusReady() {
    this._clearState();

    this._buttonElement.textContent = 'Отправить';
  }

  /**
   * Set button to process state
   */
  setStatusProcessing() {
    this._clearState();

    this._buttonElement.textContent = 'Отправляется...';
    this._buttonElement.classList.add('form-control__submit_state_disabled');
  }

  /**
   * Set button to waiting state
   */
  setStatusWaiting() {
    this._clearState();

    this._buttonElement.textContent = 'Отправить';
    this._buttonElement.classList.add('form-control__submit_state_disabled');
  }

  /**
   * Set button to processed state
   * @param {object} data processed data
   */
  setStatusProcessed(data) {
    this._clearState();

    this._buttonElement.textContent = data?.message ? data?.message : 'Заявка  успешно отправлена!';
    this._buttonElement.classList.add('form-control__submit_state_processed');
  }
}
