var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Attendee = new Schema({
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: [ 'male', 'female' ],
    required: true
  },
  role: {
    type: String,
    enum: ['relative', 'old_friend', 'classmate']
  },
  side: {
    type: String,
    enum: ['bride', 'bridegroom']
  },
  confirm: Boolean,
  count: Number,
  money: Number,
  note: String
});

module.exports = mongoose.model('Attendee', Attendee);
