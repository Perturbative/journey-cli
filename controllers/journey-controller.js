var prompt = require('prompt');
var User = require('../models/users');
var startup = require('./startup');
var Category = require('../models/categories');
var Journey = require('../models/journey');

// CREATE

exports.addJourney = function(currentUser, category) {
    // 
    // Start the prompt 
    // 
    prompt.start();
    
    // 
    // Get properties from user input
    // 
    prompt.get(['Name', 'Description'], function (err, result) {
    if (err) throw err;
    // Log the results and add new Journey.
    var newJourney = new Journey({
      name: result.Name,
      description: result.Description,
      user: currentUser._id, 
      category: category._id // VERY VERY VERY IMPORTANT --> Defines the relation (refs) between Journey documents and  Category documents.
        
    });
    
    // Saving Journey (VERY VERY IMPORTANT)
    newJourney.save(function(err){
      if (err) throw err;
      console.log('New Journey created in database:');
      console.log('  Name: ' + result.Name);
      console.log('  Description: ' + result.Description);
      console.log('  User: ' + currentUser.username);
      console.log('  Category: ' + category.name);
      
        // Adding Journey to Category (VERY VERY IMPORTANT)
        category.journeys.push(newJourney);
        category.save(function(err){
            if (err) throw err;
            // Journey linkes to Category
        });
        
      // Going back to menu
      startup.dashboard(currentUser);
    });
    
    
    });
    
};

// READ

 exports.listJourneys = function(currentUser, category, callback) {
     Journey.find({user: currentUser._id, category: category._id}, function(err, journeys) {
      if (err) throw err;
      // Looping through and outputting each Journey and letting the user select a Journey
      console.log('\n~~~ Journeys ~~~\n');
      journeys.forEach(function(journey){
          console.log(journey.name);
      });
      callback();
      
    });
 };
 
 // This is where the cool stuff really happens. 
 // Here Mongoose is given a few parameters to find the Journey that the user has selected, and once it has done that, the Journey object is returned directly from MongoDB
 // via a callback function to startup.js where it is can be used and manipulated easily and efficiently.
  exports.loadJourney = function(currentUser, category, callback) {
     prompt.start();
     prompt.get(['Journey_Name'], function(err, result) {
         if (err) throw err;
         Journey.find({user: currentUser._id, category: category._id, name: result.Journey_Name}, function(err, journeys){
             if (err) {
                 callback(err, null);
             } else {
                 callback(null, journeys[0]);
             }
         });
     });

 };



// UPDATE

exports.updateJourneyName = function(currentUser, category, journey) {
  prompt.start();
  prompt.get(['New_Name'], function(err, result) {
       if (err) throw err;
       Journey.findOneAndUpdate({ user: currentUser._id, category: category._id, name: journey.name }, { name: result.New_Name }, function(err, journey) {
            if (err) throw err;
          // we have the updated user returned to us
          journey.save(function(err){
              if (err) throw err;
              console.log(journey);
              startup.dashboard(currentUser);
          });
          
        });
    });
};

exports.updateJourneyDesc = function(currentUser, category, journey) {
  prompt.start();
  prompt.get(['New_Description'], function(err, result) {
       if (err) throw err;
       Journey.findOneAndUpdate({ user: currentUser._id, category: category._id, name: journey.name }, { description: result.New_Description }, function(err, journey) {
            if (err) throw err;
          // we have the updated user returned to us
          journey.save(function(err){
              if (err) throw err;
              console.log(journey);
              startup.dashboard(currentUser);
          });
          
        });
    });
};

// DELETE

exports.deleteJourney = function(currentUser, category, journey) {
    Journey.findOneAndRemove({ user: currentUser._id, name: category._id, name: journey.name }, function(err) {
          if (err) throw err;
        
          // we have deleted the Journey
          console.log('Journey deleted!');
           startup.dashboard(currentUser);
 });  
};
