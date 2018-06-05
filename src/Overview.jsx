
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import * as d3 from 'd3';

const OVERVIEW_WIDTH = 960;
const ITEM_MIN_AREA = 500 * 500;

export class Overview extends Component {
    constructor(props) {
        super(props);

        this.sites = null;
        this.voronoi = null;
        this.polygon = null;
        this.link = null;
        this.site = null;
    }

    componentDidMount = () => {
        const svg = d3.select('svg').on('touchmove mousemove', this.moved);
        const width = +svg.attr('width');
        const height = +svg.attr('height');

        this.sites = d3.range(this.props.count)
            .map(() => [Math.random() * width, Math.random() * height]);

        this.voronoi = d3.voronoi()
            .extent([[-1, -1], [width + 1, height + 1]]);

        this.polygon = svg.append('g')
            .attr('class', 'polygons')
            .selectAll('path')
            .data(this.voronoi.polygons(this.sites))
            .enter()
            .append('path')
            .call(this.redrawPolygon);

        this.link = svg.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(this.voronoi.links(this.sites))
            .enter()
            .append('line')
            .call(this.redrawLink);

        this.site = svg.append('g')
            .attr('class', 'this.sites')
            .selectAll('circle')
            .data(this.sites)
            .enter()
            .append('circle')
            .attr('r', 2.5)
            .call(this.redrawSite);
    }


    moved = () => {
        this.sites[0] = d3.mouse(this);
        this.redraw();
    }

    redraw = () => {
        const diagram = this.voronoi(this.sites);
        this.polygon = this.polygon.data(diagram.polygons()).call(this.redrawPolygon);
        this.link = this.link.data(diagram.links());
        this.link.exit().remove();
        this.link = this.link.enter().append('line').merge(this.link).call(this.redrawLink);
        this.site = this.site.data(this.sites).call(this.redrawSite);
    }

    redrawPolygon(polygon) {
        polygon
            .attr('d', d => (d ? `M${d.join('L')}Z` : null));
    }

    redrawLink(link) {
        link
            .attr('x1', d => d.source[0])
            .attr('y1', d => d.source[1])
            .attr('x2', d => d.target[0])
            .attr('y2', d => d.target[1]);
    }

    redrawSite(site) {
        site
            .attr('cx', d => d[0])
            .attr('cy', d => d[1]);
    }

    getHeight = () => {
        const height = (ITEM_MIN_AREA * this.props.count) / OVERVIEW_WIDTH;

        return Math.round(height);
    }

    render() {
        return (
            <section className="overview">
                <svg width={OVERVIEW_WIDTH} height={this.getHeight()} />
            </section>
        );
    }
}
