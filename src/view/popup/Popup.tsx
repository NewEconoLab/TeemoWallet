import * as React from 'react';
import './Popup.less';

interface AppProps {}

interface AppState {}

export default class Popup extends React.Component<AppProps, AppState> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
    }

    componentDidMount() {
        // Example of how to send a message to eventPage.ts.
        chrome.runtime.sendMessage({ popupMounted: true });
    }

    openNotify()
    {
        chrome.storage.local.set({name:"Teemmo"});
        const notify = window.open ('notify.html', 'notify', 'height=600, width=350, top=150, left=100, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no')
        notify.onload =()=>
        {
            chrome.storage.local.get('name',res=>{
                console.log(res);
            })
        }
    }

    render() {
        return (
            <div className="popupContainer">
                <button onClick={this.openNotify}>测试notify</button>
            </div>
        )
    }
}
