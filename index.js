exports.handler = () => {
  var scrapeArticles = require('./db/articleHelpers.js').scrapeArticles;
  
  return scrapeArticles()
  .then(res => {
    return res;
  })
  .catch(err => {
    return err;
  });
}