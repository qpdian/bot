
const musixmatch = require('../common/musixmatch');
const presenterTrack = require('../common/presenter-track');

const searchSongs = ( titleSong , senderId ) => {
    
      return musixmatch.searchSongs(1, titleSong)
                .then(response => {
                     return new Promise((resolve, reject) => {
                         resolve(  
                             response.data.message.body.track_list
                             .map(item => (  presenterTrack( item.track, senderId ))))
                     })
                      
                })
                .catch(error => {
                    console.log(error);
                });
    
}
  

module.exports = searchSongs