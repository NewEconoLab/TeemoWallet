// 输入框组件
import * as React from 'react';
import { ICON } from '../../../image';
import Chooser, { IOption } from '../../../components/Chooser';
import Modal from '../../../components/Modal';
import Exchange from '../exchange';
import classnames = require('classnames');
import { bg } from '../../utils/storagetools';
import common from '../../store/common';
import HeadImg from '../../utils/headimg';
import EventHandler from '../../utils/event';
import { RouteComponentProps } from 'react-router';

interface IProps extends RouteComponentProps
{
    lableChange: (table: string) => void
}

export default class WalletHeader extends React.Component<IProps, {}> {
    constructor(props: any)
    {
        super(props);
    }

    public state = {
        exchange: false,
        activeLable: "history",
        showMenu: false
    }

    public options: IOption[] = [
        { id: 'exchange', name: 'CGAS兑换', icon: ICON.exchange },
        { id: 'browser', name: '区块链浏览器', icon: ICON.bc },
        { id: 'nns', name: 'NNS', icon: ICON.nns },
        { id: 'dice', name: 'DICE', icon: ICON.nns }
    ]
    public componentDidMount()
    {
        const div = document.getElementById('headimg');
        HeadImg(div, common.account.address, 30, 30);        
        // 注册全局点击事件，以便点击其他区域时，隐藏展开的内容
        EventHandler.add(this.globalClick);
    }

    public cutFunction = (option: IOption) =>
    {
        if (option.id == 'exchange')
        {
            this.setState({
                exchange: true
            })
        }
    }

    public showHistory = () =>
    {
        this.setState({
            activeLable: "history"
        })
        if (this.props.lableChange)
        {
            this.props.lableChange('history');
        }
    }

    public showAssets = () =>
    {
        this.setState({
            activeLable: "assets"
        })
        if (this.props.lableChange)
        {
            this.props.lableChange('assets');
        }
    }

    public goOut = () =>
    {
        if (this.props.lableChange)
        {
            bg.AccountManager.logout();
            this.props.lableChange('out');
        }
    }
    public closeExchange = () =>
    {
        this.setState({ exchange: false });
    }
    // 全局点击
    public globalClick = () =>
    {
        this.setState({ showMenu: false });
    }
    // 显示设置菜单
    public onShowMenu = (e) =>
    {
        this.setState({
            showMenu: !this.state.showMenu
        },()=>{
            if(this.state.showMenu){
                const div2 = document.getElementById('wallet1');
                HeadImg(div2, common.account.address, 20, 20);
            }            
        })

        e.stopPropagation();
    }
    // 跳转到钱包
    public showWallet = () =>
    {
        if (this.props.lableChange)
        {
            this.props.lableChange('wallet');
        }
    }
    // 跳转到设置
    public showSetting = () =>
    {
        if (this.props.lableChange)
        {
            this.props.lableChange('setting')
        }
    }
    // 跳转到创建钱包
    public goCreateWallet = ()=> {
        this.props.history.push('/walletnew');
    }
    // 跳转到导入钱包
    public goImportWallet = () => {
        this.props.history.push('/walletnew');
    }

    public render()
    {
        return (
            <div className="head">
                <div className="functionRow"> 
                    <div className="list">
                        <div className="walletCode">
                            <div className="headimg-wrapp" id="headimg" onClick={this.onShowMenu} />
                            <span className="wallet-name">{common.account.walletName ? common.account.walletName : "我的钱包 " + (common.account.index + 1)}</span>
                            {
                                this.state.showMenu && (
                                    <div className="wallet-menu">
                                        <div className="menu-content">
                                            <div className="content-list">
                                                <div className="normal-menu wallet-list">
                                                    <div className="wallet-line" onClick={this.showWallet}>
                                                        <img className="select-icon" src={require("../../../image/selected.png")} alt="" />
                                                        <div className="wallet-image" id="wallet1" />
                                                        <span className="span-text">我的钱包1</span>
                                                        <img className="edit-icon" src={require("../../../image/edit.png")} alt="" />
                                                    </div>
                                                    <div className="wallet-line" onClick={this.showWallet}>
                                                        <div className="wallet-image" id="wallet2" />
                                                        <span className="span-text">我的钱包1</span>
                                                        <img className="edit-icon" src={require("../../../image/edit.png")} alt="" />
                                                    </div>
                                                    <div className="wallet-line" onClick={this.showWallet}>
                                                        <div className="wallet-image" id="wallet3" />
                                                        <span className="span-text">我的钱包1</span>
                                                        <img className="edit-icon" src={require("../../../image/edit.png")} alt="" />
                                                    </div>
                                                </div>
                                                <div className="normal-menu">
                                                    <span className="menu-span" onClick={this.goCreateWallet}>创建钱包</span>
                                                    <span className="menu-span" onClick={this.goImportWallet}>导入钱包</span>
                                                </div>
                                                <div className="normal-menu">
                                                    <span className="menu-span" onClick={this.showSetting}>设置</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pao-wrapper">
                                            <div className="arrow" />
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="function">
                            <Chooser options={this.options} onCallback={this.cutFunction} >
                                <img src={ICON.FUNCTION} height={24} />
                            </Chooser>
                        </div>
                        <div className="out" onClick={this.goOut}>
                            <img src={ICON.LOGOUT} height={24} />
                        </div>
                    </div>
                    <div className="address">{common.account.address}</div>
                </div>
                <Exchange show={this.state.exchange} onHide={this.closeExchange}></Exchange>
            </div>
        );
    }
}