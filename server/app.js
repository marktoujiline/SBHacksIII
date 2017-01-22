let express = require('express')
let bodyParser = require('body-parser')
let SongManager = require('./SongManager');
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

sm = SongManager();

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




app.listen(8081, function() {
	console.log('Listening on port 3081');
	hardcodeSongs();

})



let hardcodeSongs = function(){
	Promise.all(
		sm.addToQueueByURL({
			url : "https://www.youtube.com/watch?v=f8E07NEZMAs",
			user : "Admin"
		}),
		sm.addToQueueByURL({
			url : "https://www.youtube.com/watch?v=-zHVW7Zy_vg",
			user : "Admin"
		}),
		sm.addToQueueByURL({
			url : "https://www.youtube.com/watch?v=1Ga5o7JJquQ",
			user : "Admin"
		}),
		sm.addToQueueByURL({
			url : "https://www.youtube.com/watch?v=sWj2KV2jEPc",
			user : "Admin"
		}),
		sm.addToQueueByURL({
			url : "https://www.youtube.com/watch?v=Fz8h_q4qvNk",
			user : "Admin"
		}))
	.then((r) => {
		console.log(sm.queue);
	})
}
