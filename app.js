var express = require('express');
var mongoose = require('mongoose');

var app = express()
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var passport = require('passport');
var LocalStrategy = require('passport-local');

var City = require('./models/city');
var User = require('./models/user');

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/travel_app', { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "hello world.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
})

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

app.get('/travel/new', isLoggedIn, (req, res) => {
    res.render('new');
})

app.post('/travel', isLoggedIn, (req, res) => {
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

app.get('/travel/:id/edit', isLoggedIn, (req, res) => {
    City.findById(req.params.id, (err, city) => {
        if (err) {
            console.log(err);
        } else {
            res.render('edit', {city});
        }
    })
})


app.put('/travel/:id', isLoggedIn, (req, res) => {
    City.findByIdAndUpdate(req.params.id, req.body.city, (err, city) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/travel/' + req.params.id);
        }
    })
})


app.delete('/travel/:id', isLoggedIn, (req, res) => {
    City.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/travel');
        }
    })
})


app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/travel"); 
        });
    })
})



app.get('/login', (req, res) => {
    res.render('login');
})


app.post('/login', passport.authenticate("local", {
    successRedirect: '/travel',
    failureRedirect: '/login'
}), (req, res) => {})


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/travel');
})


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(3000, function(){
    console.log("SERVER IS RUNNING!");
})

