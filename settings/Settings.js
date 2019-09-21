var fs = require('fs');

function Settings() {

  function parseJsonValues(obj) {
    for (var k in obj) {
      if (typeof obj[k] === 'object' && obj[k] !== null) {
        parseObjectProperties(obj[k])
      } else if (obj.hasOwnProperty(k)) {
        var configInitialValue = "" + obj[k];
        if (configInitialValue.startsWith("${") && configInitialValue.endsWith("}")) {
          var configInitialValue = "" + obj[k];
          var environmentKey = configInitialValue.replace("${", "").replace("}", "");
          var finalValue = process.env[environmentKey];
          if (finalValue) {
            obj[k] = finalValue;
          }else {
            obj[k] = null;
          }
        }
      }
    }
  }

  this.loadJsonFile = function(jsonFileLocation,charset) {
    var rawApplicationJson = fs.readFileSync(jsonFileLocation, charset);
    var jsonObject = JSON.parse(rawApplicationJson);
    parseJsonValues(jsonObject);
    return jsonObject;
  }

}

module.exports = Settings;
