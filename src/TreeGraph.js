import React, { Component } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import Plant from './Plant';
import { loadLeaf } from './loadLeaf';

class TreeGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            branches: [],
            leafs: [],
        };

        this.spec = props.productionSpec;
        this.tree = new Plant(this.spec);
    }

    componentWillMount() {
        loadLeaf(this.spec.leafPath)
        .then((leafSvg) => {
            this.leafSvg = leafSvg;
        });
    }

    componentDidMount() {
        this.setState({
		   request: requestAnimationFrame(() => this.tick()),
        });
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.state.request);
    }

    getBranches() {
        const { branches } = this.state;

        const currentIndex = branches.length - 1;
        const maxIndex = this.tree.branches.length - 1;

        if (currentIndex < maxIndex) {
            const nextBranch = _.assign(this.tree.branches[currentIndex + 1], {
                key: currentIndex + 1,
            });

            branches.push(nextBranch);
        }
        return branches;
    }

    getLeafs() {
        const { branches, leafs } = this.state;

        const totalLeafBranches = branches.filter(branch => branch.isLeafBranch);
        const freeLeafBranches = totalLeafBranches.filter(branch => !branch.occupied);

        const totalLeafsNumber = Math.floor(totalLeafBranches.length * this.tree.leafPercentage);
        const newLeafsNumber = totalLeafsNumber - leafs.length;

        let newLeafs = [];

        if (freeLeafBranches.length && newLeafsNumber) {
            newLeafs = _.sampleSize(freeLeafBranches, 1/* newLeafsNumber */);
            newLeafs.forEach((d) => {
                d.occupied = true;
                d.lifeStart = Date.now();
            });
        }
        leafs.forEach((d) => {
            if (Date.now() - d.lifeStart > this.spec.leafLife) {
                d.occupied = false;
                d.lifeStart = null;
            }
        });
        _.remove(leafs, { occupied: false });
        const allLeafs = _.union(leafs, newLeafs);

        return allLeafs;
    }

    tick() {
        this.setState(() => ({
            branches: this.getBranches(),
            leafs: this.getLeafs(),
            request: requestAnimationFrame(() => this.tick()),
        }));
    }

    componentDidUpdate() {
        const width = this.props.svgSize.treeWidth;
        const height = this.props.svgSize.height;

        const origin = {
            x: width / 2,
            y: height,
        };

        const { branches, leafs } = this.state;

        // Draw branches
        const node = this.node;
        const branch = d3.select(node)
        .selectAll('line')
        .data(branches, d => d.key);

        branch.enter().append('line')
        .attr('class', 'branch')
        .attr('x1', d => d.start.x + origin.x)
        .attr('y1', d => -d.start.y + origin.y)
        .attr('x2', d => d.start.x + origin.x)
        .attr('y2', d => -d.start.y + origin.y)
        .style('stroke', '#65615c')
        .style('stroke-width', 3)
        .transition()
        .duration(500)
        .attr('x1', d => d.start.x + origin.x)
        .attr('y1', d => -d.start.y + origin.y)
        .attr('x2', d => d.end.x + origin.x)
        .attr('y2', d => -d.end.y + origin.y);

        // Draw leafs
        const leaf = d3.select(node)
        .selectAll('.leaf')
        .data(leafs, d => d.key);

        const leafSvg = this.leafSvg;
        const leafLife = this.spec.leafLife;

        leaf.enter()
        .append('svg')
        .classed('leaf', true)
        .attr('width', 35) // set the wanted size directly here!
        .attr('height', 33)
        .each(function () {
            this
            .append(leafSvg.cloneNode(true));
            d3
            .select(this)
            .select('svg')
            .select('g')
            .attr('transform', 'scale(0.5, 0.5)')
            .transition()
            .duration(leafLife)
            .ease(d3.easeExpOut)
            .attr('transform', 'scale(1, 1)');
        })
        .attr('x', d => d.end.x - 17.5 + origin.x)
        .attr('y', d => -d.end.y - 16.5 + origin.y)
        .attr('fill', this.spec.leafColor)
        .attr('opacity', 0.7);

        if (this.spec.leafFalling) {
            leaf.exit().filter(':not(.exiting)')
            .classed('exiting', true)
            .transition()
            .duration(10000)
            .attr('y', height)
            .style('opacity', 0.1)
            .remove();
        } else {
            leaf.exit().filter(':not(.exiting)')
            .classed('exiting', true)
            .transition()
            .duration(5000)
            .style('opacity', 0.1)
            .remove();
        }
    }

    render() {
        const {
            svgSize,
            screenSize,
            productionSpec,
        } = this.props;

        const svgWidth = svgSize.treeWidth + svgSize.commandWidth;
        const svgHeight = svgSize.height;
        let scale = Math.min(screenSize.width / svgWidth, screenSize.height / svgSize.height);
        scale = Math.min(scale, 1);

        const translateX = svgWidth * (scale - 1);
        const translateY = svgHeight * (scale - 1);

        const command = productionSpec;
        const commandToString = [
            'Command:',
            `initiator: ${command.initiator}`,
            'production rules:',
            `${command.productionRules.join(',   ')}`,
            `number of recursions: ${command.n}`,
            `branching angle: ${command.delta}`,

        ];
        const commandText = commandToString.map(text => (<tspan x="0" dy="2em">{text}</tspan>));

        return (
            <svg className="canvas" width={svgWidth} height={svgHeight} transform={`scale(${scale}) translate(${translateX},${translateY})`}>
                <g ref={node => this.node = node} width={svgSize.treeWidth} height={svgHeight} />
                <g transform={`translate(${svgSize.treeWidth},0)`}>
                    <text x="0" y="15" fontFamily="sans-serif" fontSize="20px" fill="white">
                        {commandText}
                    </text>
                </g>
            </svg>
        );
    }
}

export default TreeGraph;
