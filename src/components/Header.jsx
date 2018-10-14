/* eslint-disable react/prop-types */
import React from 'react';

export function Header(props) {
    return (
        <div className="App-header">
            <a href="/">
                <i className="fa fa-home" />
            </a>
            <h3>{props.title}</h3>
        </div>
    );
}

