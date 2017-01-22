let express = require('express')
let bodyParser = require('body-parser')
// Search youtube
// 		get song title from url
let youtubeParser = require('youtube-parser');
let YoutubeSearch = require('youtube-node');
let validUrl = require('valid-url');
//		get song url from name
let youtubeSearch = new YoutubeSearch();
youtubeSearch.setKey('AIzaSyCHJm6PCl0UTLx_dVTxb3CHP3i2GJf7AYY');
youtubeSearch.addParam('order', 'relevance');

// Express stuff
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
	}
}

function addSongByName(song, q, v) {
	return new Promise((resolve, reject) => {
		existingSong = q.find((s) => {
			return s.url == song.url;
		});

		if (existingSong == null){
			youtubeSearch.search(song.title, 1, function(error, result) {
				if (error) {
					console.log(error);
					reject(error);
				}
				else {
					if(result.items.length === 0) {
						reject("No results");
						return;
					}
					let sobj = {
						title: result.items[0].snippet.title,
						url: "https://youtu.be/" + result.items[0].id.videoId,
						user: song.user,
						votes: v,
						date: new Date
					};
					q.push(sobj);
					
					resolve(sobj);
				}
			});
		} else {
			existingSong.votes++;
			resolve("Voted for song");
		}
	})
	
}

function addSong(song, q) {
	
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
	console.log('Listening on port 3081');
	hardcodeSongs();

})

// TODO: change, shouldn't be url if it is a name
app.post('/addSong', function(req, res){
	// TODO: make better
	// Test if a url
	if((validUrl.isUri(req.body.url))) {
		console.log("here");
		if((req.body.url.includes('youtu.be/') || 
			req.body.url.includes('youtube.com/'))) {
				addSongByUrl(req.body, queue , 1);
				res.status(200).send("added");
		} else {
			res.status(400).send("Not a valid url");
		}
	}
	else {
		addSongByName({title: req.body.url}, queue, 1).then(
			(result) => {
				console.log(result);
				res.status(200).send(result);
			},
			(err) => {
				console.log("here")
				console.log(err)
				
				res.status(500).send(err)
			});
	}
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
