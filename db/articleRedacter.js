const redactPhrase = [
  
  'Huffington Post',
  'HUFFINGTON',
  'HuffPost',
  'HUFFPOST',
  'HuffPo',
  'HUFFPO',
  'huffpo',

  'New York Magazine',
  'NY Magazine',
  'NEW YORK MAGAZINE',
  'NYMAG',
  'nymag',
  'NYMag',
  'NY Mag',

  'BBC News',
  'BBC',
  'CBBC',

  'The Guardian',
  'THE GUARDIAN',
  'the guardian',

  'New York Times',
  'NYTimes',
  'nytimes',
  'NYTIMES',
  'NY-TIMES',
  'Ny Times',
  'NY Times',

  'Washington Post',
  'washingtonpost',
  'washington post',
  'WashingtonPost',
  'WASHINGTON POST',
  'Democracy Dies in Darkness',

  'newsweek',
  'NEWSWEEK',
  'NewsWeek',

  'the economist',
  'The Economist',
  '#economist',
  'THE ECONOMIST',
  'ECONOMIST',

  'Associated Press',
  'ASSOCIATED PRESS',
  '(AP)',
  'AP)',

  'Wall Street Journal',
  'wsj',
  'WSJ',
  'wall street journal',

  'the-american-conservative',
  'The American Conservative',
  'amconmag',

  'breitbart',
  'Breitbart',
  'BREITBART',

  'fox news',
  'FOX NEWS',
  'Fox News',

  'national review',
  'National Review',
  'NATIONAL REVIEW',

]

module.exports = (article) => {
  let redactedArticle = article;
  redactPhrase.forEach((phrase) => {
    redactedArticle = redactedArticle.replace('/' + phrase + '/g', '(redacted)');
  });
  return redactedArticle;
}