const express = require('express')
const db = require('../models')
const router = express.Router()
const Spotify = require('node-spotify-api');


// create a API Spotify Client
let spotify = new Spotify({
  id: process.env.CLIENT_ID,
  secret: process.env.CLIENT_SECRET
});


// POST /playlist - create a new playlist
router.post('/tracks/:id',(req, res) => {
    spotify
    .request('https://api.spotify.com/v1/albums/'+ req.params.id + '/tracks')
    .then(function(data) {
      console.log(data); 
      console.log('🎡')
      res.render('playlists/tracks', {results: data.items})
    })
    .catch(function(err) {
    console.error('Error occurred: ' + err); 
    })

  db.playlist.create({
    name: req.params.name,
    content: req.params.preview,
    userId: req.body.userId
  })
  .then(function(post) {
    res.redirect('/')
  })
  .catch(function(error) {
    res.status(400).render('main/404')
  })
})

//  create comment
router.post('/:id/comments', (req, res) => {
  db.comment.create ({
    name: req.body.name,
    content: req.body.content,
    playlistId: req.params.id
  }).then(comment => {
    // console.log(comment)
      res.redirect(`/articles/${req.params.id}`)
    }). catch ((error) => {
      console.log(error)
    })
})


// GET /playlist/:id - display a specific post and its author
router.get('playlist/:id', function(req, res) {
  db.playlist.findOne({
    where: { id: req.params.id },
    include: [db.user, db.comment]
  })
  .then(function(playlist) {
    if (!playlist) throw Error()
    console.log(playlist.userId)
    res.render('playlists/show', { playlist: playlist })
  })
  .catch(function(error) {
    console.log(error)
    res.status(500).render('main/500')
  })
})



module.exports = router
