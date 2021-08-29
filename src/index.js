import './index.css';
import { DropDownControl, SubmitButtonControl } from './blocks/form-control/form-control';
import Form from './blocks/form/form';
import Api from './components/Api';
import { apiBaseURL } from './configs/config';
import FormValidator from './components/FormValidator';

(function IIFE() {
  function formSubmitHandler(requestData) {
    new Api(apiBaseURL)
      .postRequest(requestData)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject({ message: 'Сервер временно не доступен!' });
        }
      })
      .then((jsonReponse) => {
        if (jsonReponse.code) {
          return Promise.reject(jsonReponse);
        } else {
          return form.onSuccess(jsonReponse);
        }
      })
      .catch((err) => {
        form.onFail(err);
      });
  }

  function contactTypeInputHandler(event) {
    const contactElement = document.getElementById('contact');

    switch (event.target.value) {
      case '1':
        contactElement.placeholder = 'mail@example.com';
        break;

      case '2':
        contactElement.placeholder = 'https://vk.com/username';
        break;

      case '3':
        contactElement.placeholder = 'https://www.facebook.com/username';
        break;

      case '4':
        contactElement.placeholder = '@nickname';
        break;
    }
  }

  const dropDownControlConfig = {
    customControlTemplate: 'custom-drop-down-template',
    customItemTemplate: 'custom-drop-down-item-template',
  };

  const formElement = document.querySelector('.form');
  const contactTypeElement = document.getElementById('contact-type');

  const form = new Form(
    formElement,
    formSubmitHandler,
    FormValidator,
    {
      customDropDownClass: DropDownControl,
      customDropDownConfig: dropDownControlConfig,
    },
    {
      submitButtonClass: SubmitButtonControl,
    }
  );

  form.build();

  contactTypeElement.addEventListener('input', contactTypeInputHandler);
})();
