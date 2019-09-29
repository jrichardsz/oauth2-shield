var expect = require('chai').expect;
var should = require('chai').should();
var request = require('request');
var randtoken = require('rand-token')

var baseUrl = 'http://localhost:' + process.env.PORT;
var username = process.env.auth_user;
var password = process.env.auth_password;

describe('Endpoints', function() {
  describe('/', function() {
    var url = baseUrl;
    console.log("Testing " + url);
    it('status', function(done) {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it('content', function(done) {
      request(url, function(error, response, body) {
        expect(body).to.equal('Home');
        done();
      });
    });
  });

  describe('/oauth2/client', function() {
    var url = baseUrl + "/oauth2/client";
    url = url.replace("http://", "http://" + username + ":" + password + "@");
    console.log("Testing " + url);

    var requestBody = {
      json: {
        "application_name": "app-" + randtoken.generate(5)
      }
    };

    it('client_id and client_secret', function(done) {
      registerClient(url, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body.client_id).to.not.be.null;
        expect(body.client_secret).to.not.be.null;
        done();
      });
    });
  });

  describe('/oauth2/token', function() {

    var registerClientUrl = baseUrl + "/oauth2/client";
    registerClientUrl = registerClientUrl.replace("http://", "http://" + username + ":" + password + "@");

    var generateTokenUrl = baseUrl + "/oauth2/token";
    console.log("Testing " + generateTokenUrl);

    it('access_token', function(done) {

      registerClient(registerClientUrl, function(registerClientErr, registerClientResponse, registerClientBody) {
        expect(registerClientResponse.statusCode).to.equal(200);
        expect(registerClientBody.client_id).to.not.be.null;
        expect(registerClientBody.client_secret).to.not.be.null;

        generateToken(generateTokenUrl, registerClientBody.client_id, registerClientBody.client_secret,
          function(generateTokenErr, generateTokenResponse, generateTokenBody) {
            expect(generateTokenResponse.statusCode).to.equal(200);
            expect(generateTokenBody.access_token).to.not.be.null;
            done();
          });
      });

    });
  });

  describe('/oauth2/introspect', function() {

    var registerClientUrl = baseUrl + "/oauth2/client";
    registerClientUrl = registerClientUrl.replace("http://", "http://" + username + ":" + password + "@");

    var generateTokenUrl = baseUrl + "/oauth2/token";

    var introspectTokenUrl = baseUrl + "/oauth2/introspect";
    console.log("Testing " + introspectTokenUrl);

    it('token must be active', function(done) {

      registerClient(registerClientUrl, function(registerClientErr, registerClientResponse, registerClientBody) {

        expect(registerClientResponse.statusCode).to.equal(200);
        expect(registerClientBody.client_id).to.not.be.null;
        expect(registerClientBody.client_secret).to.not.be.null;

        generateToken(generateTokenUrl, registerClientBody.client_id, registerClientBody.client_secret,
          function(generateTokenErr, generateTokenResponse, generateTokenBody) {

            introspectToken(introspectTokenUrl, generateTokenBody.access_token,
              function(introspectTokenErr, introspectTokenResponse, introspectTokenBody) {
                expect(introspectTokenResponse.statusCode).to.equal(200);
                expect(introspectTokenBody.active).to.not.be.null;
                should.equal(introspectTokenBody.active, true);
                done();
              });
          });
      });

    });
  });

});

function registerClient(url, callback) {
  var requestBody = {
    json: {
      "application_name": "app-" + randtoken.generate(5)
    }
  };

  request.post(url, requestBody, function(error, response, body) {
    return callback(error, response, body);
  });
}

function generateToken(url, client_id, client_secret, callback) {

  var requestBody = {
    json: {
      "client_id": client_id,
      "client_secret": client_secret
    }
  };

  request.post(url, requestBody, function(error, response, body) {
    return callback(error, response, body);
  });
}

function introspectToken(url, token, callback) {

  var requestBody = {
    json: {
      "token": token
    }
  };

  request.post(url, requestBody, function(error, response, body) {
    return callback(error, response, body);
  });
}
