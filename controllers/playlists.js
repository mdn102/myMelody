const express = require('express')
const db = require('../models')
const router = express.Router()
const Spotify = require('node-spotify-api');
const methodOverride = require('method-override');

router.use(methodOverride('_method'));


// create a API Spotify Client
let spotify = new Spotify({
  id: process.env.CLIENT_ID,
  secret: process.env.CLIENT_SECRET
});


// POST /playlist 
router.post('/',(req, res) => {
  // create an event
  db.playlist.create({
    title: req.body.title,
    content: req.body.content,
    userId: req.user.id
  })
  .then(function(post) {
    res.redirect('/profile')
  })
  .catch(function(error) {
    res.status(400).render('main/404')
  })
})

//  Post new song to playlist
router.post('/:id',(req, res) => {
  // create a new track of playlist
  db.track.create({
    song: req.body.name,
    artist: req.body.artist,
    album: req.body.album,
    preview: req.body.preview_url,
    playlistId: req.params.id
  })
  .then(function(post) {
    res.redirect('/profile')
  })
  .catch(function(error) {
    res.status(400).render('main/404')
  })
})


// View tracks from playlist
router.get('/:id', (req, res) => {
  db.playlist.findOne({
    where: { id: req.params.id },
    include: [db.user]
  })
  .then(function(playlist) {
    db.track.findAll({
      where: { playlistId: playlist.id },
      attributes: ['song', 'artist', 'album']   
    }).then(tracks => {
          db.comment.findAll({
            where: { playlistId: playlist.id },
            attributes: ['name', 'content', 'createdAt']
          }).then(comments => {
              res.render('playlists/favorite', {playlist: playlist, tracks, comments})
            })
            .catch((err) => {
              console.log(err);
            })
      }).catch((err) => {
        console.log(err);
      })
  }) 
  .catch(function(err) {
  console.error('Error occurred: ' + err); 
  })
});


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


router.delete('/:id', function (req, res) {
  db.playlist.destroy({
    where: {id: req.params.id}
  }).then((playlists) => {
    res.redirect('/profile')
  }).catch(err => {
    console.log(err);
  })
})

// // GET /playlist/:id - display a specific post and its author
// router.get('playlist/:id', function(req, res) {
//   db.playlist.findOne({
//     where: { id: req.params.id },
//     include: [db.user, db.comment]
//   })
//   .then(function(playlist) {
//     if (!playlist) throw Error()
//     console.log(playlist.userId)
//     res.render('playlists/show', { playlist: playlist })
//   })
//   .catch(function(error) {
//     console.log(error)
//     res.status(500).render('main/500')
//   })
// })



module.exports = router
