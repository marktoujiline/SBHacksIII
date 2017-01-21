import React, { Component } from 'react';
import './songTable.css';

export default class SongTable extends Component {
    render() {
        return (
            <div className="container song-table">
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
        return this.props.songs.map((song, i) => {
        return (
            <div
                className={"song-row row " + (this.props.current === song.url ? "song--active" : "")} 
                key={"__song-" + i}
                onClick={() => this.props.voteUpCallback(i)}
                >
                <div className="song-row--votes">{song.votes}</div>
                <div className="song-row--name">{song.name + " - " + song.by}</div>
                <div className="song-row--vote song-row--vote-up">
                    <i className="material-icons">keyboard_arrow_up</i>
                </div>
            </div>)
        })
    }
}