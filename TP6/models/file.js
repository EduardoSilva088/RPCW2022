var mongoose = require('mongoose')

var fileSchema = new mongoose.Schema({
    file: String,
    size: Number,
    type: String,
    date: Date,
    text: String
});

module.exports = mongoose.model('file', fileSchema)