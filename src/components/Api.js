/**
 * Implements API calls
 */
export default class Api {
  /**
   * Class constructor
   * @param {string} baseURL base part of the URL for API
   */
  constructor(baseURL) {
    this._baseURL = baseURL;
  }

  /**
   * Init http headers
   * @returns http headers
   */
  _createDefaultHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Send request data to server
   * @param {object} requestData request form data
   * @returns promise for call
   */
  postRequest(requestData) {
    return fetch(this._baseURL + 'hello.php', {
      headers: this._createDefaultHeaders(),
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }
}
