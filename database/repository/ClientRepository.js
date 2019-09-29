//@Dependency("ClientRepository")
function ClientRepository() {

  var _this = this;

  this.main = function() {}

  //@Autowire
  var databaseConnection;

  this.findOneByApplicationName = function(application_name, callback) {
    _this.databaseConnection.getConnection(function(err, connection) {
      var sql = 'select * from client where application_name = ?';
      var parameters = [application_name];
      console.log(sql);
      console.log(parameters);
      connection.query(sql, parameters,
        function(findOneByApplicationNameErr, findOneByApplicationNameResult) {
          if (findOneByApplicationNameErr) {
            callback(findOneByApplicationNameErr, null);
          }

          if (findOneByApplicationNameResult.length > 1) {
            callback("More than one row was found for application_name:" + application_name, null);
          } else {
            callback(null, findOneByApplicationNameResult[0]);
          }

        });
    });
  }

  this.findOneByClientId = function(client_id, callback) {
    _this.databaseConnection.getConnection(function(err, connection) {
      var sql = 'select * from client where client_id = ?';
      var parameters = [client_id];
      console.log(sql);
      console.log(parameters);
      connection.query(sql, parameters,
        function(findOneByClientIdErr, findOneByClientIdResult) {
          if (findOneByClientIdErr) {
            callback(findOneByClientIdErr, null);
          }

          if (findOneByClientIdResult.length > 1) {
            callback("More than one row was found for client_id:" + client_id, null);
          } else {
            callback(null, findOneByClientIdResult);
          }

        });
    });
  }

  this.save = function(entity, callback) {
    _this.databaseConnection.getConnection(function(err, connection) {
      if (entity.id) {
        console.log("Update action")
        var columns = [];
        var params = [];
        for (key in entity) {
          if (entity[key]) {
            if (key != "id") {
              columns.push(key + "=?");
              params.push(entity[key]);
            }
          }
        }

        params.push(entity.id);

        // update statment
        var sql = `UPDATE client
                   SET @columns
                   WHERE id = ?`;

        sql = sql.replace("@columns", columns.toString());
        console.log(sql);

        connection.query(sql, params, function(errUpdate, result) {
          callback(errUpdate, result);
        });

      } else {
        console.log("Insert action")
        var values = [];
        var columns = [];
        var jokers = [];
        for (key in entity) {
          if (key != "id") {
            values.push(entity[key]);
            columns.push(key);
            jokers.push("?");
          }
        }

        var sql = `INSERT INTO client
                   (@columns)
                   VALUES(@jokers)`;
        sql = sql.replace("@columns", columns.toString());
        sql = sql.replace("@jokers", jokers.toString());

        connection.query(sql, values, function(errInsert, result) {
          callback(errInsert, result);
        });
      }
    });
  }

  this.logicDelete = function(id, callback) {
    databaseConnection.getConnection(function(err, connection) {
      // just turn delete column to 'Y'
      var sql = `UPDATE application
                 SET deleted = 'Y'
                 WHERE id = ?`;
      connection.query(sql, [id], function(errDelete, result) {
        callback(errDelete, result);
      });
    });
  }

}


module.exports = ClientRepository;
