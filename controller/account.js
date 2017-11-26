var rest = require('../API/Restclient');
var builder = require('botbuilder');
/*
var rest = require('../API/Restclient');

exports.displayFavouriteFood = function getFavouriteFood(session, username){
    var url = 'https://foodbotmsa.azurewebsites.net/tables/FoodBot';
    rest.getFavouriteFood(url, session, username, handleFavouriteFoodResponse)
};
*/

exports.displayAccount = function getAccount(session, username){
    var url = 'http://contosobb.azurewebsites.net/tables/ContosoBB';
    rest.getAccount(url, session, username, handleGetAccountResponse)
};

exports.createNewAccount = function postAccount(session, username, currency){
    var url = 'http://contosobb.azurewebsites.net/tables/ContosoBB';
    rest.postAccount(url, username, currency);
    session.send("Congrats! You have just created a new account with Contoso Bank!");
};


function handleGetAccountResponse(message, session, username) {
    var getAccountResponse = JSON.parse(message);
    var allAccounts = [];
    for (var index in getAccountResponse) {
        var account = {};
        account.title = getAccountResponse[index].currency;
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