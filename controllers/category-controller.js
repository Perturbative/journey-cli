var prompt = require('prompt');
var User = require('../models/users');
var startup = require('./startup');
var Category = require('../models/categories');

// CREATE

exports.addCategory = function(currentUser) {
    // 
    // Start the prompt 
    // 
    prompt.start();
    
    // 
    // Get properties from user input
    // 
    prompt.get(['Name', 'Description'], function (err, result) {
    if (err) throw err;
    // 
    // Log the results and add new user.
    // 
    var newCategory = new Category({
      name: result.Name,
      description: result.Description,
      user: currentUser._id // VERY VERY VERY IMPORTANT --> Defines the relation (refs) between Users documents and Categories documents and ties in a Ctaegory to a specific user
    });
    
    // Saving Category (VERY VERY IMPORTANT)
    newCategory.save(function(err){
      if (err) throw err;
      console.log('New category created in database:');
      console.log('  Name: ' + result.Name);
      console.log('  Description: ' + result.Description);
      console.log('  User: ' + currentUser.username);
      
        // Adding Category to User (VERY VERY IMPORTANT)
        currentUser.categories.push(newCategory);
        currentUser.save(function(err){
            if (err) throw err;
            // Category linked to user
        });
        
      // Going back to menu
      startup.dashboard(currentUser);
    });
    
    
    });
};

// READ

 exports.listAllCategories = function(currentAdmin) {
    Category.find({}, function(err, catgs) {
      if (err) throw err;
      // Looping through and outputting each user
      console.log(catgs);
      //Going back to menu
      startup.adminDashboard(currentAdmin);
    });
 };
 
 exports.listMyCategories = function(currentUser, callback) {
     Category.find({user: currentUser._id}, function(err, catgs) {
      if (err) throw err;
      // Looping through and outputting each Category and letting the user select a category
      console.log('\n##SELECT CATEGORY##\n');
      catgs.forEach(function(category){
          console.log(category.name);
      });
      
      callback();
    });
 };
 
 exports.loadCategory = function(currentUser, callback) {
     prompt.start();
     prompt.get(['Name'], function(err, result) {
         if (err) throw err;
         Category.find({user: currentUser._id, name: result.Name}, function(err, categories){
             if (err) {
                 callback(err, null);
             } else {
                 callback(null, categories[0]);
             }
         });
     });

 };

// UPDATE

exports.updateCategName = function(currentUser, category) {
    prompt.start();
    prompt.get(['New_Name'], function(err, result) {
       if (err) throw err;
       Category.findOneAndUpdate({ user: currentUser._id, name: category.name }, { name: result.New_Name }, function(err, category) {
            if (err) throw err;
          // we have the updated user returned to us
          category.save(function(err){
              if (err) throw err;
              console.log(category);
              startup.dashboard(currentUser);
          });
          
        });
    });
}

exports.updateCategDesc = function(currentUser, category) {
    prompt.start();
    prompt.get(['New_Description'], function(err, result) {
       if (err) throw err;
       Category.findOneAndUpdate({ user: currentUser._id, name: category.name }, { description: result.New_Description }, function(err, category) {
            if (err) throw err;
          // we have the updated user returned to us
          category.save(function(err){
              if (err) throw err;
              console.log(category);
              startup.dashboard(currentUser);
          });
          
        });
    });
};

// DELETE

exports.deleteCategory = function(currentUser, category) {
    Category.findOneAndRemove({ user: currentUser._id, name: category.name }, function(err) {
          if (err) throw err;
        
          // we have deleted the Category
          console.log('Category deleted!');
           startup.dashboard(currentUser);
 });  
};
