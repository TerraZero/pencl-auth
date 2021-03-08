const Bycript = require('bcryptjs');
const JWT = require('jsonwebtoken');

const ControllerBase = require('pencl-router/src/Controller/ControllerBase');

/**
 * @typedef {Object} AuthControllerConfig
 * @property {Object} tables Define the tables
 * @property {string} tables.user The user table
 * @property {string} tables.login The login table
 */

module.exports = class AuthController extends ControllerBase {

  /**
   * @param {import('../Request/Serve')} serve 
   */
  static async verifyLogin(serve) {
    const token = serve.request.headers['x-access-token'] || serve.GET.params.token || null;

    try {
      const data = await new Promise((resolve, reject) => {
        JWT.verify(token, 'secret_key', (err, decode) => {
          if (err) return reject(err);
          resolve(decode);
        });
      });
      serve.set('auth', data);
    } catch (e) {
      if (e instanceof JWT.JsonWebTokenError) {
        serve.set('auth', false);
      } else {
        throw e; 
      }
    }
    return serve;
  }

  /**
   * @param {import('../Request/Serve')} serve 
   */
  static requireLogin(serve) {
    if (serve.get('auth') === false) {
      return serve.errorForbidden().send();
    }
    return serve;
  }

  /**
   * @param {AuthControllerConfig} config 
   */
  constructor(config) {
    super();
    this._config = config;
    config.tables.
  }

  /**
   * @param {import('../Builder/RouteBuilder')} builder 
   */
  initRoutes(builder) {
    builder.namespace('auth');
    builder.create('login', 'login', this.login, ['auth/require', -10]).checkPOST();
  }

  /**
   * @param {import('../Request/Serve')} serve 
   */
  async login(serve) {
    const data = await serve.getJSON();
    data.hash = await Bycript.hash(data.form.password, 8);

    const token = JWT.sign({id: 1}, 'secret_key', {
      expiresIn: 86400,
    });
    return serve.json({auth: true, token});
  }

}