var prompt = require('prompt');
var dbActions = require('./user-controller');
var accountController = require('./account-controller');
var categoryController = require('./category-controller');
var journeyController = require('./journey-controller');
var pingController = require('./ping-controller');
// var Menu = require('terminal-menu');
// var menu = Menu({ width: 29, x: 4, y: 2 });

exports.start = function(){
    // Start -- > Setting Up Menu
    /* drawMenu();

    menu.on('select', function (label, index) {
        menu.close();
        switch (index) {
            case 0:
                dbActions.addUser();
                drawMenu();
                break;
            case 1:
                dbActions.listUsers();
                drawMenu();
                break;
            case 2:
                prompt.get(['username'], function(err, result){
                    if (err) throw err;
                    dbActions.findUser(result.username);
                });
                drawMenu();
                break;
            case 3:
                process.exit();
                break;
        } 
        console.log('SELECTED: ' + label + ' ' +index);
    });
    
    process.stdin.pipe(menu.createStream()).pipe(process.stdout);
     
    process.stdin.setRawMode(true);
    menu.on('close', function () {
        process.stdin.setRawMode(false);
        process.stdin.end();
    }); */
    
    printCommands();
    prompt.start();
    prompt.get(['command'], function(err, result){
        if (err) throw err;
        switch (result.command) {
            case '--login':
                accountController.login();
                break;
            case '--register':
                dbActions.addUser();
                break;
            case '--exit':
                process.exit();
                break;
            default:
                //this.start(); --> Don't know what to do is there is a wrong input
                break;
        }
    });

};



exports.dashboard = function(loggedInUser) {
    printDashboard(loggedInUser);
    prompt.get(['command'], function(err, result){
        if (err) throw err;
        switch (result.command) {
            case '--addCategory':
                categoryController.addCategory(loggedInUser);
                break;
            case '--listCategories':
                categoryController.listMyCategories(loggedInUser, function() { // Listing Categories
                    categoryController.loadCategory(loggedInUser, function(err, category) { //Loading Category (Selecting it)
                        if(err) throw err;
                        //Performing Actions on selected Category
                        printCategoryView(loggedInUser, category, function() {
                             prompt.get(['command'], function(err, result){
                                if (err) throw err;
                                switch(result.command) {
                                    case '--addJourney':
                                        journeyController.addJourney(loggedInUser, category);
                                        break;
                                    case '--updateCategoryName':
                                        categoryController.updateCategName(loggedInUser, category);
                                        break;
                                    case '--updateCategoryDescription':
                                        categoryController.updateCategDesc(loggedInUser, category);
                                        break;
                                    case '--deleteCategory':
                                        categoryController.deleteCategory(loggedInUser, category);
                                        break;
                                    case '--selectJourney':
                                        journeyController.loadJourney(loggedInUser, category, function(err, journey){
                                            if (err) throw err;
                                            printJourneyView(loggedInUser, category, journey, function(){
                                                prompt.get(['command'], function (err, result){
                                                    if (err) throw err;
                                                    switch(result.command) {
                                                        case '--updateJourneyName':
                                                            journeyController.updateJourneyName(loggedInUser, category, journey);
                                                            break;
                                                        case '--updateJourneyDescription':
                                                            journeyController.updateJourneyDesc(loggedInUser, category, journey);
                                                            break;
                                                        case '--deleteJourney':
                                                            journeyController.deleteJourney(loggedInUser, category, journey);
                                                            break;
                                                        case '--addPing':
                                                            pingController.createPing(loggedInUser, category, journey);
                                                            break;
           
                                                    }
                                                });
                                            });
                                        });
                                        break;
                                }
                            }); 
                        });

                    });
                });
                break;
            case '--exit':
                process.exit();
                break;
            default:
                //this.start(); --> Don't know what to do is there is a wrong input
                break;
        }
    });
};

