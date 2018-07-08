const axios = require('axios');
const FACEBOOK_ACCESS_TOKEN =  process.env.FACEBOOK_TOKEN;

const saveMessage = require('../commands/save-message') 

const URL_FACEBOOK = `https://graph.facebook.com/v2.6/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`;
const messenger = {
    sendMessage(senderId, receiverId , message ) {
        axios.post(
            URL_FACEBOOK, {
            recipient: { id: senderId },
            message:  message,
        })
        .then(function (response) {
            //saveMessage(receiverId, senderId, message)
        })
        .catch(function (error) {
            console.log( "eror post", Object.keys((error))
        });
    },
    sendText( senderId, receiverId,  text){
       const body =  { 
          "text": text
       }
       this.sendMessage(senderId, receiverId, body)
    },
    sendButtons( senderId, receiverId, buttons){
       const body =  { 
          "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"Qué haras luego?",
                "buttons": buttons
              }
         }
       }
       
       this.sendMessage(senderId, receiverId, body)
    },
     sendList( senderId, receiverId, list , payload){
       const body =  { 
           "attachment": {
              "type": "template",
              "payload": {
                "template_type": "list",
                "top_element_style": "compact",
                "elements": list,
                 "buttons": [
                  {
                    "title": "Ver más",
                    "type": "postback",
                    "payload": payload           
                  }
                ]  
              }
            }
        }
       this.sendMessage(senderId, receiverId, body)
    },
    
    sendAction( to , actionName ){
        axios.post(
            URL_FACEBOOK, {
            recipient: { id: to },
            sender_action: actionName
        })
        .then(function (response) {
     
        })
        .catch(function (error) {
            console.log(error)
        });
    },
    
    sendGreeting(){
        
        axios.post(
            URL_FACEBOOK, 
              { "greeting": [
                {
                  "locale":"default",
                  "text":"Hello!" 
                }, 
                {
                  "locale":"en_US",
                  "text": "Hola{{user_first_name}}!"
                }
              ]
            }
         )
    }
        
}

module.exports = messenger 


