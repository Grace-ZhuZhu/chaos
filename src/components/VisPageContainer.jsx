import React, { Component } from 'react';
import { Header } from '../components/Header.jsx';

export class VisPageContainer extends Component {
    constructor(props) {
        super(props);
        this.onResize = this.onResize.bind(this);
        this.state = {
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize, false);
        this.onResize();
    }

    onResize() {
        this.setState({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
        });
    }

    getChildrenWithProps = () => {
        const { children } = this.props;

        return React.Children.map(children, child =>
            React.cloneElement(child, {
                screenWidth: this.state.screenWidth,
                screenHeight: this.state.screenHeight,
            }));
    }

    render() {
        return (
            <div className="App">
                <Header
                    title={this.props.title}
                />

                {this.getChildrenWithProps()}
            </div>
        );
    }
}

