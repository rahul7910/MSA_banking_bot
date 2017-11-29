var rest = require('../API/Restclient');
var builder = require('botbuilder');



exports.displayCards = function getHelpData(session, username){
    var url = 'http://contosobb.azurewebsites.net/tables/accounts';
    rest.getHelpData(url, session,username, userOptions);
}


exports.displayStarterCard = function getHelpData2(session){
    var attachment = [];
    var sendCall = 'login';
    var sendCall1 = 'create account';
    var sendCall2 = 'delete account';
    var sendCall3 = 'Check Currency Rate';
    var sendCall4 = 'Image to text';
    var card = new builder.HeroCard(session)
        .title('Hello! How can I help?')
        .buttons([
            builder.CardAction.imBack(session, sendCall,  'Login'),
            builder.CardAction.imBack(session, sendCall1, 'Create Account'),
            builder.CardAction.imBack(session, sendCall2, 'Delete Account'),
            builder.CardAction.imBack(session, sendCall3, 'Check Currency Rate'), 
            builder.CardAction.imBack(session, sendCall4, 'Currency Image to text'),
        ]);
    attachment.push(card);      
    //Displays restaurant hero card carousel in chat box 
    var message = new builder.Message(session)
    .attachmentLayout(builder.AttachmentLayout.carousel)
    .attachments(attachment);
    session.send(message);
}


function userOptions(message, session, username) {
    var attachment = [];
    var restaurants = JSON.parse(message);
    var sendCall = 'balance';
    var sendCall1 = 'deposit';
    var sendCall2 = 'withdraw';
    var sendCall3 = 'logout';
    var sendCall4 = 'Check Currency rate'; 
    var sendCall5 = 'Image to text';
    var card = new builder.HeroCard(session)
        .title('Hello, %s! How can I help you?', username)
        .buttons([
            builder.CardAction.imBack(session, sendCall, 'Check Balance'),
            builder.CardAction.imBack(session, sendCall1, 'Deposit'),
            builder.CardAction.imBack(session, sendCall2, 'Withdraw'),
            builder.CardAction.imBack(session, sendCall3, 'Logout'),
            builder.CardAction.imBack(session, sendCall4, 'Check Currency Rate'), 
            builder.CardAction.imBack(session, sendCall5, 'Currency Image to text'),
        ]);
    attachment.push(card);      
    //Displays restaurant hero card carousel in chat box 
    var message = new builder.Message(session)
    .attachmentLayout(builder.AttachmentLayout.carousel)
    .attachments(attachment);
    session.send(message);
}
