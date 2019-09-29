//@Dependency("Routes")
function Routes() {

  var _this = this;

  //@Autowire
  var express;

  //@Autowire
  var clientService;

  //@Autowire
  var tokenService;

  //@Autowire
  var basicAuthenticationMiddleware;

  //@Autowire
  var introspectService;

  //@Autowire
  var nonSpecIntrospectService;

  this.main = function() {

    _this.express.get('/', function(req, res) {
      res.type('text/plain');
      res.send('Home');
    });

    /*TODO: Move to service*/
    _this.express.post('/oauth2/client',
      _this.basicAuthenticationMiddleware.preAuthorize(),
      function(req, res) {
        _this.clientService.regiterClient(req.body, function(err, credentials) {
          if (err) {
            console.log(err.message || err);
            res.status(400);
            res.json({
              "message": err.message || err
            });
            return;
          }
          res.json(credentials);
        });

      });

    /*TODO: Move to service*/
    _this.express.post('/oauth2/token', function(req, res) {

      _this.tokenService.generateTokenFromCredentialsAsync(req.body, function(err, tokenData) {
        if (err) {
          console.log(err.message || err);
          res.status(400);
          res.json({
            "message": err.message || err
          });
          return;
        }

        res.json(tokenData);
      });
    });

    _this.express.post('/oauth2/introspect', function(req, res) {
      _this.introspectService.introspect(req,res);
    });

    /*
    NONSPEC
    input: Authorization header instead token in body as spec says
    output: Same as spec with few modifications: error has not 200 status, instead has
    specific error codes like 400, 401, etc
    */
    _this.express.post('/oauth2/nonspec/introspect/v1', function(req, res) {
      _this.nonSpecIntrospectService.introspectV1(req,res);
    });
  }

}

module.exports = Routes;
