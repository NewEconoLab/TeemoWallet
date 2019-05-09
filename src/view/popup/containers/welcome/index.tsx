import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import { RouteComponentProps } from 'react-router-dom';
import intl from '../../store/intl';

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
        this.props.history.push('/walletnew')
    }

    public goEn =()=>{
        localStorage.setItem('language', 'en');
        intl.initLanguage();
        this.props.history.push('/walletnew')
    }

    public goZh =()=>{
        localStorage.setItem('language', 'zh');
        intl.initLanguage();
        this.props.history.push('/walletnew')
    }

    render() {
        return (
            <div className="popupContainer">
                <div className="title">{intl.message.welcome.welcomeToUse}</div>
                <div className="popup-logo">
                    <img className="owl-img" src={require("../../../image/owl.png")} alt=""/>
                    <img className="teemo-img" src={require("../../../image/teemo.png")} alt=""/>
                </div>
                <div className="describe">
                    {intl.message.welcome.describe}
                </div>
                <div className="start">
                    <Button text="开始" type='white' size='small-big' onClick={this.goZh} style={{'margin-right': '15px'}}/>
                    <Button text="Start" type='white' size='small-big' onClick={this.goEn}/>
                </div>
            </div>
        )
    }
}
