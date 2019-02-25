// 输入框组件
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Input from '../../../../components/Input';
import { NepAccount } from '../../../../../common/entity';
import { Storage_local } from '../../../utils/storagetools';
import common from '../../../store/common';

interface IState{
    wif:string,
    password:string,
    passwordconfirm:string,
    wif_error:boolean,
    password_error:boolean,
    passwordconfirm_error:boolean,
}

interface IPorps{
    goMyWallet:()=>void;
}

// @observer
export default class WifImport extends React.Component<IPorps, IState> {
	constructor(props: any) {
		super(props);
    }
    
    public wallet: ThinNeo.nep6wallet = new ThinNeo.nep6wallet();

    public state:IState={
        wif:'',
        password:'',
        passwordconfirm:'',
        wif_error:false,
        password_error:false,
        passwordconfirm_error:false,
    }
    

    public wifChange=(event)=>{
        this.setState({
            wif:event
        })
    }
    
    public passwordChange=(event)=>{
        this.setState({
            password_error:!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(event))
        })
        this.setState({
            password:event
        })
    }

    public password2Change=(event)=>{
        this.setState({
            passwordconfirm:event
        })
        this.setState({
            passwordconfirm_error:this.state.password!=event
        })
    }

    goMyWallet =()=> {
        if(this.props.goMyWallet)
            this.props.goMyWallet();
    }

    loadWallet=()=>{
        try {
            let prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(this.state.wif)
            NepAccount.encryption(this.state.password,prikey)
            .then(account=>{
                common.account = account;
                Storage_local.setAccount(account);
                this.goMyWallet();                
            })
            .catch(error=>{
                console.log(error);
                this.setState({
                    wif_error:true
                })
            })
        } catch (error) {
            console.log(error);
            this.setState({
                wif_error:true
            })
        }
    }

	public render() {
        return(                
            <div className="form-content">                            
                <div className="wif">
                    <Input type="text" placeholder="输入私钥" 
                        value={this.state.wif} 
                        onChange={this.wifChange}
                        error={this.state.wif_error}
                        message={this.state.wif_error?"WIF错误":""}
                    />
                </div>
                <div className="wif">
                    <Input type="password" placeholder="设置密码" 
                        value={this.state.password} 
                        onChange={this.passwordChange}
                        error={this.state.password_error}
                        message={this.state.password_error?"请输入不小于8位，且包含大小写的密码":""}
                    />
                </div>
                <div className="wif">
                    <Input type="password" placeholder="确认密码" 
                        value={this.state.passwordconfirm} 
                        onChange={this.password2Change}
                        error={this.state.passwordconfirm_error}
                        message={this.state.passwordconfirm_error?"请输入相同的密码":""}
                    />
                </div>
            </div>
        )
	}
}