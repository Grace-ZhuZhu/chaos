import React, { Component } from 'react';
import { HomeHeader } from './components/HomeHeader.jsx';
import { Overview } from './Overview.jsx';
import descriptions from './visDescriptions';

const HEADER_HEIGHT = 250;

export class Main extends Component {
    constructor(props) {
        super(props);
        this.onResize = this.onResize.bind(this);
        this.state = {
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight - 120,
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize, false);
        this.onResize();
    }

    onResize() {
        this.setState({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight - HEADER_HEIGHT,
        });
    }

    render() {
        return (
            <div className="flex-container">

                <HomeHeader />

                <Overview
                    screenWidth={this.state.screenWidth}
                    screenHeight={this.state.screenHeight}
                    visDescriptions={descriptions}
                />
            </div>
        );
    }
}
