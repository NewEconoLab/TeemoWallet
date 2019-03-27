// 输入框组件
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Input from '../../../../components/Input';
import { NepAccount } from '../../../../../common/entity';
import { Storage_local } from '../../../utils/storagetools';
import { observer } from 'mobx-react';
import common from '../../../store/common';
import intl from '../../../store/intl';

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

@observer
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
                common.initAccountInfo();
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
                    <Input type="text" placeholder={intl.message.walletnew.wif.placeholder1} 
                        value={this.state.wif} 
                        onChange={this.wifChange}
                        error={this.state.wif_error}
                        message={this.state.wif_error?intl.message.walletnew.wif.error1:""}
                    />
                </div>
                <div className="wif">
                    <Input type="password" placeholder={intl.message.walletnew.wif.placeholder2} 
                        value={this.state.password} 
                        onChange={this.passwordChange}
                        error={this.state.password_error}
                        message={this.state.password_error?intl.message.walletnew.wif.error2:""}
                    />
                </div>
                <div className="wif">
                    <Input type="password" placeholder={intl.message.walletnew.wif.placeholder3} 
                        value={this.state.passwordconfirm} 
                        onChange={this.password2Change}
                        error={this.state.passwordconfirm_error}
                        message={this.state.passwordconfirm_error?intl.message.walletnew.wif.error3:""}
                    />
                </div>
            </div>
        )
	}
}