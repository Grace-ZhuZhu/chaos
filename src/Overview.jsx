
/* eslint-disable class-methods-use-this, react/prop-types, func-names */
import React, { Component } from 'react';
import * as d3 from 'd3';

const OVERVIEW_WIDTH = 960;
const ITEM_MIN_AREA = 400 * 400;

export class Overview extends Component {
    constructor(props) {
        super(props);

        this.voronoi = null;
        this.polygon = null;
        this.polygons = null;
        this.site = null;
        this.sites = null;
        this.centroids = null;
        this.label = null;
        this.count = this.props.visDescriptions.length;
    }

    componentDidMount = () => {
        const svg = d3.select('svg');
        const width = +svg.attr('width');
        const height = +svg.attr('height');

        this.sites = d3.range(this.count)
            .map(() => [Math.random() * width, Math.random() * height]);

        this.voronoi = d3.voronoi()
            .extent([[-1, -1], [width + 1, height + 1]]);

        this.polygons = this.voronoi.polygons(this.sites);
        this.centroids = this.polygons.map(d => d3.polygonCentroid(d));

        this.polygon = svg.append('g')
            .attr('class', 'polygons')
            .selectAll('path')
            .data(this.polygons)
            .enter()
            .append('path')
            .call(this.drawPolygon);

        this.label = svg.append('g')
            .attr('class', 'labels')
            .selectAll('text')
            .data(this.centroids)
            .enter()
            .append('text')
            .attr('x', 0)
            .attr('y', -120)
            .text((d, i) => {
                const vis = this.props.visDescriptions[i];
                return vis.title;
            })
            .attr('font-family', 'arial')
            .attr('font-size', '30px')
            .attr('fill', 'black')
            .append('tspan')
            .attr('x', 0)
            .attr('y', -100)
            .attr('font-family', 'monospace')
            .attr('font-size', '15px')
            .attr('fill', '#434343')
            .text((d, i) => {
                const vis = this.props.visDescriptions[i];
                return vis.description;
            });

        svg.selectAll('text')
            .attr('transform', function (centroid) {
                const bb = this.getBBox();
                const textCenter = {
                    x: bb.x + (bb.width / 2),
                    y: bb.y + (bb.height / 2),
                };

                const transform = {
                    x: centroid[0] - textCenter.x,
                    y: centroid[1] - textCenter.y,
                };

                return `translate(${transform.x} ${transform.y})`;
            });
    }

    getHeight = () => {
        const height = (ITEM_MIN_AREA * this.count) / OVERVIEW_WIDTH;
        return Math.round(height);
    }

    handleMouseOver() {
        d3.selectAll('path')
            .style('fill', 'black')
            .style('fill-opacity', 0.05);

        d3.select(this)
            .style('fill', '#f00')
            .style('fill-opacity', 0.9);
    }

    handleMouseOut() {

    }

    draw = () => {
        const diagram = this.voronoi(this.sites);
        this.polygon = this.polygon.data(diagram.polygons()).call(this.drawPolygon);
        this.site = this.site.data(this.sites).call(this.drawSite);
    }

    drawPolygon = (polygon) => {
        polygon
            .attr('d', d => (d ? `M${d.join('L')}Z` : null))
            .on('mouseover', this.handleMouseOver)
            .on('mouseout', this.handleMouseOut);
    }

    render() {
        return (
            <section className="overview">
                <svg width={OVERVIEW_WIDTH} height={this.getHeight()} />
            </section>
        );
    }
}
