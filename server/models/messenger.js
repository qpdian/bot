const axios = require('axios');
const FACEBOOK_ACCESS_TOKEN = "EAAc0hfsZCeaMBALCQmAUOs2WYCTc4pZCYrt28jiKtmRkiglH6lhOHlOQCNnyuphq3027JhFBQW8XUD355Mj29F27P0bhccoo7mEaZBVt3uVii5jwNFLv0B6XvEUO5QZAZCcMQZC36doBcASQFUQ1kB6guHZAu6d6ZAFvTwTrOGEaUAZDZD"

const messenger = {
    sendMessage(senderId, message ) {
        axios.post(
            `https://graph.facebook.com/v2.6/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`, {
            recipient: { id: senderId },
            message:  message,
        })
        .then(function (response) {
            
        })
        .catch(function (error) {
        
        });
    },
    sendButtons( senderId, buttons){
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
       this.sendMessage(senderId,body)
    },
     sendList( senderId, list){
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
                    "payload": "payload"            
                  }
                ]  
              }
            }
        }
       this.sendMessage(senderId,body)
    }
}

module.exports = messenger 


// senderId 1750040221708437    arthur id
// diana id 1067280970047460

