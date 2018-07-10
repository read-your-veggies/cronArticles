const mongoose = require('mongoose');

//connect to article db
const articleDbConn = mongoose.createConnection('mongodb://articles_admin:articles321@ds125031.mlab.com:25031/veggies_articles');
articleDbConn.on('error', function(err){
  if(err) throw err;
});
articleDbConn.once('open', function callback () {
  console.info('connected to articles db');
});


module.exports = { articleDbConn };