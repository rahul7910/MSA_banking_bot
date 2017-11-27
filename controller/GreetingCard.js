
var builder = require('botbuilder');
var luis = require("./Luisdialog");

exports.displayGreetingCard = function displayGreetingCard(session){
    var attachment = [];
    //button array 
    var cardButtons = [];

    //https://docs.microsoft.com/en-us/bot-framework/dotnet/bot-builder-dotnet-add-rich-card-attachments 

    var card = new builder.HeroCard(session)
        .title("Welcome to the Bank of Contoso!")
        .text("What would you like to do today?")
        .buttons([
            builder.CardAction.imBack(session,"Create Account","Create account"),
            builder.CardAction.imBack(session,"Login","Login"),
            //try add these when you logged in 
            //builder.CardAction.imBack(session,"Withdraw","Withdraw"),
            //builder.CardAction.imBack(session, "Deposit","Deposit")
        ]);
        //push to array and show in bot 
    attachment.push(card);

    var message = new builder.Message(session).attachments(attachment);
    //display in bot 
    session.send(message);
}