var isString = require('lodash.isstring');
const auth = require('http-auth');

//@Dependency("BasicAuthenticationMiddleware")
function BasicAuthenticationMiddleware() {

  var _this = this;

  //@Autowire
  var objectUtils;

  var authMiddleware;

  this.main = function() {

    var schema = {
      username: { isValid: isString, message: '[username] must be a valid string. Did you exported the auth_user environment variable?' },
      password: { isValid: isString, message: '[password] must be a valid string. Did you exported the auth_user auth_password variable?' }
    };

    _this.objectUtils.validate(schema, {
      "username":settings.authUser,
      "password":settings.authPassword
    }, false);

    // Configure basic auth
    var basic = auth.basic({
        realm: settings.authRealm
    }, function(username, password, callback) {
        callback(username == settings.authUser && password == settings.authPassword);
    });

    // Create middleware that can be used to protect routes with basic auth
    _this.authMiddleware = auth.connect(basic);
  }

  this.preAuthorize = function() {
    return _this.authMiddleware;
  }
}

module.exports = BasicAuthenticationMiddleware;
