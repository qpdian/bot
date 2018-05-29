'use strict';

const axios = require('axios');
const messenger = require('./messenger');
const musixmatch = require('./musixmatch');
const app = require('../server.js');
const eventEmitter = require('../boot/event-emitter');

eventEmitter.on('addFavorite', ( payload )=>{
    axios.get('https://bot-ouracademy.c9users.io/api/lyrics/markAsFavorite?'+ payload)
})



const API_AI_TOKEN = '8ba9992bac7245b7a06132bbc48edc10';



const apiAiClient = require('apiai')(API_AI_TOKEN);


const sendFavorities = ( senderId ) => {
    //console.log( app.models)
     app.models.favoriteTrackByUser.find(
           {
               where: { userId: senderId}
           },
            function(err, favorities) {
                
                const favoritiesPresenter = favorities
                       .filter ( item => item.trackData )
                       .map( item => (  transformTrackToPresenter( item.trackData, senderId )))
                       
                       console.log( favoritiesPresenter )
                if( favoritiesPresenter.length>0 ){
                    if(favoritiesPresenter.length>3 ){
                        messenger.sendList( senderId, favoritiesPresenter) 
                    }else{
                        messenger.sendText( senderId, favoritiesPresenter.reduce(( total, prev)=>{ return total + '- '+ prev.title +'\n'},'' )) 
                    }
                    
                        
                }else{
                   messenger.sendText( senderId, 'No tienes canciones favoritas')
               }
            });
    
}
  
const processMessage = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;
    const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'chatbot'});
    apiaiSession.on('response', (response) => {
        const result = response.result;
        processResponseDialogFlow( senderId, result.fulfillment, result.metadata.intentName, result.parameters)
        
    });
    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();

}

const processResponseDialogFlow = ( senderId, fulfillment, intentName , parameters) => {
    switch( intentName ) {
        case 'buscador':  
            musixmatch.searchSongs(1, parameters['any'])
                .then(response => {
                      messenger.sendList(
                          senderId, 
                          response.data.message.body.track_list.map(item => (  transformTrackToPresenter( item.track, senderId )))
                      );
                })
                .catch(error => {
                    console.log(error);
                });
            break;
        case 'favoritos':  sendFavorities(senderId); break;
        default :  messenger.sendText(senderId, fulfillment.speech ) ;
    }
    
}

const transformTrackToPresenter = ( track, senderId) => {
    
    return {
        title:  track.track_name ,
        subtitle: track.album_name,
        buttons: [
              {
                "title": "Mostrar letra",
                "type": "web_url",
                "url": `https://bot-ouracademy.c9users.io/api/lyrics/byTrackId?track_id=${track.track_id}&sender_id=${senderId}`,
                "messenger_extensions": true,
                "webview_height_ratio": "tall",
                "fallback_url": `https://bot-ouracademy.c9users.io/api/lyrics/byTrackId?track_id=${track.track_id}&sender_id=${senderId}`           
              }
        ]
    }
}

const transformResponseToList = ( songList , senderId )=> {
    return songList.map(item => (  transformTrackToPresenter( item.track, senderId )));
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
        if (req.body.object === 'page') {
            req.body.entry.forEach(entry => {
                entry.messaging.forEach(event => {
                    
                    if (event.message && event.message.text) {
                        processMessage(event);
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
