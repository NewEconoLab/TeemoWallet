import Notify from "./Notify";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import intl from "../popup/store/intl";

if(chrome.tabs){
    intl.initLanguage();
    chrome.tabs.query({ active: true, currentWindow: true }, tab => {
        const name = "Teemo Notify";
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
        intl.initLanguage();
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
