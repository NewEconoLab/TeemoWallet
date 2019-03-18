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
import { observer } from 'mobx-react';

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
        {id:'exchange',name:'CGAS兑换',icon:ICON.exchange},
        {id:'browser',name:'区块链浏览器',icon:ICON.bc},
        {id:'nns',name:'NNS',icon:ICON.nns},
        {id:'dice',name:'DICE',icon:ICON.nns}
    ]
    public componentDidMount(){
        common.initAccountInfo();
        const div = document.getElementById('headimg')
		HeadImg(div,common.account.address);
    }

    public cutFunction =(option:IOption)=>
    {
        if(option.id == 'exchange')
        {
            this.setState({
                exchange:true
            })
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
            // console.log("---------------这边退出了");
            
            // chrome.tabs.query({ active: true, currentWindow: true },  (tabs)=> {
            //     chrome.tabs.sendMessage(tabs[0].id,{
            //         EventName:"Teemmo.NEO.DISCONNECTED",
            //     },()=>{

            //     })
            // })
            this.props.lableChange('out');
        }
    }
    public closeExchange=()=>{
        this.setState({exchange:false});
    }

	public render() {
        const history = classnames("lable",{"active":this.state.activeLable=="history"});
        const assets = classnames("lable",{"active":this.state.activeLable=="assets"});
		return (
            <div className="head">
                <div className="functionRow">
                    <div className="list">
                        <div className="walletCode">
                            <div className="headimg-wrapp" id="headimg" />
                            <span>{common.account.lable}</span>
                        </div>
                        <div className="function">
                            <Chooser options={this.options} onCallback={this.cutFunction} >
                                <img src={ICON.FUNCTION} height={24} />
                            </Chooser>
                        </div>
                        <div className="out" onClick={this.goOut}>
                            <img src={ICON.LOGOUT} height={24}/>
                        </div>
                    </div>
                    <div className="address">{common.account.address}</div>
                </div>
                <div className="lablelist">
                    <div className={history} onClick={this.showHistory}><span>交易记录</span></div>
                    <div className={assets} onClick={this.showAssets}><span>资产</span></div>
                </div>
                <Exchange show={this.state.exchange} onHide={this.closeExchange}></Exchange>
            </div>
		);
	}
}