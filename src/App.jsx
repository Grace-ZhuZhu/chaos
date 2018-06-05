import React, { Component } from 'react';

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
            screenHeight: window.innerHeight - 120,
        });
    }

    render() {
        return (
            <article id="wrap">

                <div className="header">
                    <h1 className="header_logo">CHAOS</h1>
                    <h5 className="header_subline"> Orders in Disorder </h5>
                </div>

                <article id="lightings">
                    <section id="one">
                        <section id="two">
                            <section id="three">
                                <section id="four">
                                    <section id="five" />
                                </section>
                            </section>
                        </section>
                    </section>
                </article>

            </article>
        );
    }
}
