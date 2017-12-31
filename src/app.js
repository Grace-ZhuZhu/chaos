import * as d3 from 'd3'
import React from 'react';
import {render} from 'react-dom';
import AwesomeComponent from './AwesomeComponent.js';

class App extends React.Component {
  render () {
    return (
      <div>
        <p> Hello React Project</p>
        <AwesomeComponent />
      </div>
    );
  }
}

render(<App/>, document.getElementById('root'));

// Selecting and appending elements
d3.select('#root')
  .append('h5')
  .append('text')
  .text(`D3 version: ${d3.version}`)

// Loading external data
d3.csv('/data/sample.csv', (error, dataset) => {
  dataset.forEach((data) => {
    console.log(data)
  })
})

d3.xml("/data/cherry-flower.svg",
(xml) => {
  const flowerSvg = xml.getElementsByTagName("svg")[0];
});