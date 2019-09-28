const uuidv1 = require('uuid/v1');
const jwt = require('jsonwebtoken')
var randtoken = require('rand-token')

//@Dependency("TokenHelper")
function TokenHelper() {

  var _this = this;

  this.main = function() {

  }

  this.registerClient = function() {
    return {
      "client_id": randtoken.generate(32) + ".app.com",
      "client_secret": randtoken.generate(32)
    };
  }

  this.generateJwtToken = function(payload, secret, tokenLife) {

    if (tokenLife) {
      return jwt.sign(payload, secret, {
        expiresIn: tokenLife
      });
    } else {
      return jwt.sign(subject, secret)
    }
  }

  /*https://www.epochconverter.com/*/
  this.introspectToken = function(token, secret, callback) {

    // verifies secret and checks exp
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        if (err.name == "TokenExpiredError") {
          return callback("Token has expired.", null);
        } else if (err.name == "JsonWebTokenError") {
          return callback("Invalid token.", null);
        } else {
          console.log(err);
          return callback("Internal error.", null);
        }
      }
      var current_time = new Date().getTime() / 1000;
      var remainig = Math.floor(decoded.exp - current_time);
      decoded.active = true;
      decoded.remaining_time = remainig;
      return callback(null, decoded)
    });

  }

  function getRandom(blocks) {
    var random = "";
    for (var a = 0; a < blocks; a++) {
      random += Math.random().toString(36).slice(2);
    }
    return random;
  }

}

module.exports = TokenHelper;
