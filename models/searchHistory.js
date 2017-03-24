var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var searchHistorySchema = new Schema({
    timestamp: Number,
    query: Number
});

searchHistorySchema.index({timestamp: 1});

module.exports = mongoose.model('searchHistory', searchHistorySchema);