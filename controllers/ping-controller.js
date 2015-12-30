var prompt = require('prompt');
var User = require('../models/users');
var startup = require('./startup');
var Category = require('../models/categories');
var Journey = require('../models/journey');
var Ping = require('../models/pings');

// CREATE

exports.createPing = function(currentUser, category, journey) {
    // 
    // Start the prompt 
    // 
    prompt.start();
    
    // 
    // Get properties from user input
    // 
    prompt.get(['Description', 'Duration', 'Scale'], function (err, result) {
    if (err) throw err;
    // Log the results and add new Ping.
    var newPing = new Ping({
      description: result.Description,
      user: currentUser._id,  // VERY VERY VERY IMPORTANT --> Defines the relation (refs) between Ping documents and the User documents (the User who created the ping)
      category: category._id, // VERY VERY VERY IMPORTANT --> Defines the relation (refs) between Ping documents and Category documents.
      journey: journey._id, // ULTRA IMPORTANT --> Defines the relation (refs) between Ping documents and Journey documents. i.e. Which Journey is being Pinged
      time: new Date(), 
      scale: result.Scale,
      duration: result.Duration
    });
    
    // Saving Ping (VERY VERY IMPORTANT)
    newPing.save(function(err){
      if (err) throw err;
      console.log('New Ping created in database:');
      console.log('  Description: ' + newPing.description);
      console.log('  Time: ' + newPing.time.toString());
      console.log('  User: ' + currentUser.username);
      console.log('  Category: ' + category.name);
      console.log('  Journey: ' + journey.name);
      
        // Adding Ping to Journey (ULTRA IMPORTANT)
        journey.pings.push(newPing);
        journey.save(function(err){
            if (err) throw err;
            // Journey links to Ping
        });
        
      // Going back to menu
      startup.dashboard(currentUser);
    });
    
    
    });
    
};

// READ

exports.retrievePings = function(currentUser, category, journey, callback) {
    Ping.find({user: currentUser._id, category: category._id, journey: journey._id}, function(err, pings) {
      if (err) throw err;
      // Looping through and outputting each Journey and letting the user select a Journey
      console.log('\n~~~ Pings ~~~\n');
      pings.forEach(function(ping){
          console.log('\n--Ping at %s for %s\n' + 
          'Description: %s\n' + 
          'Scale: %s\n', ping.time.toString(), ping.duration, ping.description, ping.scale);
      });
      // Do whatever after all Pings have been retrieved from the database.
      callback();
    });
};

// UPDATE

// DELETE