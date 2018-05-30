const app = require('../server.js');
const saveMessage = ( senderId, receiverId, content ) => {
     app.models.message.create(
           {
              senderId : senderId , 
              receiverId : receiverId,
              content: content
           })
            .then( result  => {
                      
            })
            .catch( err => {
             
            })
}
 