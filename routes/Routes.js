//@Dependency("Routes")
function Routes() {

  var _this = this;

  //@Autowire
  var express;

  //@Autowire
  var credentialService;

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
      _this.basicAuthenticationMiddleware.preAuthorize(),
      function(req, res) {
        _this.credentialService.generateSecretsAsync(req.body, function(err, credentials) {
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

    _this.express.post('/oauth2/validate', function(req, res) {
      if (!req.headers.authorization) {
        return res.status(403).json({ error: 'No credentials sent!' });
      }
      let authorization = req.headers.authorization;
      let token = authorization.replace('Bearer ', '');
      _this.tokenService.introspect(token, function(err, decoded) {
        if (err) {
          console.log(err);
          res.status(401);
          res.json({
            active: false
          });
        } else {
          res.status(200);
          res.json({
            active: true
          });
        }
      });
    });

  }

}

module.exports = Routes;
