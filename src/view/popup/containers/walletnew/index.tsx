import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import { RouteComponentProps } from 'react-router-dom';
import Label from '../../../components/Label';
import Select, { IOption } from '../../../components/Select';
import Input from '../../../components/Input';
import WalletCreate from './create';
import WalletImport from './load';
import common from '../../store/common';
import { observer } from 'mobx-react';

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
        {id:"nep6",name:"Nep6加密文件"},
        {id:"nep2",name:"Nep2加密字段"},
        {id:"wif",name:"WIF私钥字符串"},
    ]

    public state = 
    {
        currentOption:this.options[0],
        currentLable:"import",
        password:"",
        filename:"",
        confirm:"",
        nep2:"",
        wif:"",
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
        this.setState({currentLable:"create"});
    }
    getImoprtLable = () => {
        this.setState({currentLable:"import"});
    }

    goMyWallet=()=>{
        common.initAccountInfo();
        this.props.history.push("mywallet")
    }

    render() {
        return (
            <div className="loginContainer">
                <div className="titleBackground">
                    <div className="title">新钱包</div>
                    <img className="teemo-bg" src={require("../../../image/owl.png")} alt=""/>
                </div>
                <div className="content">
                    <div className="form-label">
                        <Label text="创建钱包" active={this.state.currentLable==="create"} onClick={this.getCreateLable} />
                        <Label text="导入钱包" active={this.state.currentLable==="import"} onClick={this.getImoprtLable} />
                    </div>
                    {this.state.currentLable==="create"?
                    <WalletCreate goBack={this.goBack} goMyWallet={this.goMyWallet} />:
                    <WalletImport goMyWallet={this.goMyWallet} goBack={this.goBack} />}
                </div>
            </div>
        )
    }
}
