const app = require('../server.js');
const presenterTrack = require('../common/presenter-track')

const sendFavorities = ( senderId , responseList , responseText ,page  ) => {
     app.models.favoriteTrackByUser.find(
           {
               where: { userId: senderId}
           },
            function(err, favorities) {
                
                const favoritiesPresenter = favorities
                       .filter ( item => item.trackData )
                       .map( item => (  presenterTrack( item.trackData, senderId )))
                       
                if( favoritiesPresenter.length>0 ){
                    if(favoritiesPresenter.length>1 && favoritiesPresenter.length<5 ){
                        responseList( { data : favoritiesPresenter , payload: JSON.stringify({ name: 'paginate-favorities' , page : page+1 }),}  )
                    }else{
                        responseText( favoritiesPresenter.reduce(( total, prev)=>{ return total + '- '+ prev.title +'\n'},'' ) )
                       
                    }
                }else{
                   responseText( 'No tienes canciones favoritas')
               }
            });
    
}
  

module.exports = sendFavorities