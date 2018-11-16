var mongoose = require('mongoose');


var citySchema = new mongoose.Schema({
    name: String,
    image: String,
    body: String
})


var City = mongoose.model('City', citySchema);

module.exports = City;