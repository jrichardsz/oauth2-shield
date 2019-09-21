//@Dependency("CredentialService")
function CredentialService() {

  var _this = this;

  //@Autowire
  var tokenHelper;

  this.main = function() {

  }

  this.generateSecrets = function() {
    //TODO:
    //persist id and secret
    return _this.tokenHelper.generateSecrets();
  }

}

module.exports = CredentialService;
