var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
    name: String,
    origin_name: String,
    poster: String,
    type: [],
    director: [],
    screen_writer: [],
    region: String,
    release_company: String,
    release_date: String,
    alias: String,
    synopsis: String,
});