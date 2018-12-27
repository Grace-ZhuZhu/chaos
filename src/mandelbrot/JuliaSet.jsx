/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import * as math from 'mathjs';
import { docProduct } from '../service/MathService.jsx';

const MAX_ITERATION = 1000;
const THRESHOLD_SQUARED = 16;
const OUTER_COLOR = {
    r: 255,
    g: 0,
    b: 0,
    a: 255,
};

const TEST_COLOR = {
    r: 0,
    g: 255,
    b: 0,
    a: 255,
};

export class JuliaSet extends Component {
    constructor(props) {
        super(props);

        this.width = this.props.screenWidth / 2;
        this.height = this.props.screenHeight;

        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
    }

    componentDidMount() {
        const { canvas } = this.refs;
        const ctx = canvas.getContext('2d');
        ctx.fillRect(0, 0, this.width, this.height);

        const imgData = ctx.createImageData(this.width, this.height);

        for (let i = 0; i < this.width; i += 1) {
            for (let j = 0; j < this.height; j += 1) {
                const pixel = {
                    x: i,
                    y: j,
                };
                const point = this.pixelToPoint(pixel);
                const rgba = this.getColor(point);
                this.setPixel(imgData, pixel, rgba);
            }
        }

        ctx.putImageData(imgData, 0, 0);
    }

    setPixel(imgData, pixel, rgba) {
        const index = (pixel.x + (pixel.y * imgData.width)) * 4;
        imgData.data[index + 0] = rgba.r;
        imgData.data[index + 1] = rgba.g;
        imgData.data[index + 2] = rgba.b;
        imgData.data[index + 3] = rgba.a;
    }

    getColor = (point) => {
        let z = math.complex(point.x, point.y);
        const { c } = this.props;

        let n = 0;
        for (n = 0; n < MAX_ITERATION; n += 1) {
            if (z.abs() > Math.max(c.abs(), 2)) {
                break;
            }

            const ZSquared = math.multiply(z, z);

            z = math.add(ZSquared, c);
        }

        if (n === MAX_ITERATION) {
            return OUTER_COLOR;
        }

        return TEST_COLOR;
    }

    pixelToPoint = (pixel) => {
        const minRadius = Math.min(this.width / 2, this.height / 2);
        return {
            x: (pixel.x - this.centerX) / minRadius,
            y: (pixel.y - this.centerY) / minRadius,
        };
    }

    render() {
        return (
            <canvas
                id="juliaSet"
                ref="canvas"
                width={this.width}
                height={this.height}
                style={{ border: '1px solid #000000' }}
            />
        );
    }
}
