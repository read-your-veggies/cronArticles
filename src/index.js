const mongoose = require('mongoose');

//connect to article db
const articleDbConn = mongoose.createConnection(process.env.ARTICLES_DATABASE_PATH);
articleDbConn.on('error', function(err){
  if(err) throw err;
});
articleDbConn.once('open', function callback () {
  console.info('connected to articles db');
});


module.exports = { articleDbConn };