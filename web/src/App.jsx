import React, { Component } from 'react';
import NetworkService from './network-service/NetworkService';
import ReactPlayer from 'react-player'
import SongTable from './song-table/SongTable';
import './App.css';



class App extends Component {

  constructor(props) {
    super(props);
    this.netService = new NetworkService();
    this.pageWith = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    // Setup initial state
    this.state = {
            playSong: false,
            playUrl: '',
            queue: []
          };
  }

  componentDidMount(){
    this.netService.getNextSong().then(
      (song) => {
        // When new song, play that song
        this.setState({
            playSong: true,
            playUrl: song.url
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

        <div className="App-header container">
          <h2>Muuse Player</h2>
        </div>

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
        </div>
        <div className="center-content">
          <ReactPlayer 
              url={this.state.playUrl} 
              width={this.pageWith / 2 } 
              height={(this.pageWith / 25) * 9}
              onEnded={() => this.netService.getNextSong()}
              playing={this.state.playSong}/>   
              
              <SongTable className="song-table" 
                         current={this.state.playUrl} 
                         voteUpCallback={(i) => this.netService.vote(this.state.queue[i])} 
                         songs={this.state.queue}></SongTable>
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
