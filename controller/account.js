var rest = require('../API/Restclient');
var builder = require('botbuilder');

exports.displayAccount = function getAccount(session, username){
    var url = 'https://bankappmarcus.azurewebsites.net/tables/BankBot';
    rest.getAccount(url, session, username, handleGetAccountResponse)
};

exports.createNewAccount = function postAccount(session, username, currency){
    var url = 'https://bankappmarcus.azurewebsites.net/tables/BankBot';
    rest.postAccount(url, username, currency);
    session.send("Your account has been created!");
};

exports.deleteAccount = function deleteAccount(session,username,currency){
    var url  = 'https://bankappmarcus.azurewebsites.net/tables/BankBot';


    rest.getAccount(url,session, username,function(message,session,username){
     var   allAccounts = JSON.parse(message);
        for(var i in allAccounts) {

            if (allAccounts[i].currency === currency && allAccounts[i].username === username) {

                console.log(allAccounts[i]);

                rest.deleteAccount(url,session,username,currency, allAccounts[i].id ,handleDeletedAccountResponse)

            }
        }
    });
};

function handleDeletedAccountResponse(body,session,username, currency) {
    session.send('Deleted');
}    


function handleGetAccountResponse(message, session, username) {
    var getAccountResponse = JSON.parse(message);
    var allAccounts = [];
    for (var index in getAccountResponse) {
        var account = {};
        account.title = getAccountResponse[index].currency;
        account.value = getAccountResponse[index].amount;
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