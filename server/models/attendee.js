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
    enum: ['relative', 'old_friend', 'classmate'],
    required: true
  },
  side: {
    type: String,
    enum: ['bride', 'bridegroom', 'shared'],
    required: true
  },
  confirm: Boolean,
  count: Number,
  money: Number,
  dependant: String,
  note: String
});

module.exports = mongoose.model('Attendee', Attendee);
