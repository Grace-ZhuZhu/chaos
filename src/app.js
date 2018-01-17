import * as d3 from 'd3';
import React, { Component } from 'react';
import TreeGraph from './TreeGraph';
import Slider from './Slider';
// import { TreeSpec1, TreeSpec2, TreeSpec3, TreeSpec4 } from './TreeSpecs';
import * as treeSpecs from './TreeSpecs';

class App extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    this.state = { 
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight - 120
    }
  }

  onResize() {
    this.setState({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight - 120
    })
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  render() {
    const specs = _.values(treeSpecs);
    const treeGraphs = specs.map(spec => (
      <TreeGraph productionSpec={spec} svgSize={{treeWidth: 600, commandWidth: 300, height: 750}} screenSize={{width: this.state.screenWidth, height: this.state.screenHeight}} />
    ))
    return (
      <div className="App">
        <div className="App-header">
          <h5>L System</h5>
        </div>
        <Slider>
          {treeGraphs}
        </Slider>
      </div>
    )
  }
}

export default App