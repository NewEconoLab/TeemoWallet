import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.less'
import App from './App';

if(chrome.tabs)
{
    chrome.tabs.query({ active: true, currentWindow: true }, tab => {        
        ReactDOM.render(
            <App/>, document.getElementById('popup')
        );
    });
}
else
{
    window.onload=()=>
    {   
        const popup = document.getElementById('popup');
        document.body.style.background="#b2b2b2";
        popup.style.background="#fff";
        ReactDOM.render(
            <App/>, popup
        );
    }
}
