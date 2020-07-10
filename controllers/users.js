var express = require('express')
var db = require('../models')
var router = express.Router()

// GET /authors - display all authors
router.get('/', function(req, res) {
  db.author.findAll()
  .then(function(authors) {
    res.render('authors/index', { authors: authors })
  })
  .catch(function(error) {
    res.status(400).render('main/404')
  })
})

// POST /authors - create a new author
router.post('/', function(req, res) {
  db.author.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    bio: req.body.bio
  })
  .then(function(author) {
    res.redirect('/authors')
  })
  .catch(function(error) {
    res.status(400).render('main/404')
  })
})

// GET /authors/new - display form for creating a new author
router.get('/new', function(req, res) {
  res.render('authors/new')
})

// GET /authors/:id - display a specific author and their posts
router.get('/:id', function(req, res) {
  db.author.findOne({
    include: [db.article],
    where: {id: req.params.id}
  }).then(function(author) {
    res.render('authors/show', { author: author })
  }).catch(function(error) {
    console.log(error)
    res.status(400).render('main/404')
  })
})

module.exports = router
