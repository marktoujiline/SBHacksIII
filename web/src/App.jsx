import React, { Component } from 'react';
import NetworkService from './network-service/NetworkService';
import ReactPlayer from 'react-player'
import SongTable from './song-table/SongTable';
import './App.css';



class App extends Component {

  constructor(props) {
    super(props);
    this.netService = new NetworkService();
    this.pageWith = Math.min(Math.max(document.documentElement.clientWidth, window.innerWidth || 0), 800);

    // Setup initial state
    this.state = {
            playSong: false,
            currentSong: {},
            queue: []
          };
  }

  componentDidMount(){

    this.netService.getNextSong().then(
      (song) => {
        // When new song, play that song
        console.log("new song: " + song)
        this.setState({
            playSong: true,
            currentSong: song
        });
      },
      (err) => console.log(err));

      this.netService.getPlaylist().subscribe((newQ) => {
          this.setState({queue: newQ});
      });
  }

  render() {
    return (
      <div className="App">
        <div className="main-player" >
            <div className="controls">
              <i className="material-icons icon-hidden" onClick={() => this.skipSong()}>skip_previous</i>
              {
              // Change to play / pause symbol
                  this.state.playSong ? 
                  <i className="material-icons" onClick={() => this.toggleSongPlayback()}>pause_circle_outline</i> :
                  <i className="material-icons" onClick={() => this.toggleSongPlayback()}>play_circle_outline</i>
              }                    
              <i className="material-icons" onClick={() => this.skipSong()}>skip_next</i>
            </div>
            <div className="video-background">
              <div className="video-foreground">
              <ReactPlayer
                  className="react-player"
                  url={this.state.currentSong.url} 
                  width="100%" 
                  height="100%"
                  onEnded={() => this.netService.getNextSong()}
                  playing={this.state.playSong}/>
              </div>
            </div>
        
              
              <SongTable className="song-table"
                         style={{height: this.pageWith /25 * 9}} 
                         current={this.state.currentSong} 
                         voteUpCallback={(i) => this.netService.vote(this.state.queue[i])} 
                         songs={this.state.queue}></SongTable>
        </div>
        
        
      </div>
    );
  }

  toggleSongPlayback() {
    if (this.state.currentSong.url === '') {
      this.skipSong();
      return;
    }
    this.setState((prev) => {
      return {playSong: !prev.playSong}
    });
  }

  skipSong() {
    // no song selected, not able to move 
    if(this.state.currentSong.url === '') {
      return;
    }

    this.netService.getNextSong()
      .then((song) => {
          // Set the new song
          console.log(song);
          this.setState({
            currentSong: song
          });
      }, (err) => {console.error(err)});
  }

  /**
   * Reset the playback state
   */
  stopPlayback() {
    this.setState({
      currentSong: {},
      playSong: false
    });
  }
}

export default App;
