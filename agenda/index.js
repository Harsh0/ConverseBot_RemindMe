'use strict';

const Agenda = require('agenda');
const {MONGO_URI} = require('../config');
const agenda = new Agenda({
  db:{
    address:MONGO_URI,
  }
});
const createReminder = require('./createReminder');
module.exports = (f)=>{
  //Define agenda jobs

  //createReminder
  createReminder(agenda,f);

  return agenda;
}
