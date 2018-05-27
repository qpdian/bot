'use strict';

const axios = require('axios');

const FACEBOOK_ACCESS_TOKEN = "EAAc0hfsZCeaMBANU4PSOVr3qFzBsIHAmoRkZAHJS6nq0J8HhamqZAQC3XAEmBY6zZCZA7914uyHPBCzl3CiWOfg1D3TVhmnCZBTYYHLjXt3825De0OnfpdRZCYRZCwiX6d5kgcqWSXDyS0zapTPIoFzNUVtAyzZBp7jebZAg06FQiB8QZDZD"
const API_AI_TOKEN = 'b95db26c455c4ed681f1a7ac0f591f5f';


const apiAiClient = require('apiai')(API_AI_TOKEN);


const sendTextMessage = (senderId, text) => {
    axios.post(
        `https://graph.facebook.com/v2.6/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`, {
        recipient: { id: senderId },
        message: { text },
    })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}
  
const processMessage = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;
    
    
    const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'chatbot'});
    apiaiSession.on('response', (response) => {
        const result = response.result.fulfillment.speech;
        sendTextMessage(senderId, result);
    });
    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();

}



module.exports = function(WebhookFacebook) {
    
    WebhookFacebook.verification = function (req, res, cb) {
        const hubChallenge = req.query['hub.challenge'];
        const hubMode = req.query['hub.mode'];
        const verifyTokenMatches = (req.query['hub.verify_token'] === 'chatbot');
        if (hubMode && verifyTokenMatches) {
          res.status(200).send(hubChallenge);
        } else {
          res.status(403).end();
         }
    }
    WebhookFacebook.remoteMethod('verification', {
        http: { verb: "get", path: "/"},
        accepts: [
        {arg: 'req', type: 'object', 'http': {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
     ],
    });
    
    WebhookFacebook.handleMessage = function (req, res, cb) {
        console.log(req.body)
        if (req.body.object === 'page') {
            req.body.entry.forEach(entry => {
                entry.messaging.forEach(event => {
                    console.log('event', event)
                    if (event.message && event.message.text) {
                        processMessage(event);
                    }
                });
        });
        res.status(200).end();
       }
     }
    
    WebhookFacebook.remoteMethod('handleMessage', {
        http: { verb: "post", path: "/"},
        accepts: [
        {arg: 'req', type: 'object', 'http': {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
     ],
    });

};
