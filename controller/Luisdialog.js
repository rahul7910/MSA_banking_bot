var builder = require('botbuilder');
var loginData = require("./account");
var deposit = require("./Deposit");
//var conversion = require("./conversion");
var GreetingCardBuilder = require('./GreetingCard');

exports.startDialog = function (bot) {
    
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/5fdaa196-1c51-4fdc-822e-777e68ef3d03?subscription-key=ff6167bbc0c640f48dda5060375cfedb&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

//welcome message here

    bot.dialog('WelcomeIntent', function (session, args) {
        
        GreetingCardBuilder.displayGreetingCard(session);

    }).triggerAction({
        matches: 'WelcomeIntent'
    });
/*
    bot.dialog('CreateAccount', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
            //if (!isAttachment(session)) {

                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                // LUIS is playing up 
                var bankingEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'account');

               // if (bankingEntity) {
                    session.send('Creating your new account ');
                    account.createNewAccount(session, session.conversationData["username"]);
                    account.displayAccount(session, session.conversationData["username"])
                //} else {
                //    session.send("Please Try again");
               // }
            //}
        }
    ]).triggerAction({
        matches: 'CreateAccount'
    });
*/

bot.dialog('CreateAccount', [
    function (session, args, next) {
            builder.Prompts.text(session, "Please enter the username to your account:");  
    },
    function (session, results, args, next) {

        if (results.response){
            session.conversationData["username"] = results.response;
        }
            builder.Prompts.text(session, "Enter the password for your account:");     
    },
    function (session, results,next) {
        if (results.response){
            session.conversationData["password"] = results.response;
        }

        loginData.createNewAccount(session,session.conversationData["username"],session.conversationData["password"]);
     }]
    
    ).triggerAction({
        matches: 'CreateAccount'
    });
    
    bot.dialog('getAccount', [
        function (session, args, next) {
                builder.Prompts.text(session, "Please enter the username to login");  
        },
        function (session, results, args, next) {
    
            if (results.response){
                session.conversationData["username"] = results.response;
            }
                builder.Prompts.text(session, "Enter the password for your account:");     
        },
        function (session, results,next) {
            if (results.response){
                session.conversationData["password"] = results.response;
            }
    
            loginData.attemptLogin(session,session.conversationData["username"],session.conversationData["password"]);
         //   loginData.attemptLogin(session,session.conversationData["username"],session.conversationData["password"]);
         }]
        
        ).triggerAction({
            matches: 'getAccount'
        });
    
/*
    bot.dialog('CreateAccount', [
        function (session, args, next) {
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter the username to the account:");           
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
            
            if (results.response){
                session.conversationData["username"] = results.response;
            }
            var bankingEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'account');
            
            if (bankingEntity) {
                session.send('Creating your new account ');
                account.createNewAccount(session,session.conversationData["username"]);
            }
        }]
    
    ).triggerAction({
        matches: 'CreateAccount'
    });
*/
    bot.dialog('MakeDeposit', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
            //if (!isAttachment(session)) {

                if (results.response) {
                    session.conversationData["username"] = results.response;
                }

                var bankingEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'banking');
                var balanceEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'balance');

                if (bankingEntity && balanceEntity) {
                    session.send('Making a deposit of '+ balanceEntity.entity + ' ' + bankingEntity.entity + ' for you...');
                    deposit.makeDeposit(session, session.conversationData["username"], bankingEntity.entity,  balanceEntity.entity);
                    session.send("Transaction done!");       
                } else {
                    session.send("I didn't get that! Try in format: Deposit 500 nzd");
                }
            //}
        }
    ]).triggerAction({
        matches: 'MakeDeposit'
    });
/*
    bot.dialog('GetAccount', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
            //if (!isAttachment(session)) {

                if (results.response) {
                    session.conversationData["username"] = results.response;
                }

                session.send("Retrieving your accounts...");
                account.displayAccount(session, session.conversationData["username"]);
            //}
        }
    ]).triggerAction({
        matches: 'GetAccount'
    });
*/

    bot.dialog('DeleteAccount', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
            //if (!isAttachment(session)) {

                session.send("You want to delete one of your accounts.");

                var bankingEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'banking');

                if (bankingEntity) {
                    session.send('Deleting \'%s\' account...', bankingEntity.entity);
                    loginData.deleteAccount(session,session.conversationData['username'],bankingEntity.entity); //<--- CALLL WE WANT
                } else {
                    session.send("No account identified! Try: Remove aud account!");
                }
            //}
        }
    ]).triggerAction({
        matches: 'DeleteAccount'
    });
    /*
    
    bot.dialog('LookForRate', [
        function (session, args) {
            //if (!isAttachment(session)) {
                var bankingEntities = builder.EntityRecognizer.findAllEntities(args.intent.entities, 'banking');

                if (bankingEntities.length === 2) {
                    session.send('Looking for conversion rate from \'%s\' to \'%s\'...', bankingEntities[0].entity, bankingEntities[1].entity);
                    conversion.displayConversionRate(bankingEntities, session);

    
                } else {
                    session.send("No banking or only 1 is identified! Try: nzd to usd");
                }
            //}
        }
    ]).triggerAction({
        matches: 'LookForRate'
    });
    
    bot.dialog('Convert', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
            //if (!isAttachment(session)) {

                var bankingEntities = builder.EntityRecognizer.findAllEntities(session.dialogData.args.intent.entities, 'banking');
                var balanceEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'balance');

                if (bankingEntities.length === 2) {
                    session.send('Converting \'%s\' \'%s\' to \'%s\'...', balanceEntity.entity, bankingEntities[0].entity, bankingEntities[1].entity);
                    conversion.exchangebanking(bankingEntities, balanceEntity.entity, session);
                } else {
                    session.send("I did not get that! Try: Convert 1000 aud to sgd!");
                }
            //}
        }
    ]).triggerAction({
        matches: 'Convert'
    });
    */
}