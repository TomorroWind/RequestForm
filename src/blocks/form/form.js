/**
 * Class implements logic for request form
 */
export default class Form {
  /**
   *
   * @param {HTMLElement} formElement
   * @param {Function} formSubmitHandler
   * @param {class} formValidatorClass
   * @param {object} customDropDown
   * @param {object} submitButton
   */
  constructor(
    formElement,
    formSubmitHandler,
    formValidatorClass,
    { customDropDownClass, customDropDownConfig },
    { submitButtonClass }
  ) {
    this._formElement = formElement;
    this._onSubmit = formSubmitHandler;
    this._customDropDown = { class: customDropDownClass, config: customDropDownConfig };
    this._submitButton = { class: submitButtonClass };
    this._formValidator = new formValidatorClass(
      formElement,
      this._onFormValid.bind(this),
      this._onFormInvalid.bind(this)
    );
  }

  /**
   * Intitialise and build form elements
   * @returns void
   */
  build() {
    if (!this._formElement) {
      return;
    }

    this._buildCustomDropDown();
    this._buildSubmit();

    this._formValidator.enableValidation();
  }

  /**
   * Create custom select element instead of native
   */
  _buildCustomDropDown() {
    if (this._customDropDown) {
      const selectElements = this._formElement.querySelectorAll('select');
      selectElements.forEach((element) => {
        new this._customDropDown.class(element, this._customDropDown.config).build();
      });
    }
  }

  /**
   * Create and initialize submit button class
   */
  _buildSubmit() {
    const submitElement = this._formElement.querySelector('.form-control__submit');
    this._submitButton.control = new this._submitButton.class(submitElement);
    this._submitButton.control.setStatusReady();

    this._formElement.addEventListener('submit', this._submitHanler.bind(this));
  }

  /**
   * Method is invoked during form validation when form is valid
   */
  _onFormValid() {
    this._submitButton.control.setStatusReady();
  }

  /**
   * Method is invoked during form validation when form is valid
   */
  _onFormInvalid() {
    this._submitButton.control.setStatusWaiting();
  }

  /**
   * Handler for form submit event
   * @param {object} event
   */
  _submitHanler(event) {
    event.preventDefault();

    this._clearError();
    this._submitButton.control.setStatusProcessing();

    this._onSubmit(this._prepareDataToSubmit());
  }

  /**
   * Prepare form entered values to be sent to server
   * @returns object that contains data ready to send to server
   */
  _prepareDataToSubmit() {
    const formData = new FormData(this._formElement);
    const requestData = Object.fromEntries(formData.entries());

    requestData.contactType = requestData.contactType ? requestData.contactType : 0;
    requestData.contact = requestData.contact.trim();
    requestData.scope = requestData.scope ? requestData.scope : 0;
    requestData.name = requestData.name.trim();
    requestData.note = requestData.note.trim();

    return requestData;
  }

  /**
   * Invoked when submit processed succesfully by the server
   * @param {object} data information from server
   */
  onSuccess(data) {
    this._submitButton.control.setStatusProcessed(data);
  }

  /**
   * Invoked when submit failed
   * @param {object} error information from server
   */
  onFail(error) {
    this._submitButton.control.setStatusReady();
    this._setError(error);
  }

  /**
   * Show error on the form
   * @param {object} error information about error
   */
  _setError(error) {
    this._formElement.querySelector('.form-control__submit-error').textContent =
      error?.message && error?.code ? error.message : 'Произошла непредвиденная ошибка';
  }

  /**
   * Clear form error
   */
  _clearError() {
    this._formElement.querySelector('.form-control__submit-error').textContent = '';
  }
}
