const app = require('../server.js');
var addDays = require('date-fns/add_days')



const calculateSongMoreSearched = (  ) => {
 
 console.log( mapEntity, entityName )
       const entity = mapEntity[entityName]
       console.log(entity)
       var query = { }
       
       if( date ){
   
        query =   { created: { between:[ new Date(date) , addDays(new Date(date),1) ]} }
       }
       const nameEntity = entity['entity']
       console.log( query )
       return app.models[nameEntity].count(
           query
           ).then(re => {
            var count = re
            console.log(re)
            const qty = count + 1
            
               return new Promise((resolve, reject) => {
                         resolve( `Se ${qty ==1 ? 'hallo '+ qty + ' ' + entity.name : 'hallaron '+ qty + ' ' + entity.plural } `) 
                         if( err) {
                          reject('No se pudo procesar')
                         }
                     })
           } ) 
}
 
 module.exports = calculateQuantityOf
 

 
