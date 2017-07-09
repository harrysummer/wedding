var express = require('express');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var guard = require('express-jwt-permissions')();
var bcrypt = require('bcrypt');

var connection = mongoose.connect('mongodb://localhost:27017/wedding');
autoIncrement.initialize(connection);

var router = express.Router();
router.use('/photo', bodyParser.raw({ limit: '16mb', type: 'image/*' }));

var Post = require('./models/post');
var Photo = require('./models/photo');
var User = require('./models/user');

var privKey = "dr#t*f!)JfO45";

var auth = (permission) => {
  var ret = [
  expressJwt({ secret: privKey }),
  (err, req, res, next) => {
    if (err.code === 'credentials_required')
      res.json({ status: 2 });
    else if (err.code === 'invalid_token')
      res.json({ status: 4 });
    else if (err.name === 'UnauthorizedError')
      res.json({ status: 2 });
  }];
  if (permission) {
    ret = ret.concat([
      guard.check(permission),
      (err, req, res, next) => {
        if (err.code === 'permission_denied')
          res.json({ status: 3 });
      }]);
  }
  return ret;
};

/*
 * status code definitions:
 * 0 - success
 * 1 - general error
 * 2 - need to login
 * 3 - do not have permission
 * 4 - expired
 */

router.get('/posts', (req, res) => {
  Post.find({})
      .select('key title date type content icon photos')
      .sort('-key')
      .exec(function(err, docs) {
        if (err)
          res.send(err);
        else
          res.json(docs);
      });
});

router.get('/posts/abstract', auth(), (req, res) => {
  Post.find({})
      .select('key title type')
      .sort('-key')
      .exec(function(err, docs) {
        if (err)
          res.send(err);
        else
          res.json(docs);
      });
});

router.post('/post', bodyParser.json(), auth('post:create'), (req, res) => {
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
    else
      res.json({ status: 0 });
  });
});

router.get('/post/:id', auth(), (req, res) => {
  Post.findById(req.params.id)
      .select('key title date type content icon photos')
      .exec(function(err, post) {
        if (err)
          res.send(err);
        else
          res.json(post);
      });
});

router.put('/post/:id', bodyParser.json(), auth('post:edit'), (req, res) => {
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
    else
      res.json(post);
  });
});

router.delete('/post/:id', auth('post:remove'), (req, res) => {
  Post.findByIdAndRemove(req.params.id, function(err) {
    if (err)
      res.send(err);
    else
      res.json({ status: 0 });
  });
});

router.get('/photos/abstract', auth(), (req, res) => {
  Photo.find({})
      .select('name mime')
      .sort('name')
      .exec(function(err, docs) {
        if (err)
          res.send(err);
        else
          res.json(docs);
      });
});

router.get('/photo/id/:id', auth(), (req, res) => {
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

router.post('/photo', auth('photo:create'), (req, res) => {
  var photo = new Photo();
  photo.name = req.get('name');
  photo.mime = req.get('content-type');
  photo.content = req.body;
  photo.save(function(err) {
    if (err) {
      err.status = 1;
      res.send(err);
    } else
      res.json({ status: 0 });
  });
});

router.delete('/photo/:name', auth('photo:remove'), (req, res) => {
  Photo.findOneAndRemove({name: req.params.name}, function(err) {
    if (err) {
      err.status = 1;
      res.send(err);
    } else
      res.json({ status: 0 });
  });
});

router.delete('/photo/id/:id', auth('photo:remove'), (req, res) => {
  Photo.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      err.status = 1;
      res.send(err);
    } else
      res.json({ status: 0 });
  });
});

router.post('/users', auth('user:list'), (req, res) => {
  User.find({})
      .select('user password permissions')
      .exec(function(err, docs) {
        if (err)
          res.send(err);
        else
          res.json(docs);
      });
});

router.post('/user', bodyParser.json(), auth('user:view'), (req, res) => {
  var user = new User();
  user.username = req.body.username;
  user.password = req.body.password;
  if (req.body.permissions) user.permissions = req.body.permissions;
  user.save((err) => {
    if (err) {
      err.status = 1;
      res.send(err);
    } else
      res.json({ status: 0 });
  });
});

router.delete('/user/:username', auth('user:remove'), (req, res) => {
  User.findOneAndRemove({username: req.params.username}, (err) => {
    if (err) {
      err.status = 1;
      res.send(err);
    } else
      res.json({ status: 0 });
  });
});

router.delete('/user/id/:id', auth('user:remove'), (req, res) => {
  User.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      err.status = 1;
      res.send(err);
    } else
      res.json({ status: 0 });
  });
});

router.post('/login', bodyParser.json(), (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({ username }, (err, user) => {
    if (err) {
      err.status = 1;
      res.send(err);
    } else if (!user) {
      res.json({ status: 1 });
    } else {
      bcrypt.compare(password, user.password)
      .then((correct) => {
        if (!correct) {
          res.json({ status: 1 });
        } else {
          jwt.sign({
            username,
            permissions: user.permissions,
            exp: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60)
          }, privKey, (err, token) => {
            if (err)
              res.send(err);
            else
              res.json({ status: 0, token });
          });
        }
      });
    }
  });
});

router.get('*', (req, res) => res.json({ status: 1 }));

module.exports = router;
