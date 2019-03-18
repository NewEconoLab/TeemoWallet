import * as React from 'react';
import './index.less';
import { RouteComponentProps } from 'react-router-dom';
import WalletFoot from './foot';
import WalletHeader from './head';
import History from '../history';
import Assets from '../assets';
import { neotools } from '../../utils/neotools';
import common from '../../store/common';
import { observer } from 'mobx-react';

interface AppProps extends RouteComponentProps {
    develop:boolean;
}

interface AppState {
    value:string;
    label:string;
}


@observer
export default class MyWallet extends React.Component<AppProps,AppState> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
    }

    public state = {
        value:"",
        label:"history"
    }

    public componentDidMount() {
        // Example of how to send a message to eventPage.ts.        
        common.initAccountBalance();
        if(chrome.tabs)
        {
            chrome.runtime.sendMessage({ popupMounted: true });
        }
    }
    public labelChange=(label)=>{
        if(label=="out"){
            this.props.history.push('/login')
        }
        this.setState({
            label:label
        });
    }

    render() {
        return (
            <div className="mywallet">
                <WalletHeader lableChange={this.labelChange}/>
                <div className="body">         
                {
                    this.state.label=="history"?       
                    <History/>:
                    <Assets />
                }
                </div>
                <WalletFoot/>
            </div>
        )
    }
}
