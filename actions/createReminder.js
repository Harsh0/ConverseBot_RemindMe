'use strict';
const {fetchEntity} = require('../utils');
const createReminder = (session,agenda)=>{
    return ({sessionId,context,entities})=>{
      return new Promise((resolve,reject)=>{
        //Fetch and extract entities
        let task = fetchEntity(entities,'task');
        let datetime = fetchEntity(entities,'datetime');
        //Update the context with task and time
        if(task){
          context.task = task;
          delete context.missingTask;
        }else{
          context.missingTask = true;
        }
        if(datetime){
          context.datetime = datetime;
          delete context.missingTime;
        }else{
          context.missingTime = true;
        }
        if(context.datetime&&context.task){
          delete context.missingTime;
          delete context.missingTask;
          context.jobDone = true;
          //fetch the fbid of the user
          let {fbid} = session.get(sessionId);
          //call agenda to set reminder
          agenda.now('createReminder',{
            fbid,
            datetime:context.datetime,
            task:context.task
          });
          console.log(`Reminding user to ${context.task} at ${context.datetime}`);
        }



        //resolve th Promise
        return resolve(context);
      })
    }
}
module.exports = createReminder;
