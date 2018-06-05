import React, { Component } from 'react';
import { Overview } from './Overview.jsx';

const HEADER_HEIGHT = 250;

export default class App extends Component {
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

                <header className="header-section">
                    <div className="header-title">
                        <h1 className="header-logo">CHAOS</h1>
                        <h5 className="header-subline"> Orders in Disorder </h5>
                    </div>

                    <div id="lightings">
                        <section id="one">
                            <section id="two">
                                <section id="three">
                                    <section id="four">
                                        <section id="five" />
                                    </section>
                                </section>
                            </section>
                        </section>
                    </div>
                </header>

                <Overview
                    screenWidth={this.state.screenWidth}
                    screenHeight={this.state.screenHeight}
                    count={4}
                />
            </div>
        );
    }
}
