import React, { Component } from 'react'
import Plant from './Plant'
import * as d3 from 'd3'; 
import { loadLeaf } from './loadLeaf'

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
		   request: requestAnimationFrame(() => this.tick())
		});
	 }
  
	 componentWillUnmount() {
		cancelAnimationFrame(this.state.request);
	 }
  
	 tick() {
		this.setState((prevState) => ({
			branches: this.getBranches(),
			leafs: this.getLeafs(),
			request: requestAnimationFrame(() => this.tick())
		}));
	 }
	
	 getBranches() {
		let branches = this.state.branches;

		const currentIndex = this.state.branches.length - 1;
		const maxIndex = this.tree.branches.length - 1;

	 	if (currentIndex < maxIndex) {
			const nextBranch = _.assign(this.tree.branches[currentIndex + 1], {
				key: currentIndex + 1
			});

			branches.push(nextBranch);
		}
		return branches;
	}

	getLeafs() {
		const totalLeafBranches = this.state.branches.filter(branch => branch.isLeafBranch);		
		const freeLeafBranches = totalLeafBranches.filter(branch => !branch.occupied);

		const totalLeafsNumber = Math.floor(totalLeafBranches.length * this.tree.leafPercentage);
		const newLeafsNumber = totalLeafsNumber - this.state.leafs.length;

		let newLeafs = [];

		if (freeLeafBranches.length && newLeafsNumber) {
			newLeafs = _.sampleSize(freeLeafBranches, newLeafsNumber);
			newLeafs.forEach(d => {
				d.occupied = true;
				d.lifeStart = Date.now();
			});
		}		
		this.state.leafs.forEach(d => {
			if (Date.now() - d.lifeStart > 15000) {
				d.occupied = false;
				d.lifeStart = null;
			}
		})
		_.remove(this.state.leafs, {occupied: false});
		let allLeafs = _.union(this.state.leafs, newLeafs);

		return allLeafs;
	}

	componentDidUpdate() {
		const width = this.props.size[0];
		const height = this.props.size[1];

		const origin = {
			x: width/2,
			y: height
		}

		// Draw branches
		const node = this.node;
		let branch = d3.select(node)
			.selectAll('line')
				.data(this.state.branches, d => d.key);

		branch.enter().append('line')
			.attr('class', 'branch')
			.attr('x1', d => d.start.x + origin.x)
			.attr('y1', d => -d.start.y + origin.y )
			.attr('x2', d => d.start.x + origin.x)
			.attr('y2', d => -d.start.y + origin.y)
			.style('stroke', '#65615c')
			.style('stroke-width', 3)
			.transition().duration(500)
			.attr('x1', d => d.start.x + origin.x)
			.attr('y1', d => -d.start.y + origin.y)
			.attr('x2', d => d.end.x + origin.x)
			.attr('y2', d => -d.end.y + origin.y);

		// Draw leafs
		const leafSvg = this.leafSvg;
		
		let leafs = d3.select(node)
			.selectAll(".leaf")
			.data(this.state.leafs, d => d.key);

		leafs.enter()
			.append("svg")
			.classed("leaf", true)
			.attr('width', 35) // set the wanted size directly here!
			.attr('height', 33)
			.each(function(d) {
					this
						.append(leafSvg.cloneNode(true));
					d3
						.select(this)
						.select("svg")
						.select("g")
						.attr("transform", "scale(0.5, 0.5)")
						.transition().duration(10000)
						.attr("transform", "scale(1, 1)");
			})
			.attr("x", d =>  d.end.x - 17.5 + origin.x)
			.attr("y", d => -d.end.y - 16.5 + origin.y)
			.attr("fill", this.spec.leafColor)
			.attr("opacity", 0.7);

		leafs.exit().filter(':not(.exiting)')
		.classed('exiting', true)
		.transition().duration(10000)
		.attr('y', height)
		.style('opacity', 0.1)
		.remove();
  }

	render() {
		let scale = Math.min(this.props.screenSize[0]/this.props.size[0], this.props.screenSize[1]/this.props.size[1]);
		scale = Math.min(scale, 1);
		return <svg ref={node => this.node = node} width={this.props.size[0]} height={this.props.size[1]} transform={`scale(${scale}) translate(0,0)`}>
		</svg>
	}
}

export default TreeGraph
