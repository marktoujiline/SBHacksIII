var express = require('express')
var app = express()

var queue = [];
var playlist = [];

//TODO
//needs to figure out which song to return from q and p
//if q is empty, 
var getNextSong = function(q, p) {
   return "Bad blood";
}

app.get('/', function (req, res) {
   var json = JSON.stringify({
      key : 'value',
      key1: 'value1'
   });
   res.send(json)
})

app.get('/song', function (req, res) {
   
   var json = JSON.stringify({
      key : 'blah',
      key1: 'blah'
   });
   res.send(getNextSong(queue, playlist))
})

app.get('/queue', function (req, res) {
   res.send(queue)
})

app.listen(3000, function() {
   console.log('Listening on port 3000');
}) 
