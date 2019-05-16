import * as React from 'react';
import './index.less';
import { RouteComponentProps } from 'react-router-dom';
import Label from '../../../components/Label';
import { IOption } from '../../../components/Select';
import WalletCreate from './create';
import WalletImport from './load';
import common from '../../store/common';
import { observer } from 'mobx-react';
import intl from '../../store/intl';

interface AppProps extends RouteComponentProps {
    develop:boolean;
}

interface AppState {
    develop:boolean;
}

@observer
export default class Login extends React.Component<AppProps> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
    }

    public options:IOption[]=
    [
        {id:"nep6",name:intl.message.walletnew.option_nep6},
        {id:"nep2",name:intl.message.walletnew.option_nep2},
        {id:"wif",name:intl.message.walletnew.option_wif},
    ]

    public state = 
    {
        currentOption:this.options[0],
        currentLable:"import",
    }

    public componentDidMount() 
    {
        // Example of how to send a message to eventPage.ts.
    }
    
    goBack = ()=>
    {
        this.props.history.push('/login')
    }

    getCreateLable = () => {
        common.selectLabel('create');
        // this.setState({currentLable:"create"});
    }
    getImoprtLable = () => {
        common.selectLabel('import');
        // this.setState({currentLable:"import"});
    }

    goMyWallet=()=>{
        common.initAccountInfo();
        this.props.history.push("mywallet")
    }

    render() {
        return (
            <div className="loginContainer">
                <div className="titleBackground">
                    <div className="title">{intl.message.walletnew.newWallet}</div>
                    <img className="teemo-bg" src={require("../../../image/owl.png")} alt=""/>
                    
                </div>
                <div className="content">
                    <div className="form-label">
                        <Label text={intl.message.walletnew.createWallet} active={common.walletnew_label==="create"} onClick={this.getCreateLable} />
                        <Label text={intl.message.walletnew.importWallet} active={common.walletnew_label==="import"} onClick={this.getImoprtLable} />
                    </div>
                    {common.walletnew_label==="create"?
                    <WalletCreate goBack={this.goBack} goMyWallet={this.goMyWallet} />:
                    <WalletImport goMyWallet={this.goMyWallet} goBack={this.goBack} />}
                </div>
            </div>
        )
    }
}
