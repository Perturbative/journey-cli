var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./users');
var Category = require('./categories');

// Where the learning happens

var journeySchema = new Schema({
    name: String,                                                               // Name of Journey
    description: String,                                                        // Description of Journey
    img: { data: Buffer, contentType: String },                                 // Journey Image
    user : { type: Schema.Types.ObjectId, ref: 'User', required: true },        // User who created the Journey
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // Category which the Journey falls under
    pings: [{ type: Schema.Types.ObjectId, ref: 'Ping' }],                      // Pings logged to Journey
    created_at: Date,
    updated_at: Date
});

journeySchema.pre('save', function(next){
    // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

// the schema is useless so far
// we need to create a model using it
var Journey = mongoose.model('Journey', journeySchema);

// make this available to our users in our Node applications
module.exports = Journey;

