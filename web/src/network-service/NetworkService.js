import { Observable, Observer } from 'rxjs/Rx'

export default class NetworkService {

    constructor(){
        this.songs = [{
        name: "Bad Blood - taylor swift",
        by: "Jontz",
        votes: 1,
        url: 'https://youtu.be/QcIy9NiNbmo',
      },{
        name: "Shake it off - taylor swift",
        by: "Jontz",
        votes: 1,
        url: 'https://youtu.be/e-ORhEE9VVg',                
      },
      {
        name: "That other song - taylor swift",
        by: "Jontz",
        votes: 1,
        url: 'https://youtu.be/nfWlot6h_JM',                
      }].sort((p,n) => n.votes - p.votes);
    }

    getNextSong(){
        return new Promise((resolve, reject) => {
            if(this.songs.length > 0) {
                resolve(this.songs.splice(0,1)[0]);
            } else {
                reject("No more songs");
            }
        })
        
    }



}