var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Movie = new Schema({
    name: String,
    duration: String,
    director: String,
    stars: [{
        name: String,
        href: String
    }, {
        name: String,
        href: String
    }],
    type: [],
    language: String,
    release_date: String,
    site: {
        douban_id: String
    },
    description: String
});


module.exports = Movie;
