//  setup npm libraries
require('dotenv').config();
const Express = require('express');
const ejsLayouts = require("express-ejs-layouts");
const helmet = require('helmet');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require('./config/ppConfig');
const db = require('./models');
const isLoggedIn = require('./middleware/isLoggedIn');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const Spotify = require('node-spotify-api');
const { search } = require('./controllers');

// app setup
const app = Express();
app.use(Express.urlencoded({ extended: false }));
app.use(Express.static(__dirname + "/public"));
app.set('view engine','ejs');
app.use(ejsLayouts);
app.use(require('morgan')('dev'));
app.use(helmet());

// create new instance of class Sequelize Store
const sessionStore = new SequelizeStore({
    db: db.sequelize,
    expiration: 1000 * 60 * 30
});

// create a API Spotify Client
let spotify = new Spotify({
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET
});

//Store the results of a request to spotify
let results = [];

app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: true
}))

sessionStore.sync();

// initialize passport and session info
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next) {
    res.locals.alerts  = req.flash();
    res.locals.currentUser = req.user;

    next();
});

// ROUTES
app.get('/', function(req, res) {
    // check to see if user logged in
    res.render('index');
})

app.get('/profile', isLoggedIn, function(req, res) {
    // console.log(results);
    res.render('auth/profile');
});

app.get('/search', function(req, res) {
    // console.log(results);
    res.render('auth/search', {title: 'Spotify', results: results});
});

// view albums from artist
app.get('/albums/:id', (req, res) => {
    spotify
    .request('https://api.spotify.com/v1/artists/'+ req.params.id + '/albums')
    .then(function(data) {
    //   console.log(data); 
      res.render('playlists/albums', {results: data.items})
    })
    .catch(function(err) {
    console.error('Error occurred: ' + err); 
    })
});

// // View tracks from album
app.get('/tracks/:id', (req, res) => {
    spotify
    .request('https://api.spotify.com/v1/albums/'+ req.params.id + '/tracks')
    .then(function(data) {
    //   console.log(data); 
    //   console.log('🎡')
      res.render('playlists/tracks', {results: data.items})
    })
    .catch(function(err) {
    console.error('Error occurred: ' + err); 
    })
});


// include auth controller
app.use('/auth', require('./controllers/auth'));
app.use('/tracks', require('./controllers/tracks'));
app.use('/users', require('./controllers/users'));




// initialize App on Port
app.listen(process.env.PORT || 8080, function() {
    console.log(`Listening to the smooth sweet sounds on port ${process.env.PORT} 🛰.`);
});

