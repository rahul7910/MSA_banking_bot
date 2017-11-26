var rest = require('../API/Restclient');

exports.makeDeposit = function postDeposit (session, username, currency, balance){
    var url = 'http://contosobb.azurewebsites.net/tables/ContosoBB';
    session.send("Checking if you have an account in " + currency);

    rest.getAccount(url, session, username, function(message, session, username){
        var allAccounts = JSON.parse(message);
        var noAccount = "true";
        for (var i in allAccounts) {  
            if (allAccounts[i].currency === currency && allAccounts[i].username === username) {
                var currentbalance = allAccounts[i].balance;
                var newbalance = parseInt(currentbalance) + parseInt(balance);  

                rest.deleteAccount(url,session,username,currency, allAccounts[i].id , function(message,session,username){
                    console.log("deleted");
                });

                rest.postDeposit(url, username, currency, newbalance);

                noAccount = false;
            } 
            
        }  

        if (noAccount === "true") {
            session.send("You do not have an account in " + currency + "!");
        }
    })

    
};


exports.withdrawn = function postDeposit (session, username, currency, balance){
    var url = 'http://contosobb.azurewebsites.net/tables/ContosoBB';
    session.send("Checking if you have an account in " + currency);

    rest.getAccount(url, session, username, function(message, session, username){
        var allAccounts = JSON.parse(message);
        var noAccount = "true";
        for (var i in allAccounts) {  
            if (allAccounts[i].currency === currency && allAccounts[i].username === username) {
                var currentbalance = allAccounts[i].balance;
                var newbalance = parseInt(currentbalance) - parseInt(balance);  

                rest.deleteAccount(url,session,username,currency, allAccounts[i].id , function(message,session,username){
                    console.log("deleted");
                });

                rest.postDeposit(url, username, currency, newbalance);

                noAccount = false;
            } 
            
        }  

        if (noAccount === "true") {
            session.send("You do not have an account in " + currency + "!");
        }
    })

    
};

