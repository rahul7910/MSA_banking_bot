var rest = require('../API/Restclient');
var builder = require('botbuilder');
var GreetingCardBuilder = require('./GreetingCard');

// Withdraw money
exports.withdraw = function withdraw(session, username, amount) {
    var urlAccounts = 'http://contosobb.azurewebsites.net/tables/accounts';
    var urlCheckTable = 'http://contosobb.azurewebsites.net/tables/checks';
    rest.getBalance2(urlAccounts, amount, session, username, enoughBalance);
}

exports.deposit = function deposit(session, username, amount) {
    var urlAccounts = 'http://contosobb.azurewebsites.net/tables/accounts';
    var urlCheckTable = 'http://contosobb.azurewebsites.net/tables/checks';
    rest.getBalance2(urlAccounts, amount, session, username, depositBalance);
}

function enoughBalance(message, amount, session, username) {
    var handleBalanceResponse = JSON.parse(message);
    var balanceGot;
    var balance = parseFloat(0).toFixed(2);
    var idExist;
    for (var index in handleBalanceResponse) {
        var usernameReceived = handleBalanceResponse[index].username;
        var subBalance = parseFloat(handleBalanceResponse[index].balance);
        if (username.toLowerCase()===usernameReceived.toLowerCase()) {
            balanceGot = subBalance.toFixed(2);
            idExist = handleBalanceResponse[index].id;;
            break;
        }
    }
    if (idExist === null || idExist === undefined) {
        session.send("No matching username found!")
        session.send("Type 'Login' to login again!");
        session.endConversation();
        
    } else {
        amount = parseFloat(amount);
        amount = amount.toFixed(2);;
        var greater = +balanceGot - +amount;
        greater.toFixed(2);
        console.log(greater);
        if (greater >= 0.00) {
            var urlCheckTable = 'http://contosobb.azurewebsites.net/tables/checks';
            var urlAccounts = 'http://contosobb.azurewebsites.net/tables/accounts' + idExist;
            
            rest.deductAmount(urlAccounts, greater, amount, session);
        } else {
            session.send("Don't have enough money to withdraw, please check your balance!");
            GreetingCardBuilder.displayHelperCards(session, username);  
        }
    }          
    
}

/* Deposit Money
exports.deposit = function deposit(session, username, serialNumber) {
    //var urlChequeTable = 'http://msa-lewis-bankapp.azurewebsites.net/tables/chequeTable';
    var urlAccounts = 'http://msa-lewis-bankapp.azurewebsites.net/tables/accounts';
    // console.log(username);
    // console.log(amount);
    // console.log("==================")
    rest.getBalance2(urlAccounts, serialNumber, session, username, checkSerial);
}
*/

function depositBalance(message, amount, session, username) {
    var handleBalanceResponse = JSON.parse(message);
    var balanceGot;
    var balance = parseFloat(0).toFixed(2);
    var idExist;
    for (var index in handleBalanceResponse) {
        var usernameReceived = handleBalanceResponse[index].username;
        var subBalance = parseFloat(handleBalanceResponse[index].balance);
        if (username.toLowerCase()===usernameReceived.toLowerCase()) {
            balanceGot = subBalance.toFixed(2);
            idExist = handleBalanceResponse[index].id;;
            break;
        }
    }
    if (idExist === null || idExist === undefined) {
        session.send("No matching username found!")
        session.send("Type 'Login' to login again!");
        session.endConversation();
        
    } else {
        amount = parseFloat(amount);
        amount = amount.toFixed(2);;
        //adds amount
        var greater = +balanceGot + +amount;
        greater.toFixed(2);
        console.log(greater);
        if (greater >= 0.00) {
            var urlCheckTable = 'http://contosobb.azurewebsites.net/tables/checks';
            var urlAccounts = 'http://contosobb.azurewebsites.net/tables/accounts' + idExist;
            
            rest.addAmount(urlAccounts, greater, amount, session);
        } else {
            session.send("Please enter a valid number to deposit");
            GreetingCardBuilder.displayHelperCards(session, username);  
        }
    }          
    
}

//what do these do? 

function beforeIDHolder(message, session, amount) {
    var urlCheckTable = 'http://contosobb.azurewebsites.net/tables/checks';
    rest.AddCheck(urlCheckTable, session, amount, idHolder);
}


