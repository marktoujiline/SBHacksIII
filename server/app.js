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
	console.log("Queue.length: " + queue.length);
	console.log("Playlist.length: " + playlist.length);
	if(q.length > 0){
		return q.first();	
	} else if (p.length > 0) {
		return p.first();
	} else {
		//TODO Scramble playlist, then return p.first();
		return null;	
	}
}

let popNextSong = function(q, p) {
	console.log("Queue.length: " + queue.length);
	console.log("Playlist.length: " + playlist.length);
	if(q.length > 0){
		return q.pop();	
	} else if (p.length > 0) {
		return p.pop();
	} else {
		//TODO Scramble playlist, then return p.first();
		return null;	
	}
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
		//TODO sort by priority
	}
}

app.get('/popNextSong', function (req, res) {
   res.send(JSON.stringify(popNextSong(queue, playlist)))
})

app.get('/getQueue', function (req, res) {
	//TODO set number of elements
	res.send(queue)
})

app.listen(3000, function() {
	console.log('Listening on port 3000');
	addSongByUrl({
		url : "https://www.youtube.com/watch?v=f8E07NEZMAs",
		user : "Admin"
	}, playlist);
	addSongByUrl({
		url : "https://www.youtube.com/watch?v=-zHVW7Zy_vg",
		user : "Admin"
	}, playlist);
})

app.post('/addSong', function(req, res){
	addSongByUrl(req.body, queue);
	//TODO: Different statements depending on if song exist (return number of votes?)
	res.end("Song added yao");
	//TODO: fail check
})
