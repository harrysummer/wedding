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
var Attendee = require('./models/attendee');

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
  if (req.body.title !== undefined) post.title = req.body.title;
  if (req.body.date !== undefined) post.date = req.body.date;
  if (req.body.content !== undefined) post.content = req.body.content;
  if (req.body.icon !== undefined) post.icon = req.body.icon;
  if (req.body.photos !== undefined) post.photos = req.body.photos;
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
  if (req.body.title !== undefined) update.title = req.body.title;
  if (req.body.date !== undefined) update.date = req.body.date;
  if (req.body.type !== undefined) update.type = req.body.type;
  if (req.body.content !== undefined) update.content = req.body.content;
  if (req.body.icon !== undefined) update.icon = req.body.icon;
  if (req.body.photos !== undefined) update.photos = req.body.photos;
  if (req.body.key !== undefined) update.key = req.body.key;
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
    if (err || !photo || !req.get('referer') || !req.get('referer').includes('.xiarui.net/')) {
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

router.post('/users', auth(), (req, res) => {
  User.find({})
      .select('user password permissions')
      .exec(function(err, docs) {
        if (err)
          res.send(err);
        else
          res.json(docs);
      });
});

router.post('/user', bodyParser.json(), auth('user:create'), (req, res) => {
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

router.get('/attendee', auth(), (req, res) => {
  Attendee.find({})
      .select('name gender role side confirm count money dependant note')
      .exec(function(err, docs) {
        if (err)
          res.send(err);
        else
          res.json(docs);
      });
});

router.post('/attendee', bodyParser.json(), auth('attendee:create'), (req, res) => {
  var attendee = new Attendee();
  attendee.name = req.body.name;
  attendee.gender = req.body.gender;
  attendee.role = req.body.role;
  attendee.side = req.body.side;
  if (req.body.confirm !== undefined) attendee.confirm = req.body.confirm;
  if (req.body.count !== undefined) attendee.count = req.body.count;
  if (req.body.money !== undefined) attendee.money = req.body.money;
  if (req.body.dependant !== undefined) attendee.dependant = req.body.dependant;
  if (req.body.note !== undefined) attendee.note = req.body.note;
  attendee.save((err) => {
    if (err) {
      err.status = 1;
      res.send(err);
    } else
      res.json({ status: 0 });
  });
});

router.put('/attendee/:id', bodyParser.json(), auth('attendee:edit'), (req, res) => {
  var update = {};
  if (req.body.name !== undefined) update.name = req.body.name;
  if (req.body.gender !== undefined) update.gender = req.body.gender;
  if (req.body.role !== undefined) update.role = req.body.role;
  if (req.body.side !== undefined) update.side = req.body.side;
  if (req.body.confirm !== undefined) update.confirm = req.body.confirm;
  if (req.body.count !== undefined) update.count = req.body.count;
  if (req.body.money !== undefined) update.money = req.body.money;
  if (req.body.dependant !== undefined) update.dependant = req.body.dependant;
  if (req.body.note !== undefined) update.note = req.body.note;
  Attendee.findByIdAndUpdate(req.params.id, update, function(err, attendee) {
    if (err)
      res.send(err);
    else
      res.json(attendee);
  });
});

router.delete('/attendee/:id', auth('attendee:remove'), (req, res) => {
  Attendee.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      err.status = 1;
      res.send(err);
    } else
      res.json({ status: 0 });
  });
});

router.get('*', (req, res) => res.json({ status: 1 }));

module.exports = router;
