const axios = require('axios');
const extractor = require('unfluff');
const Article = require('./src/schemasLambda.js').Article; // Add this file.  Rewrite the database info.
const sources = require('./src/sources.js');
const AWS = require('aws-sdk');
const NEWS_API_KEY = process.env.NEWS_API_KEY
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(NEWS_API_KEY); 

let counter = 0;
console.log('api key', NEWS_API_KEY)

// fetches articles from news API, outputs [{url: 'washingtonpost.com...', articleStance: -0.5, source: 'The Washington Post}]
var getUrlsFromNewsAPI = () => {
  console.log('getting the URLs');
  return new Promise((resolve, reject) => {
    newsapi.v2.topHeadlines({
      sources: Object.keys(sources).join(','),
      //ultimately this should be 100
      pageSize: 100,
    })
    .then(response => {
      let articles = [];
      response.articles.forEach(article => {   // OK
        let articleObj = {
          url: article.url,
          articleStance: sources[article.source.id],
          source: article.source.name,
        }
        articles.push(articleObj);
      });
      resolve(articles);
    })
    .catch(err => {
      reject(err);
    })
  });
}

var generateArticles = (articles) => {
  console.log('generating articles', articles.length);
  return new Promise((resolve, reject) => {
    var promises = articles.map(article => {
      return parseAndDecorateArticle(article);
    }); 
    Promise.all(promises)
    .then(articles => {    // OK
      resolve(articles);
    })
    .catch(err => {
      reject(err);
    })
  });
}

var parseAndDecorateArticle = (article) => {      // OK
  return new Promise((resolve, reject) => {
    axios.get(article.url)
    .then(response => {
      var webpage = extractor(response.data);
      article.title = webpage.title;
      article.author = webpage.author;
      article.description = webpage.description;
      article.image = webpage.image;
      article.fullText = webpage.text;
      article.votes = {
        agree: {
          summedUserStance: 0,
          totalVotes: 0,
        },
        disagree: {
          summedUserStance: 0,
          totalVotes: 0,
        },
        fun: {
          summedUserStance: 0,
          totalVotes: 0,
        },
        bummer: {
          summedUserStance: 0,
          totalVotes: 0,
        },
        mean: {
          summedUserStance: 0,
          totalVotes: 0,
        },
        worthyAdversary: {
          summedUserStance: 0,
          totalVotes: 0,
        }
      };
      return article;
    })
    .then(article => {
      counter++;
      counter % 10 === 0 ? console.log('article', counter) : null;
      resolve(article);
    })
    .catch(err => {
      //reject(err);
      //console.log('error parsing article', article);
    })
  });
}

var insertArticlesIntoArticlesDb = (articles) => {
  console.log('sending articles to DB');
  articles.forEach(article => {
    if (article.fullText !== "") {
      var newArticle = new Article(article);    // OK, but we need to check the db logic
      newArticle.save(err => {
        //if (err) console.log(`article already exists in db ${article.url}`);
      });
    } else {
      //console.log('article had no fullText, was not inserted'); 
    }
  });
}

var scrapeArticles = () => {
  console.log('Scraping the articles');
  getUrlsFromNewsAPI()       // OK
  .then(urlList => {
    return generateArticles(urlList);  // OK
  })
  .then(articles => {
    insertArticlesIntoArticlesDb(articles);  // OK, but need to check db logic.
    console.log('Articles Inserted');
  })
  .catch(err => {
    console.log('error scraping articles');
  })
}

exports.handler = (event, context) => {
  // The event can be an empty object.
  // The context does not matter.
  scrapeArticles();
}
