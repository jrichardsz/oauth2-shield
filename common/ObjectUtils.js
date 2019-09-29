var isPlainObject = require('lodash.isplainobject');

//@Dependency("ObjectUtils")
function ObjectUtils() {

  var _this = this;

  this.main = function() {}

  this.validate = function(schema, parameters, allowUnknown) {
    if (!isPlainObject(parameters)) {
      throw new Error('parameters must be a plain object.');
    }
    Object.keys(parameters)
      .forEach(function(key) {
        var validator = schema[key];
        if (!validator) {
          if (!allowUnknown) {
            throw new Error('[' + key + '] is not allowed as input parameter');
          }
          return;
        }
        if (!validator.isValid(parameters[key])) {
          throw new Error(validator.message);
        }
      });
  }
}

module.exports = ObjectUtils;
