// 输入框组件
import * as React from 'react';
import { ICON } from '../../../image';
import Chooser, { IOption } from '../../../components/Chooser';
// import Modal from '../../../components/Modal';
import Exchange from '../exchange';
import classnames = require('classnames');
import { bg } from '../../utils/storagetools';
import common from '../../store/common';
// import HeadImg from '../../utils/headimg';
import { observer } from 'mobx-react';
import intl from '../../store/intl';
import Toast from '../../../components/Toast';

interface IProps{
    lableChange:(table:string)=>void
}

@observer
export default class WalletHeader extends React.Component<IProps, {}> {
	constructor(props: any) {
		super(props);
    }

    public state={
        exchange:false,
        activeLable:"history"
    }

    public options:IOption[]=[
        {id:'exchange',name:intl.message.mywallet.cgasExchange,icon:ICON.exchange},
        {id:'browser',name:intl.message.mywallet.explorer,icon:ICON.bc},
        {id:'nns',name:'NNS',icon:ICON.nns},
        // {id:'dice',name:'DICE',icon:ICON.nns}
    ]
    public componentDidMount(){
        common.initAccountInfo();
        // const div = document.getElementById('headimg')
		// HeadImg(div,common.account.address);
    }

    public cutFunction =(option:IOption)=>
    {
        console.log(option);
        
        if(option.id == 'exchange')
        {
            this.setState({
                exchange:true
            })
        }
        if(option.id == 'browser')
        {
            window.open(`https://scan.nel.group/${common.network=='TestNet'?'test':''}`,'_blank')
        }
    }

    public showHistory=()=>{
        this.setState({
            activeLable:"history"
        })
        if(this.props.lableChange){
            this.props.lableChange('history');
        }
    }

    public showAssets=()=>{
        this.setState({
            activeLable:"assets"
        })
        if(this.props.lableChange){
            this.props.lableChange('assets');
        }
    }

    public goOut=()=>{
        if(this.props.lableChange){
            bg.AccountManager.logout();
            this.props.lableChange('out');
        }
    }
    public closeExchange=()=>{
        this.setState({exchange:false});
    }
	// 复制地址
	public onCopyAddress = () => {		
		const oInput = document.createElement('input');
		oInput.value = common.account.address;
		document.body.appendChild(oInput);
		oInput.select(); // 选择对象
		document.execCommand("Copy"); // 执行浏览器复制命令
		oInput.className = 'oInput';
		oInput.style.display = 'none';
		// alert(2)
		Toast(intl.message.toast.copySuccess);
		
	}

	public render() {
        const history = classnames("header-label",{"active":this.state.activeLable=="history"});
        const assets = classnames("header-label",{"active":this.state.activeLable=="assets"});
        const options:IOption[]=[
            {id:'exchange',name:intl.message.mywallet.cgasExchange,icon:ICON.exchange},
            {id:'browser',name:intl.message.mywallet.explorer,icon:ICON.bc},
            // {id:'nns',name:'NNS',icon:ICON.nns},
            // {id:'dice',name:'DICE',icon:ICON.nns}
        ];
		return (
            <div className="head">
                <div className="functionRow">
                    <div className="list">
                        <div className="walletCode">
                            <div className="headimg-wrapp" id="headimg" ><img src={ICON.header}/></div>
                            <div className="account-message">
                                <div className=''>{common.account.lable}</div>
                                <div className='address' onClick={this.onCopyAddress}>{common.account.address.substring(0,4)+'...'+common.account.address.substring(30,34)}</div>
                            </div>
                        </div>
                        <div className="function">
                            <Chooser options={options} onCallback={this.cutFunction} >
                                <img src={ICON.FUNCTION} height={24} />
                            </Chooser>
                        </div>
                        <div className="out" onClick={this.goOut}>
                            <img src={ICON.LOGOUT} height={24}/>
                        </div>
                    </div>
                </div>
                <div className="labellist">
                    <div className={history} onClick={this.showHistory}><span>{intl.message.mywallet.records}</span></div>
                    <div className={assets} onClick={this.showAssets}><span>{intl.message.mywallet.assets}</span></div>
                </div>
                <Exchange show={this.state.exchange} onHide={this.closeExchange}></Exchange>
            </div>
		);
	}
}