import React, { Component } from 'react';
import './songTable.css';

export default class SongTable extends Component {
    render() {
        return (
            <div className="container song-table">

                <div className="row song-table-header">
                    <span>Now playing</span>
                </div>
                    
                <div>
                {
                    this.props.current.url ? 
                        <div className={"song-row row song--active"}>             
                            <div className="song-row--placeholder">{this.props.current.title}</div>
                        </div>
                        :
                        <div className={"song-row row"}>             
                            <div className="song-row--placeholder">No song playing</div>
                        </div>
                }
                    
                </div>
                <div className="row song-table-header">
                    <span>Votes</span>
                    <span> | </span>
                    <span>Song</span>
                </div>
                <div>          
                    {this.tableRow()}
                </div>
            </div>
        )
    }

    tableRow() {
        console.log(this.props.songs);
        if(this.props.songs.length > 0) {
            return this.props.songs.map((s,i) => this.constructRow(s,i));
        } else {
            return (
                <div className={"song-row row"}>             
                    <div className="song-row--placeholder">Queue empty</div>
                </div>
            )
        }
    }

    constructRow(song, i) {
        if(!song) {return}
        return (
            <div
                className={"song-row row"} 
                key={"__song-" + i}
                onClick={() => this.props.voteUpCallback(i)}
                >
                <div className="song-row--votes">{song.votes}</div>
                <div className="song-row--name">{song.title}</div>
                
            </div>
            );
    }
}