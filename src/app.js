import * as d3 from 'd3';
import React, { Component } from 'react';
import TreeGraph from './TreeGraph';
import { TreeSpec1, TreeSpec2, TreeSpec3, TreeSpec4 } from './TreeSpecs';

class App extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    this.state = { 
      screenWidth: 500,
      screenHeight: 800
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
    return (
      <div className="App">
        <div className="App-header">
          <h5>L System</h5>
        </div>
        <div className="canvas">
          <div className="treeContainer">
          <TreeGraph productionSpec={TreeSpec1} size={[500, 800]} screenSize={[this.state.screenWidth, this.state.screenHeight]} />
          </div>
          <div className="treeContainer">
          <TreeGraph productionSpec={TreeSpec2} size={[500, 800]} screenSize={[this.state.screenWidth, this.state.screenHeight]} />
          </div>
          <div className="treeContainer">
          <TreeGraph productionSpec={TreeSpec3} size={[500, 800]} screenSize={[this.state.screenWidth, this.state.screenHeight]} />
          </div>
          <div className="treeContainer">
          <TreeGraph productionSpec={TreeSpec4} size={[500, 800]} screenSize={[this.state.screenWidth, this.state.screenHeight]} />
          </div>
        </div>
      </div>
    )
  }
}

export default App