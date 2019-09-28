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

  this.main = function() {

    _this.express.get('/', function(req, res) {
      res.type('text/plain');
      res.send('Home');
    });

    _this.express.post('/oauth2/credentials',
      function(req, res) {
        _this.clientService.registerClient(req.body, function(err, credentials) {
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
      _this.tokenService.introspect(req.body.token, function(err, decoded) {
        if (err) {
          console.log(err);
          res.json({
            "active": false
          });
        } else {
          res.json(decoded);
        }
      });
    });
  }

}

module.exports = Routes;
