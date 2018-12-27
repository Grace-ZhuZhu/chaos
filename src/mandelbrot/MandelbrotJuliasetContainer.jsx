import React, { Component } from 'react';
import { VisPageContainer } from '../components/VisPageContainer.jsx';
import * as math from 'mathjs';
import { JuliaSet } from './JuliaSet.jsx';

export class MandelbrotJuliasetContainer extends Component {
    render() {
        return (
            <VisPageContainer title="JuliaSet & Mandelbrot">
                <JuliaSet c={math.complex(0.25, 0.52)} />
            </VisPageContainer>
        );
    }
}

