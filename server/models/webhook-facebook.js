'use strict';

const axios = require('axios');
const messenger = require('../common/messenger');

const processMessage = require('../commands/process-message');
const eventEmitter = require('../boot/event-emitter');
const urls = require('../common/url-buttons-chatbot');

eventEmitter.on('addFavorite', ( payload )=>{
    console.log( `${urls.MARK_AS_FAVORITE}'?${payload}`)
    axios.get( `${urls.MARK_AS_FAVORITE}?${payload}`)
})

eventEmitter.on('sendText', ( senderId, text )=>{
       messenger.sendText(senderId, text ) ;
})
eventEmitter.on('sendList', ( senderId, list )=>{
       messenger.sendList(senderId, list ) ;
})
eventEmitter.on('sendButtons', ( senderId, buttons )=>{
       messenger.sendButtons(senderId, buttons ) ;
})




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
        var senderId = '';
        var message = '';
        if (req.body.object === 'page') {
            req.body.entry.forEach(entry => {
                entry.messaging.forEach(event => {
                    
                    console.log(event)
                    
                    senderId = event.sender.id;
                        
                    if ( !!event.message && event.message.text) {
                        message = event.message.text;
                        processMessage( 
                            senderId, message , 
                            ( text ) => {
                                 messenger.sendText(senderId, text ) ;
                            },
                             ( list ) => {
                                 messenger.sendList(senderId, list ) ;
                            },
                             ( buttons ) => {
                                 messenger.sendButtons(senderId, buttons ) ;
                            })
                    }
                    
                    if( event.postback){
                        const nameAccion = event.postback.payload.split('?')[0]
                        const payload =  event.postback.payload.split('?')[1]
                        eventEmitter.emit( nameAccion , payload)
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
