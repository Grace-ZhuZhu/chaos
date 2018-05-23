import React from 'react';

export default function Header(props) {
    return (
        <div className="App-header">
            <a>
                <i className="fa fa-home" />
            </a>
            <h5>{props.title}</h5>
        </div>
    );
}

