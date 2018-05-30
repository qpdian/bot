'use strict';
const messagesError = require('../common/message-error')
const ErrorApplication = require('../common/error')

const musixmatch = require('../common/musixmatch');

module.exports = function(Favoritetrackbyuser) {
    
    Favoritetrackbyuser.observe('before save',  function(ctx , next) {
        
       Favoritetrackbyuser.find(
           {
               where: {userId: ctx.instance.userId, trackId: ctx.instance.trackId}
           },
            function(err, favorities) {
               if( favorities.length>0 ){
                  return  next( new ErrorApplication( 409, messagesError.FAVORITIES_ALREADY_EXISTS));
               }else{
                    musixmatch
                        .getTrackById(ctx.instance.trackId)
                        .then(response => {
                            ctx.instance.trackData = response.data.message.body.track;
                            return next(); 
                        })
               }
            });
    });
    

    
};
