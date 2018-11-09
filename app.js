var express = require('express');
var mongoose = require('mongoose');

var app = express()


mongoose.connect('mongodb://localhost/travel_app', { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.redirect('/travel');
})

app.get('/travel', (req, res) => {
    res.render('travel');
})


app.listen(3000, function(){
    console.log("SERVER IS RUNNING!");
})