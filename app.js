var config = require('./config')
var express = require('express')
var backend = require('./server')
var invitation = require('./invitation')

var port = process.env.PORT || config.dev.port

var app = express()

app.use('/api', backend)
app.use('/invitation', invitation)
app.use('/fonts', express.static('./dist/static/fonts'))

app.use('/', express.static('./dist'))

var uri = 'http://localhost:' + port

var server = app.listen(port, 'localhost', () => {
  console.log(`Server listening at ${uri}`)
})
