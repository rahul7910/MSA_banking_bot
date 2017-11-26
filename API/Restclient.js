var request = require('request');

exports.getCurrencyData = function getData(url,session, entities, callback){

    request.get(url,function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body,session, entities);
        }
    });
};

exports.getExchangeData = function getData(url,session, entities, amount, callback){
    
        request.get(url,function(err,res,body){
            if(err){
                console.log(err);
            }else {
                callback(body,session, entities, amount);
            }
        });
    };

exports.getAccount = function getData(url, session, username, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username);
        }
    });
};

exports.postAccount = function getData(url, username, currency){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : username,
            "currency" : currency,
            "amount" : "0"
        }
      };
      
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
      });
};

exports.postDeposit = function getData(url, username, currency, amount){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : username,
            "currency" : currency,
            "amount" : amount
        }
      };
      
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
      });
};

exports.deleteAccount = function deleteData(url,session, username , currency, id, callback){
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };

    request(options,function (err, res, body){
        if( !err && res.statusCode === 200){
            console.log(body);
            callback(body,session,username, currency);
        }else {
            console.log(err);
            console.log(res);
        }
    })

};