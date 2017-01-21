let express = require('express')
let bodyParser = require('body-parser')
let youtubeParser = require('youtube-parser');
let cors = require('cors');
let app = express() 
app.use(bodyParser.json())
app.use(cors())

//TODO Add timestamp on adding for sorting.
let queue = [];
let playlist = [];
// libraru to add to from to playlist 

let getNextSong = function(q, p) {
	console.log("Queue.length: " + q.length);
	console.log("Playlist.length: " + p.length);
	if(q.length > 0){
		return q.first();	
	} else if (p.length > 0) {
		return p.first();
	} else {
		//TODO Scramble playlist, then return p.first();
		return null;	
	}
}

//TODO get playlist by number
let getUpcomingSongs = function(q, p, n) {
	let upcoming = [];
	console.log("Queue.length: " + p.length);
	console.log("Playlist.length: " + p.length);

	for(i = 0 ; i < n ; i++) {
		if(q.length > i){
			upcoming.push(q[i]);	
		} else if (p.length >= i - q.length) {
			upcoming.push(p[i - q.length]);
		} else {
			//TODO Scramble playlist, then return p.first();	
		}
	}
	return upcoming;
}


let popNextSong = function(q, p) {
	console.log("Queue.length: " + q.length);
	console.log("Playlist.length: " + p.length);
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
				console.log("Adding song to queue");
				q.push({
					url: song.url,
					title: metadata.title,
					user: song.user,
					votes: 1
			});
		});
	} else {
		console.log("Song already in queue, upvoting");
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

app.get('/getUpcomingSongs', function (req, res) {
	let n = 5;
	//TODO set number of elements
	res.send(getUpcomingSongs(queue,playlist,n));
	//res.send(playlist);
})

app.listen(3001, function() {
	console.log('Listening on port 3001');
	hardcodeSongs();
})

app.post('/addSong', function(req, res){
	addSongByUrl(req.body, queue);
	//TODO: fail check
	res.end("Added?");
})

let hardcodeSongs = function(){
	addSongByUrl({
		url : "https://www.youtube.com/watch?v=f8E07NEZMAs",
		user : "Admin"
	}, playlist);
	addSongByUrl({
		url : "https://www.youtube.com/watch?v=-zHVW7Zy_vg",
		user : "Admin"
	}, playlist);
	addSongByUrl({
		url : "https://www.youtube.com/watch?v=1Ga5o7JJquQ",
		user : "Admin"
	}, playlist);
	addSongByUrl({
		url : "https://www.youtube.com/watch?v=sWj2KV2jEPc",
		user : "Admin"
	}, playlist);
	addSongByUrl({
		url : "https://www.youtube.com/watch?v=Fz8h_q4qvNk",
		user : "Admin"
	}, playlist);	
}
