let express = require('express')
let bodyParser = require('body-parser')
// Search youtube
// 		get song title from url
let youtubeParser = require('youtube-parser');
let YoutubeSearch = require('youtube-node');
let validUrl = require('valid-url');
//		get song url from name
let youtubeSearch = new YoutubeSearch().setKey('AIzaSyCHJm6PCl0UTLx_dVTxb3CHP3i2GJf7AYY');

// Express stuff
let cors = require('cors');
let app = express() 
app.use(bodyParser.json())
app.use(cors())

//TODO Add timestamp on adding for sorting.
let queue = [];
let playlist = [];
let library = [];
//TODO dont add to playlist what's already in queue
//TODO libraru to add to from to playlist 

let getNextSong = function(q, p) {
	if(q.length > 0){
		return q.first();	
	} else if (p.length > 0) {
		return p.first();
	} else {
		//TODO Scramble playlist, then return p.first();
		return null;	
	}
}

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

//TODO get playlist by number
let getUpcomingSongs = function(q, p, n) {
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


let popNextSong = function(q, p) {
	if(q.length > 0){
		return q.shift();	
	} else if (p.length > 0) {
		//TODO push new song to playlist
		return p.shift();
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
					title: metadata.title,
					url: song.url,
					user: song.user,
					votes: 1,
					date: new Date
			});
		});
	} else {
		existingSong.votes++;
		//TODO sort by priority
	}
}

function addSongByName(song, queue) {
	console.log("lol worked");
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

app.listen(3001, function() {
	console.log('Listening on port 3001');
	hardcodeSongs();
})

app.post('/addSong', function(req, res){
	// TODO: make better
	// Test if a url
	if((validUrl(req.body.url))) {
		if((req.body.url.includes('youtu.be/') || 
			req.body.url.includes('youtube.com/'))) {
				addSongByUrl(req.body, queue);	
		} else {
			res.statusCode(400);
		}
	}
	else {
		addSongByName(req.body, queue).then((resolve, reject) => res.statusCode(200));
	}
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
