//@Dependency("NonSpecIntrospectService")
function NonSpecIntrospectService() {

  var _this = this;

  //@Autowire
  var tokenHelper;

  //@Autowire
  var clientRepository;


  this.main = function() {}

  this.introspectV1 = function(req, res) {

    if (!req.headers.authorization) {
      res.status(400).json({
        "active": false,
        "message": 'Authorization header value is required'
      });
      return;
    }

    let authorization = req.headers.authorization;
    let token = authorization.replace('Bearer ', '');

    _this.tokenHelper.introspectToken(token, settings.tokenSecret, function(err, decoded) {
      if (err) {
        console.log(err);
        res.status(401);
        res.json({
          "active": false,
          "message": err
        });
      } else {

        //validate client id existence
        _this.clientRepository.findOneByClientId(decoded.client_id, function(findOneByClientIdErr, findOneByClientIdResults) {
          if (findOneByClientIdErr) {
            console.log(findOneByClientIdErr);
            res.status(401);
            res.json({
              "active": false,
              "message": "An internal error occurred when client_id was being validated."
            });
            return;
          }

          if (findOneByClientIdResults.length == 0) {
            console.log("Unknown client_id or was deleted");
            res.status(401);
            res.json({
              "active": false,
              "message": "Unknown client_id or was deleted"
            });
            return;
          }

          //all validations was completed
          res.json(decoded);

        });


      }
    });
  }

}

module.exports = NonSpecIntrospectService;
