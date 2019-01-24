import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Welcome from './welcome';

if(chrome.tabs)
{
    chrome.tabs.query({ active: true, currentWindow: true }, tab => {
        
        ReactDOM.render(<Welcome develop={false} />, document.getElementById('popup'));
        // chrome.storage.local.get("teemmo-wallet-login",res=>{
        //     if(!res)
        //     {
        //     }
        // })
    });
}
else
{
    window.onload=()=>
    {        
        ReactDOM.render(<Welcome develop={true} />, document.getElementById('popup'));
    }
}
