var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var citySchema = new mongoose.Schema({
    name: String,
    image: String,
    body: String
})

citySchema.plugin(passportLocalMongoose);


var City = mongoose.model('City', citySchema);

module.exports = City;