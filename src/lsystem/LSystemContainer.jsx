import React, { Component } from 'react';
import _ from 'lodash';
import { TreeGraph } from './TreeGraph.jsx';
import { Slider } from '../components/Slider.jsx';
import { VisPageContainer } from '../components/VisPageContainer.jsx';
import * as treeSpecs from './TreeSpecs.jsx';

export class LSystemContainer extends Component {
    getTreeGraphs = () => {
        const specs = _.values(treeSpecs);

        return specs.map(spec => (
            <TreeGraph
                productionSpec={spec}
                svgSize={{ treeWidth: 600, commandWidth: 300, height: 750 }}
                screenSize={{ width: this.props.screenWidth, height: this.props.screenHeight }}
                key={spec.id}
            />
        ));
    }

    getGraphSection = () => (
        <Slider disablePrev >
            {this.getTreeGraphs()}
        </Slider>
    )

    render() {
        return (
            <VisPageContainer title="L System Examples" >
                { this.getGraphSection() }
            </VisPageContainer>
        );
    }
}
