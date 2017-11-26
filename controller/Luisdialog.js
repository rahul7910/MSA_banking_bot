var builder = require('botbuilder');
var GreetingCardBuilder = require('./GreetingCard');
var account = require("./account"); // need to create  
var deposit = require("./Deposit"); // change to transaction ? 
var withdraw = require("./Withdraw");

exports.startDialog = function (bot) {
    
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/5fdaa196-1c51-4fdc-822e-777e68ef3d03?subscription-key=ff6167bbc0c640f48dda5060375cfedb&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    
        //welcome display when bot opens 
        bot.dialog('WelcomeIntent', function (session, args) {
            
            GreetingCardBuilder.displayGreetingCard(session);
            
        }).triggerAction({
            matches: 'WelcomeIntent'
        });
    
    

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

    bot.dialog('LookForRate', [
        function (session, args) {
            //if (!isAttachment(session)) {
                var currencyEntities = builder.EntityRecognizer.findAllEntities(args.intent.entities, 'Currency');

                if (currencyEntities.length === 2) {
                    session.send('Looking for conversion rate from \'%s\' to \'%s\'...', currencyEntities[0].entity, currencyEntities[1].entity);
                    conversion.displayConversionRate(currencyEntities, session);

    
                } else {
                    session.send("No currency or only 1 is identified! Try: nzd to usd");
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

                var currencyEntities = builder.EntityRecognizer.findAllEntities(session.dialogData.args.intent.entities, 'Currency');
                var amountEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'Amount');

                if (currencyEntities.length === 2) {
                    session.send('Converting \'%s\' \'%s\' to \'%s\'...', amountEntity.entity, currencyEntities[0].entity, currencyEntities[1].entity);
                    conversion.exchangeCurrency(currencyEntities, amountEntity.entity, session);
                } else {
                    session.send("I did not get that! Try: Convert 1000 aud to sgd!");
                }
            //}
        }
    ]).triggerAction({
        matches: 'Convert'
    });

}









































