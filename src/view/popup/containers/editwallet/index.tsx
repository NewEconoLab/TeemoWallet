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
import { bg } from '../../utils/storagetools';
import intl from '../../store/intl';
import { ICON } from '../../../image';
// import PrivateKey from './privatekey';
// import DeleteWallet from './deletewallet';
interface IProps
{
    lableChange: (table: string) => void,
    twiceChange:(label:string)=>void,
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
        this.setState({
            downloadHref:URL.createObjectURL(blob),
            codeLink:nepAccount.nep2key,
            walletName:nepAccount.walletName
        })
    }

    public state = {
        showDialog: 0,  // 0为不显示，1为备份弹框，2为私钥弹框，3为删除弹框
        codeLink:'',
        downloadHref:'',
        walletName:'',
        editNameState:0
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
    public toChangeWalletName = () =>{
        bg.AccountManager.setAccountName(this.state.walletName);
        common.initAccountInfo();
        this.setState({editNameState:0})
    }
    // 复制nep2
	public onCopyNep2 = () => {		
		const oInput = document.createElement('input');
		oInput.value = this.state.codeLink;
		document.body.appendChild(oInput);
		oInput.select();                                    // 选择对象
		document.execCommand("Copy");                       // 执行浏览器复制命令
		oInput.className = 'oInput';
        oInput.style.display = 'none';
		Toast(intl.message.toast.copySuccess);		
        oInput.remove();
    }
    
    public onEditName=()=>{
        this.setState({editNameState:1},()=>{            
            document.getElementById('edit-accountName').focus();
            (document.getElementById('edit-accountName') as HTMLInputElement).select();
        });
    }
    
    public render()
    {
        return (
            <div className="editwallet-wrapper">
                <div className="editwallet-content">
                {this.state.editNameState==0?                
                    <div className="editname-wrap">
                        <input className="edit-input" type="text" value={this.state.walletName} disabled={true} />
                        <img className="edit-icon" src={require("../../../image/edit2.png")} alt="" onClick={this.onEditName} />
                    </div>:                    
                    <div className="editname-wrap">
                        <input className="edit-input" id='edit-accountName' type="text" value={this.state.walletName} onChange={this.onChangeWalletName} />
                        <img className="edit-icon" src={ICON.saveEdit} alt="" onClick={this.toChangeWalletName} />
                    </div>
                }
                    <div className="edit-address">
                        <div className="bold-text">{intl.message.editwallet.address}</div>
                        <span className="bold-text">{common.account.address} </span>
                    </div>
                    <div className="edit-nep">
                        <div className="bold-text">{intl.message.editwallet.nep2key} </div>
                        <p className="tips-msg">{intl.message.editwallet.msg1}
                        <br />{intl.message.editwallet.msg2}</p>
                        <div className="nep-wrapper">
                            <div className="nep-text" onClick={this.onCopyNep2}>{this.state.codeLink}</div>
                            <span className="copy-text">（{intl.message.editwallet.msg3}）</span>
                        </div>
                    </div>
                    <div className="normal-editwallet">
                        <div className="normal-left">
                            <span className="bold-text">{intl.message.editwallet.msg4}</span>
                        </div>
                        <div className="normal-right">
                            {this.state.downloadHref?
                            <a download={this.state.walletName+'.json'} href={this.state.downloadHref}>
                                <Button text={intl.message.editwallet.download} size="small" onClick={this.onShowBackup} />
                            </a>:
                                <Button text={intl.message.editwallet.download} size="small" type="disable-btn" />
                            }
                        </div>
                    </div>
                    <p className="normal-text">{intl.message.editwallet.msg5}</p>
                    <div className="normal-editwallet">
                        <div className="normal-left">
                            <span className="bold-text">{intl.message.editwallet.prikey} </span>
                        </div>
                        <div className="normal-right">
                            <Button text={intl.message.editwallet.display} size="small" onClick={this.onShowTwiceDialog.bind(this,'private')} />
                        </div>
                    </div>
                    <p className="normal-text">{intl.message.editwallet.msg8}</p>
                    <div className="normal-editwallet">
                        <div className="normal-left">
                            <span className="bold-text">{intl.message.editwallet.deletewallet} </span>
                        </div>
                        <div className="normal-right">
                            <Button text={intl.message.button.delete} size="small" onClick={this.onShowTwiceDialog.bind(this,'delete')} />
                        </div>
                    </div>
                    <p className="normal-text">{intl.message.editwallet.msg11}</p>
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
