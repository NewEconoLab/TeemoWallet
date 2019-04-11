// 输入框组件
import * as React from 'react';
import { ICON } from '../../../image';
import Chooser, { IOption } from '../../../components/Chooser';
// import Modal from '../../../components/Modal';
import classnames = require('classnames');
import { bg } from '../../utils/storagetools';
import common from '../../store/common';
// import HeadImg from '../../utils/headimg';
import { observer } from 'mobx-react';
import intl from '../../store/intl';
import Toast from '../../../components/Toast';
import EventHandler from '../../utils/event';
import { RouteComponentProps } from 'react-router';
interface IProps extends RouteComponentProps
{
    lableChange: (table: string) => void
}

@observer
export default class WalletHeader extends React.Component<IProps, {}> {
    constructor(props: any)
    {
        super(props);
    }

    public state = {
        exchange: false,
        // activeLable: "history",
        showMenu: false
    }

    public options: IOption[] = [
        { id: 'exchange', name: intl.message.mywallet.cgasExchange, icon: ICON.exchange },
        { id: 'browser', name: intl.message.mywallet.explorer, icon: ICON.bc },
        { id: 'nns', name: 'NNS', icon: ICON.nns },
        // {id:'dice',name:'DICE',icon:ICON.nns}
    ]
    public componentDidMount()
    {
        common.initAccountInfo();
        // 注册全局点击事件，以便点击其他区域时，隐藏展开的内容
        EventHandler.add(this.globalClick);
    }
    public cutFunction = (option: IOption) =>
    {
        console.log(option);

        if (option.id == 'exchange')
        {
            this.onSwitchPage('exchange');
            // this.setState({
            //     exchange: true
            // })
        }
        if (option.id == 'browser')
        {
            window.open(`https://scan.nel.group/${common.network == 'TestNet' ? 'test' : ''}`, '_blank')
        }
    }
    // 小菜单的选项
    public onSwitchPage = (lable:string) =>
    {
        if (this.props.lableChange)
        {
            this.props.lableChange(lable);
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
    // 复制地址
    public onCopyAddress = () =>
    {
        const oInput = document.createElement('input');
        oInput.value = common.account.address;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display = 'none';
        Toast(intl.message.toast.copySuccess);
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
        })
        e.stopPropagation();
    }
    
    // 跳转到创建钱包或导入钱包
    public goNewWallet = () =>
    {
        this.props.history.push('/walletnew');
    }

    public render()
    {
        const options: IOption[] = [
            { id: 'exchange', name: intl.message.mywallet.cgasExchange, icon: ICON.exchange },
            { id: 'browser', name: intl.message.mywallet.explorer, icon: ICON.bc },
            // {id:'nns',name:'NNS',icon:ICON.nns},
            // {id:'dice',name:'DICE',icon:ICON.nns}
        ];
        return (
            <div className="head">
                <div className="functionRow">
                    <div className="list">
                        <div className="walletCode">
                            <div className="headimg-wrapp" id="headimg" onClick={this.onShowMenu}><img src={ICON.header} /></div>
                            {
                                this.state.showMenu && (
                                    <div className="wallet-menu">
                                        <div className="menu-content">
                                            <div className="content-list">
                                                <div className="normal-menu wallet-list">
                                                    <div className="wallet-line" onClick={this.onSwitchPage.bind(this,'wallet')}>
                                                        <img className="select-icon" src={require("../../../image/selected.png")} alt="" />
                                                        <span className="span-text">我的钱包1</span>
                                                        <img className="edit-icon" src={require("../../../image/edit.png")} alt="" />
                                                    </div>
                                                    <div className="wallet-line" onClick={this.onSwitchPage.bind(this,'wallet')}>
                                                        <span className="span-text">我的钱包1</span>
                                                        <img className="edit-icon" src={require("../../../image/edit.png")} alt="" />
                                                    </div>
                                                    <div className="wallet-line" onClick={this.onSwitchPage.bind(this,'wallet')}>
                                                        <span className="span-text">我的钱包1</span>
                                                        <img className="edit-icon" src={require("../../../image/edit.png")} alt="" />
                                                    </div>
                                                </div>
                                                <div className="normal-menu">
                                                    <span className="menu-span" onClick={this.goNewWallet}>创建钱包</span>
                                                    <span className="menu-span" onClick={this.goNewWallet}>导入钱包</span>
                                                </div>
                                                <div className="normal-menu">
                                                    <span className="menu-span" onClick={this.onSwitchPage.bind(this,'setting')}>设置</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pao-wrapper">
                                            <div className="arrow" />
                                        </div>
                                    </div>
                                )
                            }
                            <div className="account-message">
                                <div className=''>{common.account.lable}</div>
                                <div className='address' onClick={this.onCopyAddress}>{common.account.address.substring(0, 4) + '...' + common.account.address.substring(30, 34)}</div>
                            </div>
                        </div>
                        <div className="function">
                            <Chooser options={options} onCallback={this.cutFunction} >
                                <img src={ICON.FUNCTION} height={24} />
                            </Chooser>
                        </div>
                        <div className="out" onClick={this.goOut}>
                            <img src={ICON.LOGOUT} height={24} />
                        </div>
                    </div>
                </div>                
                
            </div>
        );
    }
}