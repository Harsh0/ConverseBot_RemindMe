'use strict';
//const send = require('./send');
//const endConversation = require('./endConversation');
const create = require('./createReminder');
module.exports = (session,f,agenda)=>{
  let createReminder = create(session,agenda);
  const actions = {
    send(request,response){
      const {sessionId,context,entities} = request;
      const {text} = response;
      return new Promise((resolve,reject)=>{
        let {fbid} = session.get(sessionId);
        f.txt(fbid,text);
        return resolve();
      })
    },
    endConversation(request){
      console.log(request);
      const {sessionId,context,entities} = request;
      //const {text} = response;
      return new Promise((resolve,reject)=>{
        let {fbid} = session.delete(sessionId);
        f.txt(fbid,"ending conversation");
        return resolve();
      })
    },
    createReminder
  }
  return actions;
}
