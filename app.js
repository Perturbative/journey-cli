// A Learning App that allows you to track what you are learning through pings.

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/learningDB');

var db = mongoose.connection;


var dbActions = require('./controllers/user-controller');
var startup = require('./controllers/startup');

// Database Event to Connect
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('\n--Welcome to Ping Learning--\n');
  startup.start();
});



 