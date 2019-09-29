var isString = require('lodash.isstring');

//@Dependency("IntrospectService")
function IntrospectService() {

  var _this = this;

  //@Autowire
  var clientRepository;

  //@Autowire
  var objectUtils;

  //@Autowire
  var tokenHelper;

  this.main = function() {}

  this.introspect = function(req, res) {

    var schema = {
      token: {
        isValid: isString,
        message: '[token] must be a valid string'
      }
    };

    try {
      _this.objectUtils.validate(schema, req.body, false);
    } catch (err) {
      console.log(err);
      res.json({
        "active": false
      });
      return;
    }

    _this.tokenHelper.introspectToken(req.body.token, settings.tokenSecret, function(err, decoded) {
      if (err) {
        console.log(err);
        res.json({
          "active": false
        });
      } else {
        res.json(decoded);
      }
    });
  }

}

module.exports = IntrospectService;
