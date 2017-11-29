var builder = require('botbuilder');
var customVision = require('./CustomVision');
var GreetingCardBuilder = require('./GreetingCard');
var account = require('./account');
var currency = require("./CurrencyRate");



exports.startDialog = function (bot) {
    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/5fdaa196-1c51-4fdc-822e-777e68ef3d03?subscription-key=ff6167bbc0c640f48dda5060375cfedb&verbose=true&timezoneOffset=0&q= ');
    
    bot.recognizer(recognizer);
//global variables 
    var n=0;
    var current=0;
  
    /*
    bot.dialog('closeServices', function(session, args) { 
        session.send("Hi Rahul!");
    }).triggerAction({
        matches: 'closeServices'
    });
*/

    bot.dialog('WelcomeIntent', 
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                // session.send("Hello !!");
                GreetingCardBuilder.displayStarterCard(session);  // <---- THIS LINE HERE IS WHAT WE NEED 
                   
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                
                // session.send("Hello %s!!", session.conversationData["username"]);
                GreetingCardBuilder.displayCards(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            
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
                account.NewLogin(session, session.conversationData["username"]);   
            
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
                //end the conversation in order to log off ? 
                session.endConversation();
                //session is over , can notify the user now 
                session.send("Successfully logged off!");  
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
                
                session.send("No login is made before!!");
                //provide option for user to login again or choose another option 
                GreetingCardBuilder.displayStarterCard(session);  
            
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
           // if(!isAttachment(session)){
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                //same as the login ting yeh , need an account to delete it 
                builder.Prompts.text(session, "Enter a username to log in to your account first.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
          //  if(!isAttachment(session)){
            //Add this code in otherwise your username will not work?
            if (results.response) {
                session.conversationData["username"] = results.response;
            }

            session.send("You want to delete this account.");
            
            session.send('Deleting \'%s\'...', session.conversationData["username"]);
            account.deleteUser(session, session.conversationData["username"]); //<--- CALLL WE WANT
          //  session.send('Deleted account'); 
          //Notify user it has been deleted 

        //}
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
                        builder.Prompts.text(session, "Enter currency in format of 3 capital letters e.g. (NZD) ");
                        
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
                            //ask user if they want to continue after finding out the exchange rate 
                                setTimeout(function()
                                {
                                    if(n===current)
                                    {
                                        session.send("Anything else you would like to do?"); 
                                        GreetingCardBuilder.displayStarterCard(session);
                                        // session.send(n);
                                        //session.endConversation('Ending conversation since you\'ve been inactive too long. Hope to see you soon.');
                                    }
                            
                                }, 3000);
                                
                            
                        }else{
                            //if wrong input then retry (currency should be ==3)
                            session.send("The currency format entered is not right, please try again!");
                            GreetingCardBuilder.displayStarterCard(session);
                        }
                    }
                
                ]).triggerAction({
                    matches: 'Currency'
                    });
    

              bot.dialog('Image', [
                        function isAttachment(session) {
                            //session.send("Please paste a url of a currency photo or upload an image.") 
                            var msg = session.message.text;
                            if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
                                //session.send("Please paste a url of a currency photo or upload an image.") 
                                
                                //call custom vision
                                 customVision.retreiveMessage(session);
                                 return true;
                            }else {
                                    //session.send("Please paste a url of a currency you want to be identifed or you can simply upload an image!");
                                    
                                    session.send("Please paste a url of a currency photo or upload an image.") 
                                    setTimeout(function()
                                    {
                                        if(n===current)
                                        {
                                            session.send("Anything else you would like to do?"); 
                                            GreetingCardBuilder.displayStarterCard(session);
                                            // session.send(n);
                                            //session.endConversation('Ending conversation since you\'ve been inactive too long. Hope to see you soon.');
                                        }
                                
                                    }, 14000);
                                    //return false 
                                    //something goes wrong 
                                    //GreetingCardBuilder.displayStarterCard(session);
                                }
                        }
                    ]).triggerAction({
                        matches: 'Image'
                    });
                    
    
    }
    
/*
    function checkdate(response) {
        if (response.length !==10){
            return false;
            
        } else {
            
            return true;
        }
    
    }
  */  
    function checkcurrency(response){
        if(response.length!==3){
            return false
        }else{
            return true;
        }
    }
    /*
    bot.dialog('Currency Image', [
        function isAttachment(session) { 
            var msg = session.message.text;
            if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
                //call custom vision
                 customVision.retreiveMessage(session);
        
                return true;
            }
            else {
                return false;
            }
        }
    ]).triggerAction({
        matches: 'Currency Image'
    });
*/


