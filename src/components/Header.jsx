/* eslint-disable react/prop-types */
import React from 'react';

export function Header(props) {
    return (
        <div className="App-header">
            <a href="/">
                <i className="fa fa-home" />
            </a>
            <h5>{props.title}</h5>
        </div>
    );
}

