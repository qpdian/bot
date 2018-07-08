'use strict';

const axios = require('axios');
const messenger = require('../common/messenger');
const saveMessage = require('../commands/save-message') 

const processMessage = require('../commands/process-message');
const eventEmitter = require('../boot/event-emitter');
const urls = require('../common/url-buttons-chatbot');
const botId= '206733020126719' 
const searchSongs =  require('../commands/search-songs')


//postbacks
eventEmitter.on('addFavorite', ( payload , senderId) =>{
    axios.get( `${urls.MARK_AS_FAVORITE}?track_id=${payload.trackId}&sender_id=${payload.senderId}`)
})
eventEmitter.on('Hola', ( senderId ) =>{
    messenger.sendText(senderId, botId,  'Bienvenido a BOT, donde podras buscar y ver las letras de las canciones =)' ) ;
    
})
eventEmitter.on('paginate', ( payload, senderId ) =>{
    console.log( payload)
     searchSongs( payload.titleSong, senderId , payload.page)
                    .then( response => { 
                        eventEmitter.emit('sendList', senderId, response.data  , response.payload)
                    })
})

eventEmitter.on('sendText', ( senderId, text ) => {
       messenger.sendText(senderId, botId,  text ) ;
})
eventEmitter.on('sendList', ( senderId, list , payload) =>{
       messenger.sendList(senderId, botId,  list , payload ) ;
})

eventEmitter.on('sendButtons', ( senderId, buttons ) => {
       messenger.sendButtons(senderId, botId,  buttons ) ;
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
        var receiverId = '';
        var message = '';
        if (req.body.object === 'page') {
            req.body.entry.forEach(entry => {
                entry.messaging.forEach(event => {
                    senderId = event.sender.id;
                    receiverId = event.recipient.id;
                    if ( !!event.message && event.message.text) {
                        
                        saveMessage( senderId, receiverId , event.message )
                        messenger.sendAction( senderId, 'mark_seen')
                        message = event.message.text;
                        
                        processMessage( 
                            senderId, message , 
                            ( ) =>{
                                // messenger.sendAction( senderId, 'typing_on') 
                            },
                            ( text ) => {
                                 messenger.sendText(senderId, receiverId, text ) ;
                            },
                             ( list , entryMessage , payload ) => {
                                 messenger.sendList(senderId, receiverId,  list , payload ) ;
                                 if( entryMessage ) {
               
                                     messenger.sendText( senderId, receiverId, entryMessage)
                                 }
                            },
                             ( buttons ) => {
                                 messenger.sendButtons(senderId, receiverId, buttons ) ;
                            }
                            )
                    }
                    
                    if( event.postback ){
                        
                    
             
                        try{
                            const payload = JSON.parse( event.postback.payload )
                            eventEmitter.emit( payload.name , payload , senderId)
                        }catch(err) {
                         
                            if( event.postback.payload == "Hola" ){
                                 eventEmitter.emit('Hola' , senderId) 
                            }
                           
                        }
                       
                    }
                })
            });
        }
        res.status(200).end();
     }
    WebhookFacebook.remoteMethod('handleMessage', {
        http: { verb: "post", path: "/"},
        accepts: [
        {arg: 'req', type: 'object', 'http': {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
     ],
    });

}