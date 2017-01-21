import React, { Component } from 'react';
import NetworkService from './network-service/NetworkService';
import ReactPlayer from 'react-player'
import ControlBar from './playback-control-bar/ControlBar';
import './App.css';



class App extends Component {

  constructor(props) {
    super(props);
    this.netService = new NetworkService;

    // Setup initial state
    this.state = {
            playSong: false,
            playUrl: ''
          };
    
    this.netService.getNextSong().then(
      (song) => {
        // When new song, play that song
        console.log(song);
        this.setState({
            playSong: true,
            playUrl: song.url
        });
      },
      (err) => console.log(err));
  }

  render() {
    return (
      <div className="App">

        <div className="App-header container">
          <h2>Muuse Player</h2>
        </div>

    <div className="main-player" >

          <ReactPlayer 
            url={this.state.playUrl} 
            width="500px" 
            height="400px" 
            onEnded={() => this.netService.getNextSong()}
            playing={this.state.playSong}/> 

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
            
        </div>
      </div>
    );
  }

  toggleSongPlayback() {
    if (this.state.playUrl === '') return;
    this.setState((prev) => {
      return {playSong: !prev.playSong}
    });
  }

  skipSong() {
    // no song selected, not able to move 
    if(this.state.playUrl === '') {
      return;
    }

    this.netService.getNextSong()
      .then((song) => {
          // Set the new song
          this.setState({
            playUrl: song.url
          });
      }, (err) => {console.error(err)});
  }

  /**
   * Reset the playback state
   */
  stopPlayback() {
    this.setState({
      playUrl: '',
      playSong: false
    });
  }
}

export default App;
