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
interface AppProps extends RouteComponentProps
{
    develop: boolean;
}

interface AppState
{
    value: string;
    label: string;// 控制主页的显示窗口
    showPage: string;// 控制显示窗口
    tranAsset:string;
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
        showPage: "manage", // manage,setting,wallet,exchange,qrcode
        tranAsset:HASH_CONFIG.ID_GAS,
    }

    public componentDidMount()
    {
        // Example of how to send a message to eventPage.ts.      
        common.initNetWork();
        common.initAccountBalance();
        historyStore.initHistoryList();
        if (chrome.tabs)
        {
            chrome.runtime.sendMessage({ popupMounted: true });
        }
    }
    public labelChange = (label:string,asset?:string) =>
    {
        if (label == "out")
        {
            this.props.history.push('/login')
        }
        this.setState({
            showPage: label,
            tranAsset:asset?asset:HASH_CONFIG.ID_GAS
        });
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
                        this.state.showPage !== '' && (
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
                                    this.state.showPage === 'manage' && <span>管理代币</span>
                                }
                                {
                                    this.state.showPage === 'wallet' && <span>钱包</span>
                                }
                                {
                                    this.state.showPage === 'setting' && <span>设置</span>
                                }
                                <img onClick={this.onClosePage} className="close-page" src={require('../../../image/close-nomal.png')} alt="" />
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
                        this.state.showPage === 'exchange' && <Exchange lableChange={this.labelChange} />
                    }
                    {
                        this.state.showPage === 'qrcode' && <Qrcode lableChange={this.labelChange} />
                    }
                    {
                        this.state.showPage === 'transfer' && <Transfer lableChange={this.labelChange} asset={this.state.tranAsset} />
                    }
                    {
                        this.state.showPage === 'manage' && <ManageAsset lableChange={this.labelChange} />
                    }
                    {
                        this.state.showPage === 'wallet' && <EditWallet lableChange={this.labelChange} />
                    }
                    {
                        this.state.showPage === 'setting' && <Setting lableChange={this.labelChange} />
                    }
                </div>
                <WalletFoot />
            </div>
        )
    }
}
