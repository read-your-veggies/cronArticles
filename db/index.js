const mongoose = require('mongoose');

//connect to article db
const articleDbConn = mongoose.createConnection(process.env.ARTICLES_DATABASE_PATH);
articleDbConn.on('error', function(err){
  if(err) throw err;
});
articleDbConn.once('open', function callback () {
  console.info('connected to articles db');
});

const testDbConn = mongoose.createConnection('mongodb://localhost:27017/testDatabase');
testDbConn.on('error', function(err){
  if(err) throw err;
});
testDbConn.once('open', function callback () {
  console.info('connected to test db');
});


module.exports = { articleDbConn, testDbConn };