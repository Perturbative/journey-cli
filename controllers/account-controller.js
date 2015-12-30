var User = require('../models/users');
var prompt = require('prompt');
var dbActions = require('./user-controller');
var startup = require('./startup');

exports.login = function() {
    prompt.start();
    prompt.get(['Username', 'Password'], function(err, result){
        if (err) throw err;
        
        dbActions.getUser(result.Username, function(err, user){
            if (err) {
                console.log('User does not exist.')
                startup.start();
            } else {
                if (user.password == result.Password) {
                    if (user.admin == true) {
                        startup.adminDashboard(user);
                    } else {
                        startup.dashboard(user);
                    }
                } else {
                    console.log('Your Password was wrong');
                    startup.start();
                }
            }
        });
    });
};