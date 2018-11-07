import React, { Component } from 'react';
import _ from 'lodash';
import { Slider } from '../components/Slider.jsx';
import { Header } from '../components/Header.jsx';

export class JuliaSet extends Component {
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
            <div className="App">
                <Header
                    title="Julia Set Examples"
                />
            </div>
        );
    }
}
