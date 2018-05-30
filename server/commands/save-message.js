const app = require('../server.js');


const saveMessage = ( senderId, receiverId, content ) => {
      const id = senderId + '-' +receiverId;
       app.models.conversation.findOrCreate(
           { fields: { id: id } },
           { id: id },
           (err, instance, created ) => {
                app.models.message.create(
                       {  
                          conversationId : instance.id,
                          senderId : senderId , 
                          receiverId : receiverId,
                          content: content
                       })
           }
          );
}
 
 module.exports = saveMessage