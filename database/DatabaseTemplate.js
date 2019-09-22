//@Dependency("DatabaseTemplate")
function DatabaseTemplate() {

  var _this = this;

  //@Autowire
  var databaseConnection;

  this.main = function() {
    _this.databaseConnection.initializeConnection({
      host: settings.host, // your mysql host, ip or public domain
      user: settings.user, // your mysql user
      password: settings.password, // your mysql password
      port: parseInt(settings.port, 10), //port mysql
      database: settings.name // your database name
    }, 'single');
  }

  this.validate = function(callback) {
    _this.databaseConnection.getConnection(function(err, connection) {
      connection.query('select 1 from dual', function(validateErr, rows) {
        callback(validateErr, rows);
      });
    });
  }

}

module.exports = DatabaseTemplate;
