'use strict';

module.exports = function(Verification) {
    
    Verification.init = function (req, res, cb) {
        const hubChallenge = req.query['hub.challenge'];
        const hubMode = req.query['hub.mode'];
        const verifyTokenMatches = (req.query['hub.verify_token'] === 'chatbot');
        if (hubMode && verifyTokenMatches) {
         //res.status(200).send(hubChallenge);
         console.log(hubChallenge)
         // cb(null,hubChallenge );
          res.status(200).send(hubChallenge);
        } else {
          res.status(403).end();
         }
    }
    Verification.remoteMethod('init', {
        http: { verb: "get"},
        accepts: [
        {arg: 'req', type: 'object', 'http': {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
     ],
    });

};
