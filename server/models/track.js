'use strict';

const musixmatch = require('../common/musixmatch');
const eventEmitter = require('../boot/event-emitter');
const messagesApp = require('../common/message-app')

module.exports = function(track) {
    
     track.beforeRemote('getLyricByTrackId', function(ctx , unused, next) {
       track.create(
           {
             id: ctx.req.query.track_id, name: ctx.req.query.track_name
           })
           .then( result  => {
               return next();  
            })
           .catch( err => {
               return next();  
            })
     });
    
    track.getLyricByTrackId = function (req, res, cb) {
        console.log( req.query)
        
        const trackId = req.query['track_id'];
        const senderId = req.query['sender_id'];
        musixmatch
            .getLyricByTrackId(trackId)
            .then(response => {
                
                console.log( response.data.message.body.lyrics.backlink_url)
                
                
                
                eventEmitter.emit('sendButtons', senderId,  [
                        {
                            "type":"postback",
                            "payload": JSON.stringify( { name : 'addFavorite', trackId: trackId , senderId : senderId }),
                            "title":"Guardar como favorito"
                        }
                    ])
                res.redirect( response.data.message.body.lyrics.backlink_url )
            })
            .catch(error => {
                 res
                 .status(200)
                 .send( '<div>'+ 'Ups, no se encontro la letra de la cancion q buscabas'+'</div>' );
            })
       
    }
    track.remoteMethod('getLyricByTrackId', {
        http: { verb: "get", },
        accepts: [
        {arg: 'req', type: 'object', 'http': {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
     ],
    });
    
    track.markAsFavorite = function (req, res, cb) {
        
        console.log(req.query)
        
        const trackId = req.query['track_id'];
        const senderId = req.query['sender_id'];
        const app = track.app
        const favorities = app.models.favoriteTrackByUser;
        favorities.create({
                    "userId": senderId,
                    "trackId": trackId,
                    })
                    .then( result  => {
                        eventEmitter.emit('sendText', senderId , messagesApp.FAVORITIES_ADDED )
                    })
                    .catch( err => {
                        eventEmitter.emit('sendText', senderId ,  err.message )
                    })
    }
    track.remoteMethod('markAsFavorite', {
        http: { verb: "get", },
        accepts: [
        {arg: 'req', type: 'object', 'http': {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
     ],
    });
    
};


