import Notify from "./Notify";
import * as React from 'react';
import * as ReactDOM from 'react-dom';

chrome.tabs.query({ active: true, currentWindow: true }, tab => {
    const name = "Teemmo Notify";
    const app = document.createElement('div');
    document.body.appendChild(app);
    ReactDOM.render
    (
        <Notify name={name} />,app
    );
});