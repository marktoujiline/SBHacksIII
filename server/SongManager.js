// Search youtube
// 		get song title from url
let youtubeParser = require('youtube-parser');
let YoutubeSearch = require('youtube-node');
let validUrl = require('valid-url');
//		get song url from name
let youtubeSearch = new YoutubeSearch();
youtubeSearch.setKey('AIzaSyCHJm6PCl0UTLx_dVTxb3CHP3i2GJf7AYY');
youtubeSearch.addParam('order', 'relevance');


class SongManager {

    constructor() {
        this.queue = [];
        this.playlist = [];
        this.library = [];
    }

    addToQueue(song) {
        let i = this.queue.map((song) => song.url).indexOf(song.title);
        if (i === -1) {
            // not in array
            this.queue.push(song);
            i = this.playlist.map((song) => song.url).indexOf(song.title);
            if (i !== -1) {
                // Remove from playlist of pressent
                this.playlist.splice(i,1);
            }
        } else {
            // in array, increment 
            this.queue[i].votes++;
        }
        
        this.notifyQueueChange();        
    }

    addToPlaylist(song) {
        let i = this.queue.map((song) => song.url).indexOf(song.title);
        let j = this.playlist.map((song) => song.url).indexOf(song.title);        
        if ( i !== -1 && j !== -1) {
            this.playlist.push(song);
        }
    }

    addToLibrary(song) {
        let j = this.library.map((song) => song.url).indexOf(song.title);
        if (j === -1) {
            this.library.push(song);
        }
    }

    /**
     *	
     */
    fillPlaylist(size) {
        while(this.playlist.length < size && this.playlist.length < this.library.length){
            this.addToPlaylist(this.library[Math.floor(Math.random() * this.library.length)]);
        }
    }

    /**
     * Returns a prommise resolving to the added song
     */
    addToQueueByName(name, user) {
        return new Promise((resolve, reject) => {
            // Search for the url
            youtubeSearch.search(name, 1, function(error, result) {
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
						user: user,
						votes: 1,
						date: new Date()
					};

                    this.addToLibrary(sobj);
					this.addToQueue(sobj);
					resolve(sobj);
				}
			});

        });
    }

    /**
     * Returns a prommise resolving to the added song
     */
    addToQueueByURL(song, user) {
        return new Promise((resolve, reject) => {
            let i = this.library.map((song) => song.url).indexOf(song)
            if(i !== -1){
                this.addToQueue(this.library[i]);
                resolve(this.library[i]);
            } else {
                youtubeParser.getMetadata(song).then(
                    (metadata) => {
                        o = {
                                title: metadata.title,
                                url: song,
                                user: user,
                                votes: 1,
                                date: new Date()
                            };
                        console.log("here");
                        // this.addToQueue(o);
                        resolve(o);
                }).catch(err => console.log(err));
            }
        })
    }

    sortQueue() {
        this.queue.sort((a,b) => {
            if (a.votes !== b.votes) {
                return b.votes-a.votes;
            } else {
                return a.date - b.date;
            }
        });
    }

    /**
     * Returns and removes top of the queue
     */
    getNext() {
        if(this.queue.length > 0) {
            return this.queue.shift();
        } else {
            return this.playlist.shift();
        }
    }

    getUpcoming(amount) {
        r = [];
        for(let i = 0; i < Math.min(amount, this.queue.length + this.playlist.length); i++) {
            if(this.queue.length > i) {
                r.push(this.queue[i]);
            } else {
                r.push(this.playlist[i - this.queue.length]);
            }
        }
        return r;
    }

    notifyQueueChange(){}
}

module.exports = function() { return new SongManager()};