function idHolder(message, session) {
    console.log("========id1 is %s", message.id);
    session.send("Serial Number:  %s" , message.id);
    session.send("Withdrawal Amount:  $ %s" , message.amount);
    session.send("Withdrawal Completed! Please save Serial Number provided to use check issued.");
    session.endConversation();
}



// GetBalance
exports.displayBalance = function getBalance(session, username){
    var url = 'http://contosobb.azurewebsites.net/tables/accounts';
    rest.getBalance(url, session, username, handleBalanceResponse)
};
function handleBalanceResponse(message, session, username) {
    var handleBalanceResponse = JSON.parse(message);
    var balanceGot;
    var balance = parseFloat(0).toFixed(2);
    var idExist;
    for (var index in handleBalanceResponse) {
        var usernameReceived = handleBalanceResponse[index].username;
        var subBalance = parseFloat(handleBalanceResponse[index].balance);
        // balance = +balance + +subBalance.toFixed(2);
        if (username.toLowerCase()===usernameReceived.toLowerCase()) {
            balanceGot = subBalance.toFixed(2);
            idExist = handleBalanceResponse[index].id;;
            break;
        }
    }
    if (idExist === null || idExist === undefined) {
        session.send("There is no matching Username in the system!");
        session.send("Please try again after creating account!");
        session.endConversation();
        
    } else {// Print all favourite foods for the user that is currently logged in
        session.send("%s, your current balance is: NZD %s", usernameReceived, balanceGot);
        GreetingCardBuilder.displayHelperCards(session, username);    
    }          
    
}


// handle login
exports.NewLogin = function NewLogin(session, username){
    var url = 'http://contosobb.azurewebsites.net/tables/accounts';
    rest.NewLogin(url, session, username, handleUndefinedUser)
};
function handleUndefinedUser(message,session,username) {
    var url = 'http://contosobb.azurewebsites.net/tables/accounts';
    var handleExistance = JSON.parse(message);
    var idExist;
    for (var index in handleExistance) {
        var usernameReceived = handleExistance[index].username;
        if (username.toLowerCase() ===usernameReceived.toLowerCase()) {
            idExist = handleExistance[index].id;
        }
    }
    if (idExist === null || idExist === undefined) {
        session.send("Username does not exist in the server! Please check username!");
        session.endConversation();
    } else {
        GreetingCardBuilder.displayHelperCards(session, username);  // <---- THIS LINE HERE IS WHAT WE NEED 
    }
}

// add new user
exports.AddAccount = function AddAccount(session, username){
    var url = 'http://contosobb.azurewebsites.net/tables/accounts';
    rest.userExist(url,session,username,handleExistance);
};
function handleExistance(message,session,username) {
    var url = 'http://contosobb.azurewebsites.net/tables/accounts';
    var handleExistance = JSON.parse(message);
    var idExist;
    for (var index in handleExistance) {
        var usernameReceived = handleExistance[index].username;
        if (username.toLowerCase() ===usernameReceived.toLowerCase()) {
            idExist = handleExistance[index].id;
        }
    }
    if (idExist === null || idExist === undefined) {
        rest.AddAccount(url, username);
        // session.send("welcome %s", username);
        session.send("Congrats! You have just created a new account with Contoso Bank!");
        GreetingCardBuilder.displayHelperCards(session,username);
    } else {
        session.send("Username already exist in the server! Use other username!");
        session.endConversation();
    }
}


//delete user
exports.deleteUser = function deleteUser(session, username){
    var url = 'http://contosobb.azurewebsites.net/tables/accounts';
    rest.userExist(url,session,username,handleUserForDelete);
};

function handleUserForDelete(message,session,username) {
    var url = 'http://contosobb.azurewebsites.net/tables/accounts';
    var handleExistance = JSON.parse(message);
    var idExist;
    for (var index in handleExistance) {
        var usernameReceived = handleExistance[index].username;
        if (username.toLowerCase() ===usernameReceived.toLowerCase()) {
            idExist = handleExistance[index].id;
        }
    }
    rest.deleteUser(url,session,idExist, handleDeletedUserResponse);
}

function handleDeletedUserResponse(body, session) {
    session.endConversation();
    console.log('Done');
}








