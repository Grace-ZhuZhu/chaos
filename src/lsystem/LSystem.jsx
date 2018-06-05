import React, { Component } from 'react';
import _ from 'lodash';
import TreeGraph from './TreeGraph.jsx';
import Slider from '../components/Slider.jsx';
import Header from '../components/Header.jsx';
import * as treeSpecs from './TreeSpecs.jsx';

export default class LSystem extends Component {
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
        const specs = _.values(treeSpecs);
        const treeGraphs = specs.map(spec => (
            <TreeGraph
                productionSpec={spec}
                svgSize={{ treeWidth: 600, commandWidth: 300, height: 750 }}
                screenSize={{ width: this.state.screenWidth, height: this.state.screenHeight }}
                key={spec.id}
            />
        ));

        const GraphSection = (
            <Slider>
                {treeGraphs}
            </Slider>
        );

        return (
            <div className="App">
                <Header title="L System Examples" />
                { GraphSection }
            </div>
        );
    }
}
