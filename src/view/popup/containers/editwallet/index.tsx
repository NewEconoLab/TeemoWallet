/**
 * 钱包编辑
 */
import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import { observer } from 'mobx-react';
import Toast from '../../../components/Toast';
import Backup from './backup';
import common from '../../store/common';
// import PrivateKey from './privatekey';
// import DeleteWallet from './deletewallet';
interface IProps
{
    lableChange: (table: string) => void,
    twiceChange:(label:string)=>void
}
@observer
export default class EditWallet extends React.Component<IProps, {}>
{
    constructor(props: any)
    {
        super(props);
    }

    componentDidMount(){        
        const wallet: ThinNeo.nep6wallet = new ThinNeo.nep6wallet();
        const nepAccount = common.accountList.find(acc=> common.account.address==acc.address);
        wallet.scrypt=nepAccount.scrypt;
        wallet.accounts=[];
        wallet.accounts[0]=new ThinNeo.nep6account();
        wallet.accounts[0].nep2key=nepAccount.nep2key;
        wallet.accounts[0].address=nepAccount.address;
        wallet.accounts[0].contract= new ThinNeo.contract();
        wallet.accounts[0].contract.script = ThinNeo.Helper.GetAddressCheckScriptFromPublicKey(common.account.pubkeyHex.hexToBytes()).toHexString();
        var jsonstr = JSON.stringify(wallet.toJson());
        var blob = new Blob([ ThinNeo.Helper.String2Bytes(jsonstr) ]);
        this.setState({downloadHref:URL.createObjectURL(blob)})
    }

    public state = {
        showDialog: 0,  // 0为不显示，1为备份弹框，2为私钥弹框，3为删除弹框
        codeLink:'',
        downloadHref:''
    }
    public onChangeWalletName = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        if (e.target.value.length > 16)
        {
            return
        }
        this.setState({
            walletName: e.target.value
        })
    }
    // 返回上一页
    public goBack = () =>
    {
        if (this.props.lableChange)
        {
            this.props.lableChange('history');
        }
    }
    public onShowTwiceDialog = (label:string) => {
        if(this.props.twiceChange){
            this.props.twiceChange(label);
        }
    }
     // 关闭弹框
    public onCloseModel = () =>
    {
        this.setState({ showDialog: 0 });
    }
    // 弹出备份
    public onShowBackup = () =>
    {
        this.setState({ showDialog: 1 })
    }
    //  // 弹出私钥
    //  public onShowPrivate = () =>
    //  {
    //      this.setState({ showDialog: 2 })
    //  }
   
    // // 弹出删除
    // public onShowDelete = () =>
    // {
    //     this.setState({ showDialog: 3 })
    // }
    // 复制nep2
	public onCopyNep2 = () => {		
		const oInput = document.createElement('input');
		oInput.value = common.accountList.find(acc=> common.account.address==acc.address).nep2key
		document.body.appendChild(oInput);
		oInput.select(); // 选择对象
		document.execCommand("Copy"); // 执行浏览器复制命令
		oInput.className = 'oInput';
		oInput.style.display = 'none';
		Toast("复制成功");		
	  }
    public render()
    {
        return (
            <div className="editwallet-wrapper">
                <div className="editwallet-content">
                    <div className="editname-wrap">
                        <input className="edit-input" type="text" value={common.account.lable} onChange={this.onChangeWalletName} />
                        <img className="edit-icon" src={require("../../../image/edit2.png")} alt="" />
                    </div>
                    <div className="edit-address">
                        <div className="bold-text">地址</div>
                        <span className="bold-text">{common.account.address} </span>
                    </div>
                    <div className="edit-nep">
                        <div className="bold-text">Nep2加密密钥 </div>
                        <p className="tips-msg">使用NEP2加密密钥及密码可以在其他地方打开您的钱包。
                        <br />您的加密密钥是:</p>
                        <div className="nep-wrapper">
                            <div className="nep-text" onClick={this.onCopyNep2}>{common.accountList.find(acc=> common.account.address==acc.address).nep2key}</div>
                            <span className="copy-text">（点击直接复制）</span>
                        </div>
                    </div>
                    <div className="normal-editwallet">
                        <div className="normal-left">
                            <span className="bold-text">Nep6备份文件</span>
                        </div>
                        <div className="normal-right">
                            {this.state.downloadHref?
                            <a download={common.account.lable+'.json'} href={this.state.downloadHref}>
                                <Button text="下载" size="small" onClick={this.onShowBackup} />
                            </a>:
                                <Button text="下载" size="small" type="disable-btn" />
                            }
                        </div>
                    </div>
                    <p className="normal-text">备份您的钱包，使用时将需要密码。</p>
                    <div className="normal-editwallet">
                        <div className="normal-left">
                            <span className="bold-text">私钥 </span>
                        </div>
                        <div className="normal-right">
                            <Button text="显示私钥" size="small" onClick={this.onShowTwiceDialog.bind(this,'private')} />
                        </div>
                    </div>
                    <p className="normal-text">私钥是未经过加密的钱包备份，请勿泄露给他人。</p>
                    <div className="normal-editwallet">
                        <div className="normal-left">
                            <span className="bold-text">删除钱包 </span>
                        </div>
                        <div className="normal-right">
                            <Button text="删除" size="small" onClick={this.onShowTwiceDialog.bind(this,'delete')} />
                        </div>
                    </div>
                    <p className="normal-text">从钱包列表中删除当前钱包及其全部数据。</p>
                </div>
                {/* <div className="editwallet-footer">
                    <Button text="返回" size="adaptation" onClick={this.goBack} />
                </div> */}
                <Backup show={this.state.showDialog === 1} onHide={this.onCloseModel} />
                {/* {
                    this.state.showDialog === 2 && <PrivateKey onClose={this.onCloseModel} />
                }
                
                <DeleteWallet show={this.state.showDialog === 3} onHide={this.onCloseModel} /> */}
            </div>
        );
    }
}
