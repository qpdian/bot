const urls = require('./url-buttons-chatbot');

const presenterTrack = ( track, senderId) => {
    
    return {
        title:  track.track_name ,
        subtitle: track.album_name,
        buttons: [
              {
                "title": "Mostrar letra",
                "type": "web_url",
                "url": `${urls.LYRIC_BY_TRACK_ID}?track_id=${track.track_id}&sender_id=${senderId}&track_name=${track.track_name}`,
                "messenger_extensions": true,
                "webview_height_ratio": "tall",
                "fallback_url": `${urls.LYRIC_BY_TRACK_ID}?track_id=${track.track_id}&sender_id=${senderId}&track_name=${track.track_name}`           
              }
        ]
    }
}
module.exports = presenterTrack
