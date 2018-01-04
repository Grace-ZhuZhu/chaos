import * as d3 from 'd3';
import React, { Component } from 'react';
import TreeGraph from './TreeGraph';

class App extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    this.state = { screenWidth: 1000, screenHeight: 500, hover: "none", brushExtent: [0,40] }
  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight - 120 })
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>react d3 dashboard</h2>
        </div>
        <div>
        <TreeGraph size={[this.state.screenWidth, this.state.screenHeight]} />
        </div>
      </div>
    )
  }
}

export default App