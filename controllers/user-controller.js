var prompt = require('prompt');
var User = require('../models/users');
var startup = require('./startup');
var prettyjson = require('prettyjson');


// CREATE
exports.addUser = function() {
    // 
    // Start the prompt 
    // 
    prompt.start();
    
    // 
    // Get properties from user input
    // 
    prompt.get(['Username', 'Password', 'Email', 'Name', 'Admin'], function (err, result) {
    if (err) throw err;
    // 
    // Log the results and add new user.
    // 
    var newUser = new User({
      name: result.Name,
      username: result.Username,
      password: result.Password,
      email: result.Email,
      admin: result.Admin
    });
    
    newUser.save(function(err){
      if (err) throw err;
      console.log('New user created in database:');
      console.log('  Username: ' + result.Username);
      console.log('  Password: ' + result.Password);
      console.log('  Email: ' + result.Email);
      console.log('  Name: ' + result.Name);
      // Going back to menu
      startup.start();
    });
    
    });
 };
 
 // READ
 
 exports.listUsers = function() {
    User.find({}, function(err, users) {
      if (err) throw err;
      // Looping through and outputting each user
      console.log(users);
      //Going back to menu
      startup.start();
    });
 };
 
 exports.findUser = function(usernameInput) {
   User.find({ username: usernameInput }, function(err, user) {
      if (err) throw err;

      // object of the user
      console.log(user);
      // Going back to menu
      startup.start();
    });  
 };
 
 /* This getUser functionality took me close to two hours to get right.
 
    Biggest problem for me was firstly the asynchronous callbacks. I didn't realize that you couldn't simply return <x> back becuase it was an asynchronous 
    callback (This is where I found the solution : http://stackoverflow.com/questions/18938469/set-variable-to-result-of-mongoose-find). As you can see the 
    inclusion of a callback parameter, where the callback function willbe passed in. You can check the callback function on line 11 on account-controller.js
    
    The second problem which i didn't even realize was that User.find() returned a ARRAY of Users, not just one single user meeting a contraint. As you can
    see, now I've passed user[0] into the callback. The problem wasn't that many users were being returned, it was just the type as there was only ever going to be one user
    returned as the search parameter was a primary key for the document. It was just that when comparing I was comparing a ARRAY of users (with length 1) instead
    of a single User object.
 
 */
 
  exports.getUser = function(usernameInput, callback) {
       User.find({ username: usernameInput }, function(err, user) {
          if (err) {
              callback(err, null);
          } else {
            // Getting user via callback
           callback(null, user[0]);
          }
        });  
 };
 
 // UPDATE (Not Working atm)
 
 exports.updateUser = function(usernameInput, propertyInDB, newValue) {
    User.findOneAndUpdate(
        { username: usernameInput }, // Finding user in database to update by username
        { propertyInDB: newValue },  // Updating Properties
        function(err, user) {
            if (err) throw err; 
            user.save(function (err){
                if (err) throw err; 
                // we have the updated user returned to us
                 console.log(user);
                // Going back to menu
                 startup.start();
            });
        }
    );
 };


// DELETE

exports.deleteUser = function(usernameToDelete) {
  User.findOneAndRemove({ username: usernameToDelete }, function(err) {
      if (err) throw err;
    
      // we have deleted the user
      console.log('User deleted!');
     // Going back to menu
        startup.start();
});  
};