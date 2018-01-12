import React, { Component } from 'react';

class Slider extends Component {

  constructor(props){
    super(props);
    this.state = { 
      currentSlide: 0,
      availableSlides: 1
    };
  }

  onClickPrev = () => {
    this.setState((prevState, props) => ({
      currentSlide: prevState.currentSlide === 0 ? props.children.length -1 : prevState.currentSlide -1
    }));
  }

  onClickNext = () => {
    this.setState((prevState, props) => ({
      currentSlide: prevState.currentSlide === props.children.length -1 ?  0 : prevState.currentSlide + 1,
      availableSlides: Math.min(prevState.availableSlides + 1, props.children.length)
    }));
  }

  render() {
    const { currentSlide, availableSlides } = this.state;

    const children = React.Children.toArray(this.props.children);
    const availableChildren = children.slice(0, availableSlides);    

    const slides = availableChildren.map((child, index) => {
      const display = index === currentSlide ? 'block' : 'none';
      return (
        <div key={index} className="slide" style={{display: display}}> 
          {child} 
        </div>
      )
    });

    const dots = this.props.children.map((child, index) => {
      const active = index === currentSlide ? 'active' : '';
      return (
        <span key={index} className={`dot ${active}`}></span> 
      )
    });

    return (
      <div className="slider">
        <div className="slides-container">
          {slides}
          <a className="prev" onClick={this.onClickPrev}>❮</a>
          <a className="next" onClick={this.onClickNext}>❯</a>
        </div>
        <div className="dot-container">
          {dots}
        </div>
      </div>
    )
  }
}

export default Slider