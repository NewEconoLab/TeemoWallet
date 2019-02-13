import * as React from 'react';
import './index.less';
import { RouteComponentProps } from 'react-router-dom';
import WalletFoot from './foot';
import WalletHeader from './head';
import History from '../history';

interface AppProps extends RouteComponentProps {
    develop:boolean;
}

interface AppState {
    develop:boolean;
}

export default class MyWallet extends React.Component<AppProps> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
    }

    public state = {
        value:""
    }

    public componentDidMount() {
        // Example of how to send a message to eventPage.ts.
        if(chrome.tabs)
        {
            chrome.runtime.sendMessage({ popupMounted: true });
        }
    }

    render() {
        return (
            <div className="mywallet">
                <WalletHeader/>
                <History></History>
                <WalletFoot/>
            </div>
        )
    }
}
