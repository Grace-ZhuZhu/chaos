/* eslint-disable react/prop-types */
import React, { Component } from 'react';

export class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSlide: 0,
            availableSlides: new Set([0]),
        };
    }

    onClickPrev = () => {
        const currentSlide = this.state.currentSlide === 0 ?
            this.props.children.length - 1 : this.state.currentSlide - 1;

        const availableSlides = this.state.availableSlides.add(currentSlide);

        this.setState({
            currentSlide,
            availableSlides,
        });
    }

    onClickNext = () => {
        const currentSlide = this.state.currentSlide === this.props.children.length - 1 ?
            0 : this.state.currentSlide + 1;

        const availableSlides = this.state.availableSlides.add(currentSlide);

        this.setState({
            currentSlide,
            availableSlides,
        });
    }

    render() {
        const { currentSlide, availableSlides } = this.state;

        const slides = React.Children.map(this.props.children, (child, index) => {
            if (availableSlides.has(index)) {
                const display = index === currentSlide ? 'block' : 'none';
                return (
                    <div key={child.key} className="slide" style={{ display }}>
                        {child}
                    </div>
                );
            }
            return null;
        });

        const dots = this.props.children.map((child, index) => {
            const active = index === currentSlide ? 'active' : '';
            return (
                <span key={child.key} className={`dot ${active}`} />
            );
        });

        return (
            <div className="slider">
                <div className="slides-container">
                    {slides}
                    <button className="prev" onClick={this.onClickPrev}>❮</button>
                    <button className="next" onClick={this.onClickNext}>❯</button>
                </div>
                <div className="dot-container">
                    {dots}
                </div>
            </div>
        );
    }
}
