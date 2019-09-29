var isString = require('lodash.isstring');
const bcrypt = require('bcrypt');

//@Dependency("TokenService")
function TokenService() {

  var _this = this;

  //@Autowire
  var tokenHelper;

  //@Autowire
  var objectUtils;

  //@Autowire
  var clientRepository;

  this.main = function() {

  }

  /*
  https://tools.ietf.org/html/rfc6749#page-30
  */
  this.generateTokenFromCredentialsAsync = function(parameters, callback) {

    //TODO:
    //validate if clientId exist in database and match with clientSecret

    var schema = {
      client_id: {
        isValid: isString,
        message: '[client_id] must be a valid string'
      },
      client_secret: {
        isValid: isString,
        message: '[client_secret] must be a valid string'
      },
      grant_type: {
        isValid: isString,
        message: '[grant_type] must be a valid string'
      }
    };

    try {
      _this.objectUtils.validate(schema, parameters, false);
    } catch (err) {
      return callback({
        "code": 400,
        "error": "invalid_request",
        "error_description": err.message || err
      }, null);
    }

    //validate client id existence
    _this.clientRepository.findOneByClientId(parameters.client_id, function(findOneByClientIdErr, findOneByClientIdResults) {
      if (findOneByClientIdErr) {
        console.log(findOneByClientIdErr);
        return callback({
          "code": 500,
          "error": "internal_error",
          "error_description": "An error occurred when client_id was being validated."
        }, null);
      }

      if (findOneByClientIdResults.length == 0) {
        return callback({
          "code": 401,
          "error": "invalid_client",
          "error_description": "Unknown client"
        }, null);
      }

      console.log("Client_was found:" + parameters.client_id);

      bcrypt.compare(parameters.client_secret, findOneByClientIdResults[0].client_secret, function(compareErr, compareResult) {

        if (compareErr) {
          console.log(compareErr);
          return callback({
            "code": 500,
            "error": "internal_error",
            "error_description": "An error occurred when client_id was being validated."
          }, null);
        }

        if (compareResult) {

          var payload = {
            'client_id': parameters.client_id
          }

          return callback(null, {
            "access_token": _this.tokenHelper.generateJwtToken(payload, settings.tokenSecret, settings.tokenLife),
            "token_type": "bearer",
            "expires_in": settings.tokenLife
          });


        } else {
          return callback({
            "code": 401,
            "error": "invalid_client",
            "error_description": "Bad credentials"
          }, null);
        }
      });
    });
  }

}

module.exports = TokenService;
