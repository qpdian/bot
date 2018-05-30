const sendFavorities = require('./send-favorities')
const searchSongs = require('./search-songs')
const reportQuantities = require('./report-quantity')

const API_AI_TOKEN = '8ba9992bac7245b7a06132bbc48edc10';
const apiAiClient = require('apiai')(API_AI_TOKEN);




const processMessage = ( sessionId, text, responseText, responseList , responseButtons ) => {
 
    const apiaiSession = apiAiClient.textRequest(text, {sessionId: sessionId });
    apiaiSession.on('response', (response) => {
        const result = response.result;
        const intentName = result.metadata.intentName;
        const parameters =  result.parameters;
        const fulfillment = result.fulfillment;
        
        if( result.actionIncomplete ){
            responseText && responseText( fulfillment.speech );
       
        }else{
            
            switch( intentName ) {
                case 'buscador':   
                    searchSongs( parameters['any'], sessionId ).then( songs => { responseList(songs) }); break;
                case 'favoritos':  
                    sendFavorities(
                        sessionId, 
                        ( contentAsList ) => { responseList(contentAsList) },
                        ( contentAsText ) => { responseText(contentAsText) }); 
                    break;
                case 'reportesCantidad': 
                    console.log(parameters)
                    reportQuantities( parameters['tipoEntidad'], parameters['date'] )
                    .then( message =>{
                       responseText( message );  
                        
                    })
                    break;
                default :  responseText( fulfillment.speech ); 
            }
        }
    });
    
    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
}

module.exports = processMessage