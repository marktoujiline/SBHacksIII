import { Observable, Observer } from 'rxjs/Rx';
import 'whatwg-fetch';

export default class NetworkService {

    constructor(){
        this.SERVER_ADDR = "localhost:8081";
        this.SERVER_URL = "http://" + this.SERVER_ADDR;
        this.songs = [];

        this.playlistObservable = Observable.create((o) => {
            this.PlaylistObserver = o;
            let socket = new WebSocket("ws://" + this.SERVER_ADDR);

            // Listen for messages
            socket.onopen = () => console.log("Socket connected");

            socket.onmessage = (ev) => {
                let newQueue = JSON.parse(ev.data);
                console.log(newQueue);
                this.songs = newQueue;
                o.next(this.songs);                
            };
        });
    }

    getNextSong(){
        return fetch(this.SERVER_URL + '/getNext')
            .then((response) => {

                // Update the playlist
                fetch(this.SERVER_URL + "/getUpcoming")
                    .then(res =>{
                        return res.json();
                    })
                    .then(songs => {
                        this.songs = songs || [];
                        this.PlaylistObserver.next(this.songs);
                    })
                return response.json()
            })
            .then(nSong => nSong || {})
    }

    getPlaylist() {
        return this.playlistObservable;
    }

    // TODO: vote on server
    vote(song) {
        let i = this.songs.map(s => s.url).indexOf(song.url);
        this.songs.splice(i, 1)[0];
        song.votes++;
        this.songs.push(song);
        this.songs = this.songs.slice().sort((a, b) => b.votes-a.votes);
        
        this.PlaylistObserver.next(this.songs);
    }



}
