 var rest = require('../API/Restclient');
var builder = require('botbuilder');


exports.displayCurrencyCards = function getCurrencyData(session,base, currency){
    //http://fixer.io/ provides latest updates for currency 
    var url = "https://api.fixer.io/latest?base="+base.toUpperCase();

    rest.getCurrencyData(url, session,base,currency,displayCards);
}
 
 function displayCards(message, session, base, currency ){

        var allcurrency = JSON.parse(message);
        var allrate = allcurrency.rates;
        //var date = allcurrency.date;
        var rate = [];
        for (var index in allrate){
           //check for correct format in currency 
            if (index.toUpperCase() === currency.toUpperCase()){
                //push onto array 
                rate.push(allrate[index]);
                }      
            }
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
                                "text": base.toUpperCase(),
                                "size": "medium"
                            },
                            {
                                "type": "TextBlock",
                                "text": "Currency Information:"
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
                                                "type": "TextBlock",
                                                //"text": "date:" + date,
                                                "size": "medium",
                                                "weight": "bolder",
                                            }
                                        ]
                                    }
                                ]
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
                                                "type": "TextBlock",
                                                "text": currency.toUpperCase() +':'+rate[0],
                                                "size": "small",
                                                "weight": "bolder",
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