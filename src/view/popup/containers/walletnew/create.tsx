// 输入框组件
import * as React from 'react';
import Button from '../../../components/Button';
import Input from '../../../components/Input';

interface IState{
    walletname:string,
    password:string,
    passwordconfirm:string
}

interface IPorps{
    goBack:()=>void;
}

// @observer
export default class WalletCreate extends React.Component<IPorps, IState> {
    moudle_download: boolean;
    download_href: string;
    download_name: string;
    walletname: string;
	constructor(props: any) {
		super(props);
    }
    
    public wallet: ThinNeo.nep6wallet = new ThinNeo.nep6wallet();

    public state={
        walletname:"",
        password:"",
        passwordconfirm:""
    }
    
    public passwordChange=(event)=>{
        this.setState({
            password:event
        })
    }

    public password2Change=(event)=>{
        this.setState({
            passwordconfirm:event
        })
    }

    public walletNameChange =(event)=>{
        this.setState({
            walletname:event
        })
    }
    
    goBack = ()=>
    {
        if(this.props.goBack)
            this.props.goBack();
    }

    createWallet =()=>{        
        var array = new Uint8Array(32);
        var key = Neo.Cryptography.RandomNumberGenerator.getRandomValues<Uint8Array>(array);
        // spanPri.textContent = key.toHexString();
        var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(key);
        var addr = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
        this.moudle_download = true;

        this.wallet.scrypt = new ThinNeo.nep6ScryptParameters();
        this.wallet.scrypt.N = 16384;
        this.wallet.scrypt.r = 8;
        this.wallet.scrypt.p = 8;
        this.wallet.accounts = [];
        this.wallet.accounts[ 0 ] = new ThinNeo.nep6account();
        this.wallet.accounts[ 0 ].address = addr;
        ThinNeo.Helper.GetNep2FromPrivateKey(key, this.state.password, this.wallet.scrypt.N, this.wallet.scrypt.r, this.wallet.scrypt.p, (info, result) =>
        {
            if (info == "finish")
            {
            this.wallet.accounts[ 0 ].nep2key = result;
            this.wallet.accounts[ 0 ].contract = new ThinNeo.contract();
            var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(key);
            this.wallet.accounts[ 0 ].contract.script = ThinNeo.Helper.GetAddressCheckScriptFromPublicKey(pubkey).toHexString();
            var jsonstr = JSON.stringify(this.wallet.toJson());
            var blob = new Blob([ ThinNeo.Helper.String2Bytes(jsonstr) ]);
            this.download_href = URL.createObjectURL(blob);
            this.download_name = this.walletname + ".json";
            }
        });
    }

	public render() {
        return(
            <>                
                {!this.download_href?                
                <div className="form">                
                    <div className="form-content">                            
                        <div className="first">
                            <Input type="text" placeholder="为你的钱包命名" value={this.state.walletname} onChange={this.walletNameChange}/>
                        </div>
                        <div className="input">
                            <Input type="password" placeholder="设置密码" value={this.state.password} onChange={this.passwordChange}/>
                        </div>
                        <div className="input">
                            <Input type="password" placeholder="确认密码" value={this.state.passwordconfirm} onChange={this.password2Change}/>
                        </div>
                        <div className="btn-list">
                            <div className="btn-first">
                                <Button type='warn' text="取消" onClick={this.goBack}/>
                            </div>
                            <div>
                                <Button type='primary' text="确定" onClick={this.createWallet}/>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="form">                
                    <div className="form-content">       
                    </div>
                </div>
                }
            </>
        )
	}
}