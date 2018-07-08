
const musixmatch = require('../common/musixmatch');
const presenterTrack = require('../common/presenter-track');


const searchSongs = ( titleSong , senderId , page) => {
    
      return musixmatch.searchSongs(page, titleSong)
                .then(response => {
                     return new Promise((resolve, reject) => {
                         resolve( { 
                             payload:  JSON.stringify({ name: 'paginate' , titleSong : titleSong , page : page+1 }),
                             data : response.data.message.body.track_list
                             .map(item => (  presenterTrack( item.track, senderId )))
                         })
                     })
                      
                })
                .catch(error => {
                    console.log(error);
                });
    
}
  

module.exports = searchSongs