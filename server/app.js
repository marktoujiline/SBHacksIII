let express = require('express')
let bodyParser = require('body-parser')
let youtubeParser = require('youtube-parser');
let app = express() 
app.use(bodyParser.json())

let queue = [];
let playlist = [];

//TODO
//needs to figure out which song to return from q and p
//if q is empty, 
let getNextSong = function(q, p) {
	//if(! q.empty())
	//	return  q.pop()
	//else if
	//	return p.pop();
 	//else
	//	scramble new playlist
	
	return JSON.stringify(q.pop());
}

/**
 *	Adds a song to queue. If song exists, vote up by one
 */
let addSongByUrl = function(song, q) {
	existingSong = q.find((s) => {
		return s.url == song.url;
	});
	if (existingSong == null){
		youtubeParser.getMetadata(song.url).then(
			(metadata) => {
				q.push({
					url: song.url,
					title: metadata.title,
					user: song.user,
					votes: 1
			});
		});
	} else {
		existingSong.votes++;
	}
}

app.get('/', function (req, res) {
   let json = JSON.stringify({
      key : 'value',
      key1: 'value1'
   });
   res.send(json)
})

app.get('/song', function (req, res) {
   
   let json = JSON.stringify({
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

app.post('/addSong', function(req, res){
	addSongByUrl(req.body, queue);
	
	//TODO: Different statements depending on if song exist (return number of votes?)
	res.end("Song added yao");
	//TODO: fail check
})
