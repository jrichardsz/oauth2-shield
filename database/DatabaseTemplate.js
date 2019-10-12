//@Dependency("DatabaseTemplate")
function DatabaseTemplate() {

  var _this = this;

  //@Autowire
  var databaseConnection;

  this.main = function() {
    var strategy;
    if(!settings.databaseConnectionManagemet || settings.databaseConnectionManagemet==""){
      console.log("Database connection management strategy was not found");
      console.log("Using default database connection management strategy: single");
      strategy = 'single';
    }else if(settings.databaseConnectionManagemet=="pool"){
      strategy = 'pool';
      if(!settings.databaseConnectionPoolLimit){
        console.log("Required parameter for database connection pool was not found : databaseConnectionPoolLimit");
        console.log("Using default database connection limmit : 25");
        settings.databaseConnectionPoolLimit = 25;
      }else{
        settings.databaseConnectionPoolLimit = new Number(settings.databaseConnectionPoolLimit);
      }
    }else{
      console.log("Unknown database connection management strategy:"+settings.databaseConnectionManagemet);
      console.log("Using default database connection management strategy: single");
      strategy = 'single';
    }

    _this.databaseConnection.initializeConnection({
      host: settings.databaseHost, // your mysql host, ip or public domain
      user: settings.databaseUser, // your mysql user
      password: settings.databasePassword, // your mysql password
      port: parseInt(settings.databasePort, 10), //port mysql
      database: settings.databaseName, // your database name
      connectionLimit : settings.databaseConnectionPoolLimit
    },strategy);
  }

  this.validate = function(callback) {
    _this.databaseConnection.getConnection(function(err, connection) {
      connection.query('select 1 from dual', function(validateErr, rows) {
        connection.release();
        callback(validateErr, rows);
      });
    });
  }

}

module.exports = DatabaseTemplate;
