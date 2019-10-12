var mysql = require('mysql');

//@Dependency("DatabaseConnection")
function DatabaseConnection() {

  var _this = this;
  var dbConfig; // db configurations
  var connection; // This is used as a singleton in a single connection strategy
  var pool; // Pool singleton
  var strategy; // Pool singleton

  this.main = function() {
  }

  this.initializeConnection = function(dbConfig, strategy) {

    if (null == dbConfig) throw new Error('Missing dbConfig module param!');
    if (null == strategy) strategy = 'single';

    _this.strategy = strategy;

    // Setting _this.dbConfig ref
    _this.dbConfig = dbConfig;

    // Configuring strategies
    switch (strategy) {
      case 'single':
        // Creating single connection instance
        _this.connection = mysql.createConnection(dbConfig);
        handleDisconnect(dbConfig);
        break;
      case 'pool':
        // Creating pool instance
        _this.pool = mysql.createPool(dbConfig);
        if(!_this.pool){
          console.error('Database connection is null or wrong');
        }
        console.log('Database connection was established using connection pooling');
        break;
      default:
        throw new Error('Not supported connection strategy!');
    }
  }

  this.getConnection = function(callback) {
    switch (_this.strategy) {
      case 'single':
        // getConnection will return singleton connection
        callback(null, _this.connection);
        break;
      case 'pool':
        // getConnection handled by mysql pool
        _this.pool.getConnection(function(err, connection) {
          if (err) callback(err);
          _this.connection = connection;
          callback(null, _this.connection);
        });
        break;
    }
  }

  this.release = function() {
    switch (_this.strategy) {
      case 'single':
        //do nothing
        break;
      case 'pool':
        _this.connection.release();
        break;
    }
  }

  /**
   * Handling connection disconnects, as defined here: https://github.com/felixge/node-mysql
   */
  function handleDisconnect() {

    // Recreate the connection, since the old one cannot be reused
    _this.connection = mysql.createConnection(_this.dbConfig);

    _this.connection.connect(function(err) {
      // The server is either down or restarting (takes a while sometimes).
      if (err) {
        console.error('error when connecting to db:', err);
        // We introduce a delay before attempting to reconnect,
        // to avoid a hot loop, and to allow our node script to
        // process asynchronous requests in the meantime.
        // If you're also serving http, display a 503 error.
        setTimeout(handleDisconnect, 2000);
      }else{
        console.log('Database connection was established managing connections one-by-one');
      }
    });

    _this.connection.on('error', function(err) {
      console.log('db error', err);
      // Connection to the MySQL server is usually
      // lost due to either server restart, or a
      // connnection idle timeout (the wait_timeout
      // server variable configures this)
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        handleDisconnect();
      } else {
        throw err;
      }
    });
  }

}


module.exports = DatabaseConnection;
