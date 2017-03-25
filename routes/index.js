var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Search = require('bing.search');
var search = new Search('48e92d69628247e3affa734e93990a4a');

var SearchHistory = require('../models/searchHistory');

router.get('/api/search/:query', function (req, res, next) {
  let query = req.params.query,
      offset = req.query.offset || 10,
      timestamp = Date.now();

  search.images(query, function(err, results){
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(results(results.map(createResults)));
    }
  });

  let queryHistory = new SearchHistory({query, timestamp});
  queryHistory.save();
});

router.get('/api/latest', function (req, res, next) {
  SearchHistory
    .find()
    .select({_id: 0, query: 1, timestamp: 1})
    .sort({timestamp: -1})
    .limit(10)
    .then(function (err, results) {
      res
        .status(200)
        .json(results);
    });
});

module.exports = router;

function createResults(doc) {
  return {
    url: doc.url,
    title: doc.title,
    thumbnail: doc.thumbnail,
    source: doc.source,
    type: doc.type
  }
}