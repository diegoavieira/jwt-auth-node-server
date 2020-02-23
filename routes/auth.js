const { authController } = require('../controllers');
const { wrapAsync } = require('../shared');

module.exports = (app, auth) => {
  app.route('/auth/login').post(wrapAsync(authController.login));
  app.route('/auth/logout').post(auth, wrapAsync(authController.logout));
};
