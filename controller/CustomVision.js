var request = require('request'); //node module for http post requests
//global variables 
//var n=0;
//var current=0;

exports.retreiveMessage = function (session){


    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/80c49420-3104-42d8-8ef2-039d6a27c81f/url?iterationId=f68fbf74-3806-488b-b3cd-3d139dc0b406',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': 'da8e855685e645ba93a3c7849b48b70f'//change key 
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        console.log(validResponse(body));
        session.send(validResponse(body));
    });
}

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        return "This is " + body.Predictions[0].Tag
    } else{
        
        console.log('Oops, please try again!');
    }
}