exports.adminDashboard = function(loggedInUser){
    printAdminDashboard(loggedInUser);
    prompt.start();
    prompt.get(['command'], function(err, result){
        if (err) throw err;
        switch (result.command) {
            case '--logout':
               // this.start();
                break;
            case '--addUser':
                dbActions.addUser();
                break;
            case '--listUsers':
                dbActions.listUsers();
                break;
            case '--listAllCategories':
                categoryController.listAllCategories(loggedInUser);
                break;
            case '--findUser':
                prompt.get(['username'], function(err, result) {
                    if (err) throw err;
                    dbActions.findUser(result.username);
                });
                break;
            case '--updateUser':
                prompt.get(['username','propertyToUpdate','newValue'], function(err, result) {
                    if (err) throw err;
                    dbActions.updateUser(result.username, result.propertyToUpdate, result.newValue);
                });
                break;
            case '--deleteUser':
                 prompt.get(['username'], function(err, result) {
                    if (err) throw err;
                    dbActions.deleteUser(result.username);
                });
                break;
            case '--exit':
                process.exit();
                break;
            default:
                //this.start(); --> Don't know what to do is there is a wrong input
                break;
        }
    });

};

function printDashboard(loggedInUser) {
    console.log(
    '\n##--- Welcome to your dashbord %s ---##\n' + 
    '    --listCategories      \n' + 
    '    --addCategory    \n' + 
    '    --logout   \n' +
    '    --exit         (Exits program)\n\n', loggedInUser.username);
}
    
  
function printAdminDashboard(loggedInUser) {
    console.log(
    '\n##--- Welcome to your Admin Dashboard %s ---##\n' + 
    '    --logout        (Logout)\n' + 
    '    --addUser      (Adds a new user to the database)\n' + 
    '    --listUsers    (Lists all users in the database)\n' + 
    '    --listAllCategories    (Lists all categories in the db)\n' + 
    '    --findUser     (Takes a username input and lists the specified user)\n' +
    '    --updateUser   (Updates a user by inputting a username and property to update with new values)\n' +
    '    --deleteUser   (Deletes a user by username)\n' +
    '    --exit         (Exits program)\n\n', loggedInUser.username);
}
    
function printCommands() {
    console.log(
    '\n##---LIST OF COMMANDS---##\n' + 
    '    --login        (Login)\n' + 
    '    --register      (Register)\n' + 
    '    --exit         (Exits program)\n\n');
}

/* function drawMenu() {
    menu.reset();
    menu.write('Ping Learning\n');
    menu.write('-------------------------\n');
     
    menu.add('Add User');
    menu.add('List User');
    menu.add('Find User');
    menu.add('Exit');
} */

function printJourneyView(loggedInUser, category, journey , callback) {
    console.log(
    '\n##--- Journey : %s ---##\n' + 
    'Description: %s\n', journey.name, journey.description);

    pingController.retrievePings(loggedInUser, category, journey, function(){
        console.log(
        '\n\n~~~ LIST OF COMMANDS ~~~\n' +
        '    --addPing        \n' + 
        '    --updateJourneyName     \n' + 
        '    --updateJourneyDescription         \n' +
        '    --deleteJourney \n\n'); 
        callback(); //Take note of the nesting of callbacks here. If this nesting was not implemented then you'd have parts of the Category View appearing out of order
    }); 
    
}

function printCategoryView(loggedInUser, category, callback) {
    console.log(
    '\n##--- Category : %s ---##\n' + 
    'Description: %s\n', category.name, category.description);
    journeyController.listJourneys(loggedInUser,category, function(){
       console.log(

        '\n\n~~~ LIST OF COMMANDS ~~~\n' +
        '    --selectJourney \n' +
        '    --addJourney        \n' + 
        '    --updateCategoryName     \n' + 
        '    --updateCategoryDescription         \n' +
        '    --deleteCategory \n'); 
        callback(); //Take note of the nesting of callbacks here. If this nesting was not implemented then you'd have parts of the Category View appearing out of order
    });
    
}
