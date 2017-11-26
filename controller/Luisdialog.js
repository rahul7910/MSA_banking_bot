var builder = require('botbuilder');
var GreetingCardBuilder = require('./GreetingCard');
var account = require("./account"); // need to create  
var deposit = require("./makeDeposit"); // change to transaction ? 

exports.startDialog = function (bot) {
    
    var recognizer = new builder.LuisRecognizer('	https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/5fdaa196-1c51-4fdc-822e-777e68ef3d03?subscription-key=ff6167bbc0c640f48dda5060375cfedb&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    exports.startDialog = function (bot) {
        //welcome display when bot opens 
        bot.dialog('WelcomeIntent', function (session, args) {
            
            GreetingCardBuilder.displayGreetingCard(session);
            
        }).triggerAction({
            matches: 'WelcomeIntent'
        });
    
    }

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

                var currencyEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'Currency');

                if (currencyEntity) {
                    session.send('Creating a new account in \'%s\'...', currencyEntity.entity);
                    account.createNewAccount(session, session.conversationData["username"], currencyEntity.entity);
    
                } else {
                    session.send("No currency identified! Try: Create a new account in NZD");
                }
            //}
        }
    ]).triggerAction({
        matches: 'CreateAccount'
    });
    // add withdrawl 
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

                var currencyEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'Currency');
                var amountEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'Amount');

                if (currencyEntity && amountEntity) {
                    session.send('Making a deposit of '+ amountEntity.entity + ' ' + currencyEntity.entity + ' for you...');
                    deposit.makeDeposit(session, session.conversationData["username"], currencyEntity.entity,  amountEntity.entity);
                    session.send("Transaction done!");       
                } else {
                    session.send("I didn't get that! Try in format: Deposit 500 nzd");
                }
            //}
        }
    ]).triggerAction({
        matches: 'MakeDeposit'
    });

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


}









































