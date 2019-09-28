var isString = require('lodash.isstring');
const bcrypt = require('bcrypt');

//@Dependency("ClientService")
function ClientService() {

  var _this = this;

  //@Autowire
  var tokenHelper;

  //@Autowire
  var clientRepository;

  //@Autowire
  var objectUtils;

  var saltRoundsGenerationNumber = 10;

  this.main = function() {}

  this.registerClient = function(parameters, callback) {

    var schema = {
      application_name: { isValid: isString, message: '[application_name] must be a valid string' },
      description: { isValid: isString, message: '[description] must be a valid string' }
    };

    try{
      _this.objectUtils.validate(schema, parameters, false);
    }catch(err){
      return callback(err,null);
    }

    _this.clientRepository.findOneByApplicationName(parameters.application_name,
      function(findOneByApplicationNameErr, findOneByApplicationNameResult){
        if(findOneByApplicationNameErr){
          return callback(findOneByApplicationNameErr,null);
        }

        if(findOneByApplicationNameResult || typeof findOneByApplicationNameResult !== 'undefined'){
          return callback("An application is already registered whit this name: "+parameters.application_name,null);
        }

        var credentials = _this.tokenHelper.generateSecrets();

        var plainClientSecret = credentials.clientSecret;

        bcrypt.hash(plainClientSecret, saltRoundsGenerationNumber, function(errCrypt, hash) {

          if(errCrypt){
            console.log(errCrypt);
            return callback("An error occurred when the credential was being generated ",null);
          }

          var entity = parameters;
          entity.client_id = credentials.clientId;
          entity.client_secret = hash;

          _this.clientRepository.save(entity, function(errInsert, result){
            if(errInsert){
              console.log(errInsert);
              return callback("An error occurred when the credential was being saved",null);
            }

            return callback(null, credentials);
          })

        });
    });
  }

}

module.exports = ClientService;
