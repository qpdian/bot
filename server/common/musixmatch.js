const axios = require('axios');
const API_MUSIXMATCH = '562c0a6fd6b6aa3162b2c67bd9dcf79a'
const ENDPOINT = 'http://api.musixmatch.com/ws/1.1'
const musixmatch = {
    
    searchSongs( page , songTitle) {
        return axios.get(
            `${ENDPOINT}/track.search`, 
              {
                params: {
                    apikey: API_MUSIXMATCH,
                    q_track_artist : songTitle,
                    page_size : 4,
                    page,
                    s_track_rating : 'desc'
               }
              });
    },
    getLyricByTrackId( trackId ) {
        return axios.get(   
            `${ENDPOINT}/track.lyrics.get`, 
              {
                params: {
                    apikey: API_MUSIXMATCH,
                    track_id : trackId
               }
              });
    },
    getTrackById( trackId ) {  
        return axios.get(   
            `${ENDPOINT}/track.get`, 
              {
                params: {
                    apikey: API_MUSIXMATCH,
                    track_id : trackId
               }
              });
    }
}

module.exports = musixmatch 



