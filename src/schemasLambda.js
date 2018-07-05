const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const articleDbConn = require('./index.js').articleDbConn;

const articleSchema = new Schema({
  url: {type: String, unique: true},
  title: String,
  author: Array, // news api always returns an array of strings here
  source: String,
  description: String,
  fullText: String,
  articleStance: Number,
  image: String,
  votes: {
    agree: {
      summedUserStance: Number,
      totalVotes: Number,
    },
    disagree: {
      summedUserStance: Number,
      totalVotes: Number,
    },
    fun: {
      summedUserStance: Number,
      totalVotes: Number,
    },
    bummer: {
      summedUserStance: Number,
      totalVotes: Number,
    },
    mean: {
      summedUserStance: Number,
      totalVotes: Number,
    },
    worthyAdversary: {
      summedUserStance: Number,
      totalVotes: Number,
    },
  },
});

const Article = articleDbConn.model('Article', articleSchema);



module.exports = { Article }