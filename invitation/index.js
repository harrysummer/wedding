var express = require('express');
var mongoose = require('mongoose');
var app = express();
var Attendee = require('../server/models/attendee.js')

var twoToThree = function (name) {
  if (name.length == 2) {
    return name[0] + '　' + name[1];
  } else {
    return name;
  }
};

var getName = function (person) {
  if (!person.dependant) {
    return twoToThree(person.name) + ' ' + (person.gender==='male' ? '先生' : '女士');
  } else {
    return [
      twoToThree(person.name) + ' ' + (person.gender==='male' ? '先生' : '女士'),
      twoToThree(person.dependant) + ' ' + (person.gender==='male' ? '女士' : '先生')
    ];
  }
};

var getHost = function (person) {
};

app.set('views', __dirname + '/view');
app.set('view engine', 'pug');
app.get('/:id', (req, res) => {
  var id = req.params.id;
  Attendee.findById(req.params.id, (err, person) => {
    if (err || !person) {
      res.status(404);
      res.end();
      return;
    }
	  res.render('index', {
      receiver: getName(person),
      date: [ 2017, 7, 28 ],
      date_lunar: [ '丁酉', '闰六', '初六' ],
      week: '五',
      star: [ '新郎 夏　睿', '新娘 张　萌' ],
      event: '结婚典礼',
      place: '安徽省巢湖市银屏路喜庆运升楼一楼',
      time: '11:28（中午）',
      host: [ '夏　睿', '张　萌' ]
    });
  });
});

module.exports = app;
