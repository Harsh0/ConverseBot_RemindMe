'use strict';

module.exports = (agenda,f)=>{
  return agenda.define('createReminder',job=>{
    //extract fbid,task and datetime
    const {fbid,task,datetime} = job.attr.data;
     f.getProfile(fbid)
     .then(profile=>{
       console.log(profile);
     })
     .catch(err=>{
       console.log(err);
     })
  })
}
