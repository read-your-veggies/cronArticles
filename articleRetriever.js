const axios = require('axios');
const extractor = require('unfluff');
const Article = require('./src/schemasLambda.js').Article;
const sources = require('./src/sources.js');
const NEWS_API_KEY = process.env.NEWS_API_KEY
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(NEWS_API_KEY); 

// fetches articles from news API, outputs [{url: 'washingtonpost.com...', articleStance: -0.5, source: 'The Washington Post}]
var getUrlsFromNewsAPI = () => {
  return new Promise((resolve, reject) => {
    newsapi.v2.topHeadlines({
      sources: Object.keys(sources).join(','),
      pageSize: 20,
    })
    .then(response => {
      let articles = [];
      response.articles.forEach(article => {
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
  return new Promise((resolve, reject) => {
    var promises = articles.map(article => {
      return parseAndDecorateArticle(article);
    }); 
    Promise.all(promises)
    .then(articles => {
      resolve(articles);
    })
    .catch(err => {
      reject(err);
    })
  });
}

var parseAndDecorateArticle = (article) => {
  return new Promise((resolve, reject) => {
    axios.get(article.url)
    .then(response => {
      var webpage = extractor(response.data);
      article.title = webpage.title;
      article.author = webpage.author;
      article.description = webpage.description;
      article.image = webpage.image;
      article.fullText = webpage.text;
      article.timestamp = Date.now();
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
      };
      return article;
    })
    .then(article => {
      // counter++;
      // counter % 10 === 0 ? console.log('article', counter) : null;
      resolve(article);
    })
    .catch(err => {
      reject(err);
    })
  });
}

var insertArticlesIntoArticlesDb = (articles) => {
  var promises = articles.map(article => {
    if (article.fullText !== "") {
      var newArticle = new Article(article);
      return newArticle.save()
      .then(res => {
        return 'saved article';
      })
      .catch(err => {
        return 'error saving article', err;
      })
    } else {
      return 'article had no full text, was ignored';
    }
  });
  return Promise.all(promises)
  .then(res => {
    return 'inserted articles into DB';
  })
  .catch(err => {
    return 'error inserting articles into DB', err;
  })
}

var scrapeArticles = () => {
  return getUrlsFromNewsAPI()
  .then(urlList => {
    return generateArticles(urlList);
  })
  .then(articles => {
    return insertArticlesIntoArticlesDb(articles);
  })
  .catch(err => {
    return err;
  })
}

exports.handler = () => {
  return scrapeArticles()
  .then(res => {
    return res;
  })
  .catch(err => {
    return err;
  });
}
