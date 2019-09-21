var express = require('express');
var di4nodejs = require('dependency-injection-4nodejs').DependencyInjection;
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
const Settings = require('./settings/Settings.js');
const settings = new Settings();
global.settings = settings.loadJsonFile(path.resolve(__dirname)+'/application.json', 'utf8');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.listen(process.env.PORT || 8080);

di4nodejs.discover(path.resolve(__dirname), "index.js", app);
