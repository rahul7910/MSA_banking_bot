var builder = require('botbuilder');
var customVision = require('./CustomVision');
var GreetingCardBuilder = require('./GreetingCard');
var account = require('./account');



exports.startDialog = function (bot) {
    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var recognizer = new builder.LuisRecognizer(' https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/5fdaa196-1c51-4fdc-822e-777e68ef3d03?subscription-key=ff6167bbc0c640f48dda5060375cfedb&verbose=true&timezoneOffset=0&q= ');
    
    bot.recognizer(recognizer);

    //global variables here

    bot.dialog('WelcomeIntent', 
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                // session.send("Hello !!");
                GreetingCardBuilder.displayStarterHelp(session);  // <---- THIS LINE HERE IS WHAT WE NEED 
                   
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                
                // session.send("Hello %s!!", session.conversationData["username"]);
                GreetingCardBuilder.displayHelperCards(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            
        }
    ).triggerAction({
        matches: 'WelcomeIntent'
    });


    bot.dialog('Login', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");        
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                
                // session.send("Hello %s!!", session.conversationData["username"]);
                account.NewLogin(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            
        }
    ]).triggerAction({
        matches: 'Login'
    });

    //logout function 
    bot.dialog('Logout', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (session.conversationData["username"]) {
                session.send("Logging Off...");
                session.endConversation();
                session.send("Successfully logged off!");  
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
                
                session.send("No login is made before!!");
                GreetingCardBuilder.displayStarterHelp(session);  // <---- THIS LINE HERE IS WHAT WE NEED 
            
        }
    ]).triggerAction({
        matches: 'Logout'
    });

//Check bank balance 

    bot.dialog('BankBalance', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to log in to your account.");        
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                
                
                account.displayBalance(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            
        }
    ]).triggerAction({
        matches: 'BankBalance'
    });

//createAccount
    bot.dialog('CreateAccount', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to create your account.");        
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                
                // session.send("Hello %s!! Checking your balnce. Please Wait!", session.conversationData["username"]);
                account.AddAccount(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            
        }
    ]).triggerAction({
       // matches: 'BankAddAcc'
       matches: 'CreateAccount'
    });

    //DeleteAccount
    bot.dialog('DeleteAccount', [
        function (session, args, next) {
            if(!isAttachment(session)){
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to log in to your account first.");
            } else {
                next(); // Skip if we already have this info.
            }
        }},
        function (session, results,next) {
            if(!isAttachment(session)){
            //Add this code in otherwise your username will not work.
            if (results.response) {
                session.conversationData["username"] = results.response;
            }

            session.send("You want to delete this account.");
            
            session.send('Deleting \'%s\'...', session.conversationData["username"]);
            account.deleteUser(session, session.conversationData["username"]); //<--- CALLL WE WANT
        }
    }
    ]).triggerAction({
        matches: 'DeleteAccount'
    });

    //withdraw function
    bot.dialog('Withdraw', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");        
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
            if (results.response) {
                session.conversationData["username"] = results.response;
            }
            if (!session.conversationData["amount"]) {
                builder.Prompts.text(session, "Enter an amount you want to withdraw.");
            } else {
                next();
            }
        },
        function (session,results,next) {
            if (results.response) {
                session.conversationData["amount"] = results.response;
            }
            // session.send("Hello %s!!", session.conversationData["username"]);
            account.addCheck(session, session.conversationData["username"], session.conversationData["amount"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
    
        }
                
        
    ]).triggerAction({
        matches: 'Withdraw'
    });

    //need to add a deposit function 
    
    
    // bot.dialog('Currency', [
    //     function(session,args,next) {
    //     exRate = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');
    //     session.conversationData["lookingFor"] = exRate;
    //     builder.Prompts.text(session, 'You are looking for the exchange rate of '+ exRate.entity.toUpperCase() +' based on...');
    //     next();
    //     },
    //     function(session, results, next) {
    //         var lookingFor = results.response.toUpperCase();
    //         console.log(exRate.entity);
    //         console.log(results.response);
    //         var url = 'https://api.fixer.io/latest?base=' + exRate.entity;
    //         session.send("Retreiving exchange rate...");
    //         nutrition.displayExRate(url,session);

    //     }
    // ]).triggerAction({
    //     matches: 'Currency'
    // });


    
    function isAttachment(session) { 
        var msg = session.message.text;
        if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
            //call custom vision
            // customVision.retreiveMessage(session);
    
            return true;
        }
        else {
            return false;
        }
    }

}