var rest = require('../API/Restclient');
var builder = require('botbuilder');
/*
var rest = require('../API/Restclient');

exports.displayFavouriteFood = function getFavouriteFood(session, username){
    var url = 'https://foodbotmsa.azurewebsites.net/tables/FoodBot';
    rest.getFavouriteFood(url, session, username, handleFavouriteFoodResponse)
};
*/


//dealing with login of accounts 
/*
exports.attemptLogin = function lookForUser(session, username, password){
    var url = "http://contosobb.azurewebsites.net/tables/ContosoBB";
    rest.lookForUser(url,session, username, password, handleUserLookupResponse);
}
*/
/*
exports.reccordNewLogin = function postNewLogin(session, username){
    var url = "http://contosobb.azurewebsites.net/tables/ContosoBB";
    rest.postNewLogin(url,session, username);
}
*/
//------------------------------------------------------------------------------------------

//dealing with account display and creation ------------------------------------------------
exports.displayAccount = function getAccount(session, username,password){
    var url = 'http://contosobb.azurewebsites.net/tables/ContosoBB';
    rest.getAccount(url, session, username, password, handleUserLookupResponse)
};

exports.createNewAccount = function postAccount(session, username, password){
    var url = 'http://contosobb.azurewebsites.net/tables/ContosoBB';
    rest.postAccount(url, username, password);
    session.send("Congrats! You have just created a new account with Contoso Bank!");
};
//------------------------------------------------------------------------------------------

function handleUserLookupResponse(message,session,username,password){
    var loginLookupResponse = JSON.parse(message);

    var foundUser = false;

    for (var i in loginLookupResponse){
        if (username == loginLookupResponse[i].username){
            if(password == loginLookupResponse[i].password){
                foundUser = true;
            }
        }
    }

    if (foundUser){
        // Post the new login to the records table
        var url = "http://contosobb.azurewebsites.net/tables/ContosoBB";
        rest.postNewLogin(url,session, username);

        session.send("%s, you have successfully logged in. How can I help?",username);

    } else {
        session.send("Username or password incorrect, please try again");
        //session.send("Account Query");
    }    
}

function handleGetAccountResponse(message, session, username) {
    var getAccountResponse = JSON.parse(message);
    var allAccounts = [];
    for (var index in getAccountResponse) {
        var account = {};
        account.value = getAccountResponse[index].balance;
        allAccounts.push(account);      
    }


    // Print all accounts for the user that is currently logged in
    session.send(new builder.Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "0.5",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Account Owner: " + username,
                            "size": "large"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Account Information"
                        }
                    ]
                },
                {
                    "type": "Container",
                    "spacing": "none",
                    "items": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "auto",
                                    "items": [
                                        {
                                            "type": "FactSet",
                                            "facts": allAccounts
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }));              
    
}