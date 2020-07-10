const express = require('express');
const router = express.Router();
const db = require('../models');
const Spotify = require('node-spotify-api');
const { search } = require('../controllers');

// create a API Spotify Client
let spotify = new Spotify({
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET
});

//Store the results of a request to spotify
let results = [];

// GET ROUTE
router.post('/', function(req, res) {    
    //Get the type of Query from the User
    let type = req.body.param_type;
    // console.log(type);
    // console.log('🏆');

    //Get the query from the user
    let query = req.body.param_query;
    //Clear out old results
    results = [];
    //Make a request to Spotify
    spotify.search({type: type, query: query})
        .then(function (spotRes) {
        // console.log(spotRes[type+'s']);
        // console.log('🥇');

            // Store the artist, song, preview link, and album in the results array
            spotRes[type+'s'].items.forEach(function(ea){
                // console.log(ea.id);
                // console.log('🎲');
                if (type == 'album') {
                    // console.log(ea.id);
                    // console.log('🎲');
                    results.push({id: ea.id,
                                uri: ea.uri,
                                image: ea.images[0],
                                name: ea.name,
                                artist: ea.artists[0].name,
                                // link: ea.external_urls.spotify
                    });
                } else if (type == 'artist') {
                    // console.log(ea.id);
                    // console.log('🤹🏻‍♂️');
                    results.push({id: ea.id,
                                uri: ea.uri,
                                image: ea.images[0],
                                name: ea.name,
                                // link: ea.external_urls.spotify
                    });
                } else if (type == 'track') {
                    // console.log(ea.preview_url);
                    // console.log(ea.id);
                    // console.log('⚓️');
                    results.push({id: ea.id,
                                uri: ea.uri,
                                name:ea.name,
                                artist: ea.artists[0].name,
                                album: ea.album.name,
                                // link: ea.external_urls.spotify,
                                preview: ea.preview_url
                    });
                } 
            });
            // Return results to the view
            // console.log(results);
            // console.log('🎳');
            res.render('auth/search', {results: results});
        })
        .catch(function (err) {
            console.log(err);
            throw err;
        });
    
});


module.exports = router;