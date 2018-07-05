const mongoose = require('mongoose');
const AWS = require('aws-sdk');
const ARTICLES_DATABASE_PATH=process.env.ARTICLES_DATABASE_PATH

//connect to article db
const articleDbConn = mongoose.createConnection(ARTICLES_DATABASE_PATH);
articleDbConn.on('error', function(err){
  if(err) throw err;
});
articleDbConn.once('open', function callback () {
  console.info('connected to articles db');
});


module.exports = { articleDbConn };