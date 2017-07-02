var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var Post = new Schema({
  type: {
    type: String,
    enum: [ 'bride', 'bridegroom', 'shared', 'icon' ],
    required: true
  },
  key: {
    type: Number,
    required: true
  },
  title: String,
  date: String,
  content: String,
  icon: String,
  photos: [String],
});

Post.plugin(autoIncrement.plugin, { model: 'Post', field: 'key', startAt: 100, incrementBy: 100 });

module.exports = mongoose.model('Post', Post);
