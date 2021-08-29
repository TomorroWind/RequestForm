/**
 * Class implement form validation logic
 */
export default class FormValidator {
  /**
   *
   * @param {HTMLElement} formElement form HTML element
   * @param {function} onFormValid call back when form is valid
   * @param {function} onFormInvalid call back when form data is invalid
   */
  constructor(formElement, onFormValid, onFormInvalid) {
    this._formElement = formElement;
    this._onFormValid = onFormValid;
    this._onFormInvalid = onFormInvalid;
  }

  /**
   * Intitialize event handler for from validation
   */
  enableValidation() {
    this._validatableElements().forEach((element) =>
      element.addEventListener('input', this._checkInputValidity.bind(this))
    );

    this._updateForm();
  }

  /**
   * List of validatable form elements
   * @returns element that can be validated
   */
  _validatableElements() {
    return Array.from(this._formElement.elements).filter(
      (element) => element.type === 'text' || element.type === 'select-one' || element.type === 'textarea'
    );
  }

  /**
   * Check that element is valid
   * @param {object} event event data
   */
  _checkInputValidity(event) {
    if (!event.target.validity.valid) {
      this._showInputError(event.target, event.target.validationMessage);
    } else {
      this._hideInputError(event.target);
    }

    this._updateForm();
  }

  /**
   * Call form call backs
   */
  _updateForm() {
    if (this.hasInvalid()) {
      this._onFormInvalid();
    } else {
      this._onFormValid();
    }
  }

  /**
   * Returns validity state of the form
   * @returns True if form has invalid data
   */
  hasInvalid() {
    return this._validatableElements().some((element) => !element.validity.valid);
  }

  /**
   * Clear and hide error html element
   * @param {HTMLElement} validatableElement validatable element
   */
  _hideInputError(validatableElement) {
    const errorElement = this._formElement.querySelector(`#${validatableElement.id}-error`);
    errorElement.classList.remove('form-control__error_visible');
    errorElement.textContent = '';
  }

  /**
   * Init and show error HTML element
   * @param {HTMLElement} validatableElement validatable element
   * @param {string} errorMessage error message
   */
  _showInputError(validatableElement, errorMessage) {
    const errorElement = this._formElement.querySelector(`#${validatableElement.id}-error`);
    errorElement.textContent = errorMessage;
    errorElement.classList.add('form-control__error_visible');
  }
}
