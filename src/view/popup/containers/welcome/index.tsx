import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import { RouteComponentProps } from 'react-router-dom';

interface AppProps extends RouteComponentProps {
    develop:boolean;
}

interface AppState {
    develop:boolean;
}

export default class Welcome extends React.Component<AppProps> {
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

    public start =()=>
    {
        this.props.history.push('/login')
    }


    render() {
        return (
            <div className="popupContainer">
                <div className="title">欢迎使用</div>
                <div className="describe">
                    NEL插件钱包可以让您便捷地连接到dapp与区块链网络
                </div>
                <div className="start">                    
                    <Button text="开始" type='white' onClick={this.start}/>
                </div>
            </div>
        )
    }
}
