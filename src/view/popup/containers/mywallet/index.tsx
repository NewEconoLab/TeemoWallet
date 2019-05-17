import * as React from 'react';
import './index.less';
import { RouteComponentProps } from 'react-router-dom';
import WalletFoot from './foot';
import WalletHeader from './head';
import History from '../history';
import Assets from '../assets';
import common from '../../store/common';
import { observer } from 'mobx-react';
import classnames = require('classnames');
import historyStore from '../history/store/history.store';
import Exchange from '../exchange';
import Qrcode from '../qrcode';
import EditWallet from '../editwallet';
import ManageAsset from '../manage';
import Setting from '../setting';
import intl from '../../store/intl';
import Transfer from '../transfer';
import { HASH_CONFIG } from '../../../config';
import PrivateKey from '../editwallet/privatekey';
import DeleteWallet from '../editwallet/deletewallet';
import manageStore from '../manage/store/manage.store';
import About from '../about';
import { bg } from '../../utils/storagetools';
interface AppProps extends RouteComponentProps
{
    develop: boolean;
}

interface AppState
{
    value: string;
    label: string;// 控制主页的显示窗口
    showPage: string;// 控制显示窗口
    tranAsset:string;// 转账资产
    showTwiceDialog:string,// 控制第二次显示窗口
}


@observer
export default class MyWallet extends React.Component<AppProps, AppState> {
    constructor(props: AppProps, state: AppState)
    {
        super(props, state);
    }

    public state = {
        value: "",
        label: "assets",// history,assets
        showPage: "", // manage,setting,edit,exchange,qrcode
        showTwiceDialog:"",// private,delete
        tranAsset:HASH_CONFIG.ID_GAS,
    }

    public componentDidMount()
    {
        if(bg.getAccountTaskState(common.account.address)>0)
        {
            this.setState({label:'history',showTwiceDialog:''})
        }
        else
        {
            this.setState({label:'assets',showTwiceDialog:''})
        }
        // Example of how to send a message to eventPage.ts.      
        common.initNetWork();
        manageStore.initAssetList();
        // common.initAccountBalance();
        historyStore.initHistoryList();
        if (chrome.tabs)
        {
            chrome.runtime.sendMessage({ popupMounted: true });
        }
    }
    // 切换编辑窗口
    public labelChange = (label:string,asset?:string) =>
    {
        if (label == "out")
        {
            // this.setState({
            //     showPage:''
            // })
            this.props.history.push('/login')
        }
        else if(label == "history")
        {
            this.setState({
                label: "history",
                showPage:''
            })
        }
        else
        {
            this.setState({
                showPage: label,
                tranAsset:asset
            });
        }
    }
    // 切换二次编辑窗口
    public twiceChange = (label:string)=>
    {
        this.setState({
            showTwiceDialog:label
        })
    }

    // 显示交易历史
    public showHistory = () =>
    {
        this.setState({
            label: "history",
            showPage:''
        })
    }
    // 显示资产内容
    public showAssets = () =>
    {
        this.setState({
            label: "assets",
            showPage:''
        })
    }
    // 关闭编辑页面
    public onClosePage = () =>
    {
        this.setState({
            showPage: ''
        })
    }
    // 关闭二次窗口
    public onCloseDialog = () => {
        this.setState({
            showTwiceDialog:''
        })
    }

    public onManageSave = ()=>{
        const save = this.refs.manageAsset['onSaveManage']
        save();
        this.onClosePage();
    }
    render()
    {
        const history = classnames("header-label", { "active": this.state.label == "history" });
        const assets = classnames("header-label", { "active": this.state.label == "assets" });

        return (
            <div className="mywallet">
                <WalletHeader lableChange={this.labelChange} {...this.props} />
                <div className="labellist">
                    {
                        this.state.showPage===''  && (
                            <>
                                <div className={history} onClick={this.showHistory}><span>{intl.message.mywallet.records}</span></div>
                                <div className={assets} onClick={this.showAssets}><span>{intl.message.mywallet.assets}</span></div>
                            </>
                        )
                    }
                    {
                        (this.state.showPage !== '' && this.state.showTwiceDialog === '') && (
                            <div className="single-lable">
                                {
                                    this.state.showPage === 'exchange' && <span>{intl.message.mywallet.cgasExchange}</span>
                                }
                                {
                                    this.state.showPage === 'qrcode' && <span>{intl.message.assets.receiving}</span>
                                }
                                {
                                    this.state.showPage === 'transfer' && <span>{intl.message.assets.transfer}</span>
                                }
                                {
                                    this.state.showPage === 'manage' && <><span>{intl.message.assets.manager}</span><p className="close-page" onClick={this.onManageSave}>{intl.message.assets.save}</p></>
                                }
                                {
                                    this.state.showPage === 'edit' && <span>{intl.message.setting.wallet}</span>
                                }
                                {
                                    this.state.showPage === 'setting' && <span>{intl.message.editwallet.setting}</span>
                                }
                                {
                                    this.state.showPage === 'about' && <span>{intl.message.about.aboutas}</span>
                                }
                                {
                                    this.state.showPage != 'manage' && 
                                <img onClick={this.onClosePage} className="close-page" src={require('../../../image/close-nomal.png')} alt="" />
                                }
                            </div>
                        )
                    }
                    {
                        this.state.showTwiceDialog!==''&& (
                            <div className="single-lable">
                                {
                                    this.state.showTwiceDialog === 'private' && <span>{intl.message.editwallet.msg7}</span>
                                }
                                {
                                    this.state.showTwiceDialog === 'delete' && <span>{intl.message.editwallet.deletewallet}</span>
                                }
                                <img onClick={this.onCloseDialog} className="close-page" src={require('../../../image/close-nomal.png')} alt="" />
                            </div>
                        )
                    }
                </div>
                <div className="body">

                    {
                        (this.state.label === 'history' && this.state.showPage==='' ) && <History lableChange={this.labelChange} />
                    }
                    {
                        (this.state.label === 'assets'  && this.state.showPage==='' ) && <Assets lableChange={this.labelChange}  />
                    }
                    {
                        (this.state.showPage === 'exchange' && this.state.showTwiceDialog === '') && <Exchange lableChange={this.labelChange} />
                    }
                    {
                        (this.state.showPage === 'qrcode' && this.state.showTwiceDialog === '')  && <Qrcode lableChange={this.labelChange} />
                    }
                    {
                        (this.state.showPage === 'transfer' && this.state.showTwiceDialog === '')  && <Transfer lableChange={this.labelChange} asset={this.state.tranAsset} />
                    }
                    {
                        (this.state.showPage === 'manage' && this.state.showTwiceDialog === '')  && <ManageAsset lableChange={this.labelChange} ref="manageAsset" />
                    }
                    {
                        (this.state.showPage === 'edit' && this.state.showTwiceDialog === '')  && <EditWallet lableChange={this.labelChange} twiceChange={this.twiceChange} />
                    }
                    {
                        (this.state.showPage === 'setting' && this.state.showTwiceDialog === '')  && <Setting lableChange={this.labelChange} />
                    }
                    {
                        (this.state.showPage === 'about' && this.state.showTwiceDialog === '') && <About lableChange={this.labelChange} />
                    }
                    {
                        this.state.showTwiceDialog === 'private' && <PrivateKey onClose={this.onCloseDialog}/>
                    }
                    {
                        this.state.showTwiceDialog === 'delete' && <DeleteWallet onClose={this.onCloseDialog} {...this.props} />
                    }
                </div>
                <WalletFoot />
            </div>
        )
    }
}
