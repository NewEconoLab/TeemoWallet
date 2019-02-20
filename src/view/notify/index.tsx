import Notify from "./Notify";
import * as React from 'react';
import * as ReactDOM from 'react-dom';

if(chrome.tabs){
    chrome.tabs.query({ active: true, currentWindow: true }, tab => {
        const name = "Teemmo Notify";
        const app = document.createElement('div');
        document.body.appendChild(app);
        ReactDOM.render
        (
            <Notify name={name} />,app
        );
    });
}
else{
    window.onload=()=>
    {   
        //初始化鼠标随机方法
        Neo.Cryptography.RandomNumberGenerator.startCollectors();
        const app = document.createElement('div');
        document.body.appendChild(app);
        document.body.style.background="#F9F9F9";
        app.style.background="#fff";
        ReactDOM.render(
            <Notify name={name}/>,app
        );
    }
}
