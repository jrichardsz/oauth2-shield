//@Dependency("TokenService")
function TokenService() {

  var _this = this;

  //@Autowire
  var tokenHelper;

  this.main = function() {

  }

  this.generateTokenFromCredentials = function(client_id,client_secret) {

    //TODO:
    //validate if clientId exist in database and match with clientSecret
    var payload = {
      'client_id': client_id
    }

    return {
      "access_token": _this.tokenHelper.generateJwtToken(payload, settings.tokenSecret, settings.tokenLife),
      "token_type": "bearer",
      "expires_in": settings.tokenLife
    }

  }

  this.introspect = function(token,callback) {
    _this.tokenHelper.introspectToken(token,settings.tokenSecret,callback);
  }

}

module.exports = TokenService;
