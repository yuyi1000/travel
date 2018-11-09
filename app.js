var express = require('express');
var mongoose = require('mongoose');

var app = express()
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://localhost/travel_app', { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

var citySchema = new mongoose.Schema({
    name: String,
    image: String,
    body: String
})

var City = mongoose.model('City', citySchema);

// var sf = new City({
//     name: "San Francsico",
//     image: "https://pixabay.com/get/eb34b30d2cfd1c22d2524518b7444795ea76e5d004b0144594f7c07ca3e8b3_340.jpg",
//     body: "a city must see"
// })

// sf.save();

app.get('/', (req, res) => {
    res.redirect('/travel');
})

app.get('/travel', (req, res) => {
    City.find({}, (err, cities) => {
        if (err) {
            console.log(err);
        } else {
            res.render('travel', {cities})
        }
    })
})

app.get('/travel/new', (req, res) => {
    res.render('new');
})

app.post('/travel', (req, res) => {
    City.create(req.body.city, (err, city) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('travel');
        }
    })
})

app.get('/travel/:id', (req, res) => {
    City.findById(req.params.id, (err, city) => {
        if (err) {
            console.log(err);
        } else {
            res.render('show', {city});
        }
    })
})


app.delete('/travel/:id', (req, res) => {
    City.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/travel');
        }
    })
})



app.listen(3000, function(){
    console.log("SERVER IS RUNNING!");
})

