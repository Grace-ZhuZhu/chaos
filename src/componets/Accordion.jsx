/* eslint-disable react/prefer-stateless-function, react/prop-types */
import React, { Component } from 'react';

class Accordion extends Component {
    render() {
        const { content } = this.props;
        return (
            <div>
                <button className="accordion">Section 1</button>
                <div className="panel">
                    { content }
                </div>
            </div>
        );
    }
}

export default Accordion;
