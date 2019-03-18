// 输入框组件
import * as React from 'react';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react';
import { AccountInfo, NepAccount } from '../../../../common/entity';
import { Storage_local } from '../../utils/storagetools';
import common from '../../store/common';

interface IState{
    walletname:string,
    walletname_error:boolean,
    moudle_download: boolean,
    download_href: string,
    download_name: string,
    password:string,
    passwordconfirm:string,
    passwordconfirm_error:boolean,
    password_error:boolean,
    wif:string,
    account:AccountInfo
}

interface IPorps{
    goBack:()=>void;
    goMyWallet:()=>void;
}

@observer
export default class WalletCreate extends React.Component<IPorps, IState> {
	constructor(props: any) {
		super(props);
    }
    
    public wallet: ThinNeo.nep6wallet = new ThinNeo.nep6wallet();

    public state:IState={
        walletname_error:false,
        moudle_download:false,
        password_error:false,
        passwordconfirm_error:false,
        download_href:"",
        download_name:"",
        walletname:"",
        password:"",
        passwordconfirm:"",
        wif:"",
        account:null
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

    public walletNameChange =(event)=>{
        this.setState({
            walletname_error: !(/^[\u4e00-\u9fffa-zA-Z]{1,15}$/.test(event))
        })
        this.setState({
            walletname:event
        })
    }
    
    goBack = ()=>
    {
        if(this.props.goBack)
            this.props.goBack();
    }

    goMyWallet =()=> {
        Storage_local.setAccount(this.state.account);
        common.initAccountInfo();
        if(this.props.goMyWallet)
            this.props.goMyWallet();
    }

    createWallet =()=>{        
        var array = new Uint8Array(32);
        var key = Neo.Cryptography.RandomNumberGenerator.getRandomValues<Uint8Array>(array);
        // spanPri.textContent = key.toHexString();
        var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(key);
        var addr = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);

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
                const wif = ThinNeo.Helper.GetWifFromPrivateKey(key);
                this.setState({
                    download_name:this.state.walletname + ".json"
                })
                this.setState({
                    download_href:URL.createObjectURL(blob)
                });
                this.setState({
                    wif:wif
                });
                this.setState({
                    moudle_download:true
                });
                const account:AccountInfo = new AccountInfo(
                    new NepAccount(
                        this.state.walletname,
                        this.wallet.accounts[0].address,
                        this.wallet.accounts[0].nep2key,
                        this.wallet.scrypt,
                    ),
                    key,
                    pubkey,
                )
                this.setState({account})
            }
        });
    }

	public render() {
        const disable = 
        (this.state.password_error || this.state.walletname_error || this.state.passwordconfirm_error)||
        (this.state.walletname =="" || this.state.password =="" ||this.state.passwordconfirm =="");
        return(
            <>                
            {!this.state.moudle_download?                
                <div className="form">                
                    <div className="form-content">                            
                        <div className="first">
                            <Input type="text" placeholder="为你的钱包命名" 
                            value={this.state.walletname} 
                            onChange={this.walletNameChange} 
                            error={this.state.walletname_error} 
                            message={this.state.walletname_error?"请输入少于16个英文字符的名称":""} 
                            />
                        </div>
                        <div className="input">
                            <Input type="password" placeholder="设置密码" 
                            value={this.state.password} 
                            onChange={this.passwordChange}
                            error={this.state.password_error}
                            message={this.state.password_error?"请输入不小于8位，且包含大小写的密码":""}
                            />
                        </div>
                        <div className="input">
                            <Input type="password" placeholder="确认密码" 
                                value={this.state.passwordconfirm} 
                                onChange={this.password2Change}
                                error={this.state.passwordconfirm_error}
                                message={this.state.passwordconfirm_error?"请输入相同的密码":""}
                            />
                        </div>
                        <div className="btn-list">
                            <div className="btn-first">
                                <Button type='warn' text="取消" onClick={this.goBack}/>
                            </div>
                            <div>
                                <Button type='primary' text="确定" onClick={this.createWallet} disabled={disable}/>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="form">                
                    <div className="form-content">
                        <div className="form-line">
                            <div className="line-title">钱包创建成功</div>
                            请将钱包备份后再使用!
                        </div>
                        <div className="form-line">
                            <div className="line-title">私钥</div>
                            <div className="prikey">{this.state.wif}</div>
                        </div>
                        <div className="form-line">
                            <a href={this.state.download_href} download={this.state.download_name}>
                                <Button text="下载备份文件并继续" size="long" onClick={this.goMyWallet}/>
                            </a>
                        </div>
                    </div>
                </div>
            }
            </>
        )
	}
}