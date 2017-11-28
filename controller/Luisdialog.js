var builder = require('botbuilder');
var customVision = require('./CustomVision');
var GreetingCardBuilder = require('./GreetingCard');
var account = require('./account');
var currency = require("./CurrencyRate");



exports.startDialog = function (bot) {
    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var recognizer = new builder.LuisRecognizer('  	https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/5fdaa196-1c51-4fdc-822e-777e68ef3d03?subscription-key=ff6167bbc0c640f48dda5060375cfedb&verbose=true&timezoneOffset=0&q= ');
    
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
                //Need to be logged in to view account balance 
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
                //prompt user to enter credentials 
                builder.Prompts.text(session, "Enter a username to create a account.");        
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                
                account.AddAccount(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            
        }
    ]).triggerAction({
       matches: 'CreateAccount'
    });

    //DeleteAccount
    bot.dialog('DeleteAccount', [
        function (session, args, next) {
            if(!isAttachment(session)){
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                //same as the login ting yeh , need an account to delete it 
                builder.Prompts.text(session, "Enter a username to log in to your account first.");
            } else {
                next(); // Skip if we already have this info.
            }
        }},
        function (session, results,next) {
            if(!isAttachment(session)){
            //Add this code in otherwise your username will not work?
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
            if (!session.conversationData["balance"]) {
                builder.Prompts.text(session, "Enter an amount you want to withdraw.");
            } else {
                next();
            }
        },
        function (session,results,next) {
            if (results.response) {
                session.conversationData["balance"] = results.response;
            }
            // session.send("Hello %s!!", session.conversationData["username"]);
            account.withdraw(session, session.conversationData["username"], session.conversationData["balance"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
    
        }
                
        
    ]).triggerAction({
        matches: 'Withdraw'
    });


    //need to add a deposit function 
     //Deposit function
    bot.dialog('Deposit', [
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
            if (!session.conversationData["balance"]) {
                builder.Prompts.text(session, "Enter an amount you want to Deposit.");
            } else {
                next();
            }
        },
        function (session,results,next) {
            if (results.response) {
                session.conversationData["balance"] = results.response;
            }
            account.deposit(session, session.conversationData["username"], session.conversationData["balance"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
    
        }
                
        
    ]).triggerAction({
        matches: 'Deposit'
    });
    
    bot.dialog('Currency', [
        function (session, args, next) {
            var msg = session.message.text;
            if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
                    customVision.retreiveMessage(session);
            }else{
                
                        session.dialogData.args = args || {};
                        builder.Prompts.text(session, "Enter currency in format of 3 letters e.g. (NZD) ");
                        
                    }
                },
                    function(session, results, args, next) {
                        if (checkcurrency(results.response)){
                            session.conversationData["base"] = results.response;
                            builder.Prompts.text(session,"Enter currency rate based on the currency you entered");
                        }else{
                            //if the response is false restart again 
                            session.send("The currency format entered is not right");
                        }
                    },
                    function(session, results, args, next) {
                        if (checkcurrency(results.response)){
                            session.conversationData["currency"] = results.response;
                            currency.displayCurrencyCards(session, session.conversationData["base"] ,session.conversationData["currency"])
                
                
                        }else{
                            //if wrong input then retry (currency should be ==3)
                            session.send("The currency format entered is not right, please try again!");
                            GreetingCardBuilder.displayStarterHelp(session);
                        }
                    }
                
                ]).triggerAction({
                    matches: 'Currency'
                    });
    
    
    }
    

    function checkdate(response) {
        if (response.length !==10){
            return false;
            
        } else {
            
            return true;
        }
    
    }
    
    function checkcurrency(response){
        if(response.length!==3){
            return false
        }else{
            return true;
        }
    }
    
    
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

