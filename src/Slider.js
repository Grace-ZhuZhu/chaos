import React, { Component } from 'react';

class Slider extends Component {

  constructor(props){
    super(props);
    this.state = { slideIndex: 0 };
  }

  onClickPrev = () => {
    this.setState((prevState, props) => ({
      slideIndex: prevState.slideIndex === 0 ? props.children.length -1 : prevState.slideIndex -1
    }));
  }

  onClickNext = () => {
    this.setState((prevState, props) => ({
      slideIndex: prevState.slideIndex === props.children.length -1 ?  0 : prevState.slideIndex + 1
    }));
  }

  render() {
    const currentSlide = this.state.slideIndex;

    const slides = this.props.children.map((child, index) => {
      const display = index === currentSlide ? 'block' : 'none';
      return (
        <div className="slide" style={{display: display}}> 
          {child} 
        </div>
      )
    });

    return (
      <div className="slider">
        <div className="slides-container">
          {slides}
          <a className="prev" onClick={this.onClickPrev}>❮</a>
          <a className="next" onClick={this.onClickNext}>❯</a>
        </div>
      </div>
    )
  }
}

export default Slider