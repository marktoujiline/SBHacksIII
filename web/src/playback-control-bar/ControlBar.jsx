import React, { Component } from 'react';
import './ControlBar.css';

export default class ControlBar extends Component {
    render() {
        return (
            <div className="control-bar">
                <div className="control-bar__content">
                    <div className="control-bar__controls">
                        <i className="material-icons" onClick={this.props.clickPrev} >skip_previous</i>
                        {
                            // Change to play / pause symbol
                            this.props.playing ? 
                            <i className="material-icons" onClick={this.props.clickPlay}>pause_circle_outline</i> :
                            <i className="material-icons" onClick={this.props.clickPlay}>play_circle_outline</i>
                        }                    
                        <i className="material-icons" onClick={this.props.clickNext}>skip_next</i>
                    </div>
                </div>
            </div>
        )
    }
}