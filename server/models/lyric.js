'use strict';

const musixmatch = require('./musixmatch');
const messenger = require('./messenger');

module.exports = function(lyric) {
    
    lyric.byTrackId = function (req, res, cb) {
        
        const trackId = req.query['track_id'];
        const senderId = req.query['sender_id'];
        console.log(trackId)
        musixmatch
            .getLyricByTrackId(trackId)
            .then(response => {
                messenger.sendButtons(
                    senderId, 
                    [
                        {
                            "type":"web_url",
                            "url": `https://bot-ouracademy.c9users.io/api/lyrics/markAsFavorite?track_id=${trackId}&sender_id=${senderId}`,
                            "title":"Guardar como favorito"
                        }
                    ])
                res.redirect( response.data.message.body.lyrics.backlink_url )
            })
            .catch(error => {
                console.log((error))
                 res
                 .status(200)
                 .send( '<div>'+ 'Ups, no se encontro la letra de la cancion q buscabas'+'</div>' );
            })
       
    }
    lyric.remoteMethod('byTrackId', {
        http: { verb: "get", },
        accepts: [
        {arg: 'req', type: 'object', 'http': {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
     ],
    });
    
    lyric.markAsFavorite = function (req, res, cb) {
        
        const trackId = req.query['track_id'];
        const senderId = req.query['sender_id'];
        const app = lyric.app
        const favorities = app.models.favoriteTrackByUser;
        console.log(app.models)
        favorities.create({
                    "userId": senderId,
                    "trackId": trackId,
                    })
                    .then( result  => {})
                    .catch( err => {})
    }
    lyric.remoteMethod('markAsFavorite', {
        http: { verb: "get", },
        accepts: [
        {arg: 'req', type: 'object', 'http': {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
     ],
    });
    

};
