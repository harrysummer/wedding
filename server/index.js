var express = require('express');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var bodyParser = require('body-parser');

var connection = mongoose.connect('mongodb://localhost:27017/wedding');
autoIncrement.initialize(connection);

var router = express.Router();
router.use(bodyParser.json());
router.use('/photo', bodyParser.raw({ limit: '16mb', type: 'image/*' }));

var Post = require('./models/post');
var Photo = require('./models/photo');

router.get('/posts', (req, res) => {
  Post.find({})
      .select('key title date type content icon photos')
      .sort('-key')
      .exec(function(err, docs) {
        if (err)
          res.send(err);
        res.json(docs);
      });
});

router.post('/post', (req, res) => {
  var post = new Post();
  post.type = req.body.type;
  if (req.body.title) post.title = req.body.title;
  if (req.body.date) post.date = req.body.date;
  if (req.body.content) post.content = req.body.content;
  if (req.body.icon) post.icon = req.body.icon;
  if (req.body.photos) post.photos = req.body.photos;
  post.save(function(err) {
    if (err)
      res.send(err);
    res.json({ message: 'Post insertion success.' });
  });
});

router.get('/post/:id', (req, res) => {
  Post.findById(req.params.id)
      .select('key title date type content icon photos')
      .exec(function(err, post) {
        if (err)
          res.send(err);
        res.json(post);
      });
});

router.put('/post/:id', (req, res) => {
  var update = {};
  if (req.body.title) update.title = req.body.title;
  if (req.body.date) update.date = req.body.date;
  if (req.body.type) update.type = req.body.type;
  if (req.body.content) update.content = req.body.content;
  if (req.body.icon) update.icon = req.body.icon;
  if (req.body.photos) update.photos = req.body.photos;
  if (req.body.key) update.key = req.body.key;
  Post.findByIdAndUpdate(req.params.id, update, function(err, post) {
    if (err)
      res.send(err);
    res.json(post);
  });
});

router.delete('/post/:id', (req, res) => {
  Post.findByIdAndRemove(req.params.id, function(err) {
    if (err)
      res.send(err);
    res.json({message: "Delete success"});
  });
});

router.get('/photo/id/:id', (req, res) => {
  Photo.findById(req.params.id, (err, photo) => {
    if (err || !photo) {
      res.status(404).send(err);
      return;
    }
    res.type(photo.mime);
    res.send(photo.content);
  });
});

router.get('/photo/:name', (req, res) => {
  Photo.findOne({name: req.params.name}, (err, photo) => {
    if (err || !photo) {
      res.status(404).send(err);
      return;
    }
    res.type(photo.mime);
    res.send(photo.content);
  });
});

router.post('/photo', (req, res) => {
  var photo = new Photo();
  photo.name = req.get('name');
  photo.mime = req.get('content-type');
  photo.content = req.body;
  photo.save(function(err) {
    if (err)
      res.send(err);
    res.json({ message: 'Photo upload success.' });
  });
});

router.get('*', (req, res) => res.json({ status: 'error' }));

module.exports = router;
