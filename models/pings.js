var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./users');
var Journey = require('./journey');

// Where the tracking happens

var pingSchema = new Schema({
    description: String,                                                        // Description of the Ping
    user : { type: Schema.Types.ObjectId, ref: 'User', required: true },        // User who created the Ping
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // Category which the Pings fall under
    journey: { type: Schema.Types.ObjectId, ref: 'Journey', required: true },   // Journey which the Ping is sent/attached to.
    time: { type: Date, required: true },                                       // Time when the Ping was created/attached to the Journey
    duration: String,                                                           // Duration/Time spent on ping i.e. how long your learning session was.
    scale: String,                                                              // A scale of how good the ping was, i.e. Terrific/Great/Okay/Below Par/Frustrating/Poor
});

pingSchema.pre('save', function(next){
 /*   // get the current date
  var currentDate = new Date();
  

  // if created_at doesn't exist, add to that field
  if (!this.time)
    this.created_at = currentDate; */

  next();
});

// the schema is useless so far
// we need to create a model using it
var Ping = mongoose.model('Ping', pingSchema);

// make this available to our users in our Node applications
module.exports = Ping;