var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Photo = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  mime: {
    type: String,
    required: true
  },
  content: {
    type: Schema.Types.Buffer,
    required: true
  }
});

module.exports = mongoose.model('Photo', Photo);
