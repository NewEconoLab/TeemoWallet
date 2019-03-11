import * as React from 'react';
import './index.less';
import { RouteComponentProps } from 'react-router-dom';
import WalletFoot from './foot';
import WalletHeader from './head';
import History from '../history';
import Assets from '../assets';
// import { neotools } from '../../utils/neotools';
import common from '../../store/common';
import ManageAsset from '../manage';
import classnames = require('classnames');

interface AppProps extends RouteComponentProps
{
    develop: boolean;
}

interface AppState
{
    value: string;
    label: string;
}

export default class MyWallet extends React.Component<AppProps, AppState> {
    constructor(props: AppProps, state: AppState)
    {
        super(props, state);
    }

    public state = {
        value: "",
        label: "manage" // history,assets,manage,setting,wallet
    }

    public componentDidMount()
    {
        if (!common.network)
            common.network = "testnet"
        // Example of how to send a message to eventPage.ts.
        if (chrome.tabs)
        {
            chrome.runtime.sendMessage({ popupMounted: true });
        }
    }
    public labelChange = (label) =>
    {
        if (label == "out")
        {
            this.props.history.push('/login')
        }
        this.setState({
            label: label
        });
    }
    // 显示交易历史
    public showHistory = () =>
    {
        this.setState({
            label: "history"
        })
    }
    // 显示资产内容
    public showAssets = () =>
    {
        this.setState({
            label: "assets"
        })
    }

    render()
    {
        const history = classnames("lable", { "active": this.state.label == "history" });
        const assets = classnames("lable", { "active": this.state.label == "assets" });
        return (
            <div className="mywallet">
                <WalletHeader lableChange={this.labelChange} />
                <div className="menu-wrapper">
                    {
                        (this.state.label === 'history' || this.state.label === 'assets') && (
                            <div className="lablelist">
                                <div className={history} onClick={this.showHistory}><span>交易记录</span></div>
                                <div className={assets} onClick={this.showAssets}><span>资产</span></div>
                            </div>
                        )
                    }
                    {
                        this.state.label === 'manage' && <div className="single-lable"><span>管理代币</span></div>
                    }
                    {
                        this.state.label === 'setting' && <div className="single-lable"><span>设置</span></div>
                    }
                    {
                        this.state.label === 'wallet' && <div className="single-lable"><span>钱包</span></div>
                    }
                </div>
                {
                    (this.state.label === 'history' || this.state.label === 'assets') && (
                        <>
                            <div className="home-body">
                                {this.state.label == "history" ?
                                    <History /> :
                                    <Assets lableChange={this.labelChange} />
                                }
                            </div>
                            <WalletFoot />
                        </>
                    )
                }
                {
                    this.state.label === 'manage' && <ManageAsset />
                }
            </div>
        )
    }
}
