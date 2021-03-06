import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.less'
import App from './App';
import intl from './store/intl';

if(chrome.tabs)
{
    intl.initLanguage();
    chrome.tabs.query({ active: true, currentWindow: true }, tab => {        
        //初始化鼠标随机方法
        Neo.Cryptography.RandomNumberGenerator.startCollectors();
        ReactDOM.render(
            <App/>, document.getElementById('popup')
        );
    });
}
else
{
    window.onload=()=>
    {        
        intl.initLanguage();
        //初始化鼠标随机方法
        Neo.Cryptography.RandomNumberGenerator.startCollectors();
        const popup = document.getElementById('popup');
        document.body.style.background="#b2b2b2";
        popup.style.background="#fff";
        ReactDOM.render(
            <App/>, popup
        );
    }
}
