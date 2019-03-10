// 输入框组件
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Input from '../../../../components/Input';
import { neotools } from '../../../utils/neotools';
import { bg, Storage_local } from '../../../utils/storagetools';

interface IState{
    nep2:string;
    password:string,
    filename:string,    
    nep2_error:boolean,
    password_error:boolean
}

interface IPorps{
    goMyWallet:()=>void;
}

// @observer
export default class Nep2Import extends React.Component<IPorps, IState> {
	constructor(props: any) {
		super(props);
    }
    public reader = new FileReader();
    public componentDidMount() 
    {
        // Example of how to send a message to eventPage.ts.
        this.reader.onload=()=>{            
            this.wallet.fromJsonStr(this.reader.result as string);

        }
    }
    
    public wallet: ThinNeo.nep6wallet = new ThinNeo.nep6wallet();

    public state:IState={
        nep2:"",
        password:"",
        filename:"",    
        nep2_error:false,
        password_error:false
    }
    
    public passwordChange=(event)=>{
        this.setState({
            password:event
        })
    }
    
    public nep2Change=(event)=>{
        this.setState({
            nep2:event
        })
    }

    goMyWallet =()=> {
        if(this.props.goMyWallet)
            this.props.goMyWallet();
    }
    /**
     * 导入NEP6钱包
     */
    loadWallet =()=>
    {
        bg.AccountManager.nep2Load(this.state.nep2,this.state.password)
        .then(accounts =>{
            this.goMyWallet();
        })
        .catch(error =>{
            this.setState({
                password_error:true
            })      
        })
    }

	public render() {
        return(                
            <div className="form-content">                            
                <div className="input">
                    <Input type="text" placeholder="输入Nep2" 
                        value={this.state.nep2} 
                        onChange={this.nep2Change}
                        error={this.state.nep2_error}
                        message={this.state.nep2_error?"请使用正确的nep2协议字符串":""}
                    />
                </div>
                <div className="input">
                    <Input type="password" placeholder="输入密码" 
                        value={this.state.password} 
                        onChange={this.passwordChange}
                        error={this.state.password_error}
                        message={this.state.password_error?"密码错误请重试":""}
                    />
                </div>
            </div>
        );
	}
}