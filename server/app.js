let express = require('express')
let bodyParser = require('body-parser')
let youtubeParser = require('youtube-parser');
let cors = require('cors');
let app = express() 
app.use(bodyParser.json())
app.use(cors())

let playlistLength = 5;

let queue = [];
let playlist = [];
let library = [];
//TODO dont add to playlist what's already in queue
//TODO libraru to add to from to playlist 
//TODO Remove from playlist when adding to queue (dont just add without check)

/**
 *	Fills p, with songs from l until p.size = n
 */
let fillPlaylist = function(p, l, n){
	while(p.length < n && p.length < l.length){
		p.push(l[Math.floor(Math.random() * l.length)]);
	}
}

/**
 *	Sorts playlist by votes then date
 */
let sortPlaylist = function(p){
	p.sort(function(a,b) {
		let votesA = parseInt(a.votes);
		let votesB = parseInt(b.votes);
		if (votesA != votesB) {
			return votesB - votesA;
		} else {
			return a.date - b.date;
		}
	});
}

/**
 *	Return n songs from first q then p. returns q + p if n >= q.length + p.length
 */
let getUpcomingSongs = function(q, p, n) {
	fillPlaylist(playlist, library, playlistLength); //TODO remove this and create proper promise, Also in popNextSong.
	let upcoming = [];
	for(i = 0 ; i < Math.min(n, q.length+p.length) ; i++) {
		if(q.length > i){
			upcoming.push(q[i]);	
		} else if (p.length >= i - q.length) {
			upcoming.push(p[i - q.length]);
		} else {
			console.err("getUpcoming error lol");
		}
	}
	return upcoming;	
}

/**
 *	Gets and removes the next song to be played from q (or p if q is empty)
 */
let popNextSong = function(q, p) {
	fillPlaylist(playlist, library, playlistLength); //TODO remove this and create proper promise, should call in add song
	if(q.length > 0){
		return q.shift();	
	} else if (p.length > 0) {
		//TODO push new song to playlist
		return p.shift();
	} else {
		console.log("popNextSong: Something went terrebly wrong");
		return null;	
	}
}

/**
 *	Adds a song to queue. If song exists, vote up by one
 */
let addSongByUrl = function(song, q, v = 0) {
	existingSong = q.find((s) => {
		return s.url == song.url;
	});

	if (existingSong == null){
		youtubeParser.getMetadata(song.url).then(
			(metadata) => {
				q.push({
					title: metadata.title,
					url: song.url,
					user: song.user,
					votes: v,
					date: new Date
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

app.get('/getUpcomingSongs', function (req, res) {
	let n = 5;
	sortPlaylist(queue);
	//TODO set number of elements
	res.send(getUpcomingSongs(queue,playlist,n));
	//res.send(playlist);
})

app.listen(8081, function() {
	console.log('Listening on port 3001');
	hardcodeSongs();

})

app.post('/addSong', function(req, res){
	addSongByUrl(req.body, queue, 1);
	//TODO: fail check
	res.end("Added?");
})


let hardcodeSongs = function(){
	addSongByUrl({
		url : "https://www.youtube.com/watch?v=f8E07NEZMAs",
		user : "Admin"
	}, library);
	addSongByUrl({
		url : "https://www.youtube.com/watch?v=-zHVW7Zy_vg",
		user : "Admin"
	}, library);
	addSongByUrl({
		url : "https://www.youtube.com/watch?v=1Ga5o7JJquQ",
		user : "Admin"
	}, library);
	addSongByUrl({
		url : "https://www.youtube.com/watch?v=sWj2KV2jEPc",
		user : "Admin"
	}, library);
	addSongByUrl({
		url : "https://www.youtube.com/watch?v=Fz8h_q4qvNk",
		user : "Admin"
	}, library);
}
