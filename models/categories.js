var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./users');

// Simply a container for Jouney's

var categorySchema = new Schema({
    name: String,                                                               // Name of category
    description: String,                                                        //Description of Category
    img: { data: Buffer, contentType: String },                                 // Category Image
    user : { type: Schema.Types.ObjectId, ref: 'User', required: true },                        // User who created the Category
    journeys: [{ type: Schema.Types.ObjectId, ref: 'Journey' }],                // Journeys which fall under Category
    created_at: Date,
    updated_at: Date
});

categorySchema.pre('save', function(next){
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
var Category = mongoose.model('Category', categorySchema);

// make this available to our users in our Node applications
module.exports = Category;

