import React, { Component } from 'react'
import Plant from './Plant'
import * as d3 from 'd3'; 

class TreeGraph extends Component {
	constructor(props) {
		super(props);
		this.state = {
			branches: [],
		};

		const productionSpec = {
				totalFlowers: 3,
				flowerPercentage: .5,
				branchLength: 6, //0.015
				leafLength: 0.07,
				n: 5,
				delta: 20.0,
				initiator: "X",
				productionRules: [
					"X->F[+X]F[-X]+X",
					"F->FF"
				]
			};
		this.tree = new Plant(productionSpec);
	}

	componentDidMount() {
		this.setState({
		   request: requestAnimationFrame(() => this.tick())
		});
	 }
  
	 componentWillUnmount() {
		cancelAnimationFrame(this.state.request);
	 }
  
	 tick() {
		if (this.tree.flowerSvg && !this.state.flowerSvg) {
			this.setState({
				flowerSvg: this.tree.flowerSvg
			});
		}
		
		const alreadyDrawn = this.state.branches.length;
		
	 	if (alreadyDrawn < this.tree.branches.length) {
			let branches = this.state.branches;
			let nextIndex = alreadyDrawn;
			branches.push({
				key: nextIndex,
				branch: this.tree.branches[nextIndex]
			});

			this.setState((prevState) => ({
				branches: branches,
				request: requestAnimationFrame(() => this.tick())
			}));
		}
	 }

	componentDidUpdate() {
		const width = this.props.size[0];
		const height = this.props.size[1];

		const origin = {
			x: width/2,
			y: height
		}

		const node = this.node;
		let branch = d3.select(node)
			.selectAll('line')
				.data(this.state.branches, d => d.key);

		branch.enter().append('line')
			.attr('class', 'branch')
			.attr('x1', d => d.branch.start.x + origin.x)
			.attr('y1', d => origin.y - d.branch.start.y)
			.attr('x2', d => d.branch.start.x + origin.x)
			.attr('y2', d => origin.y - d.branch.start.y)
			.style('stroke', '#65615c')
			.style('stroke-width', 3)
			.transition().duration(500)
			.attr('x1', d => d.branch.start.x + origin.x)
			.attr('y1', d => origin.y - d.branch.start.y)
			.attr('x2', d => d.branch.end.x + origin.x)
			.attr('y2', d => origin.y - d.branch.end.y);

		// Don't select already exiting nodes
		branch.exit().filter(':not(.exiting)')
			.classed('exiting', true)
			.transition().duration(2000)
			.style('stroke', '#3E6E9C')
			.remove();
  }

	render() {
		return <svg ref={node => this.node = node} width={this.props.size[0]} height={this.props.size[1]}>
		</svg>
	}
}

export default TreeGraph
