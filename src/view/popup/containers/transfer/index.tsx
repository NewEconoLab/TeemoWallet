/**
 * 按钮组件
 */
import * as React from 'react';
// import { observer } from 'mobx-react';
import './index.less';
import Modal from '../../../components/Modal';
import Select, { IOption } from '../../../components/Select';
import Input from '../../../components/Input';
import Checkbox from '../../../components/Checkbox';
import Button from '../../../components/Button';
import { bg } from '../../utils/storagetools';
import common from '../../store/common';

interface IProps
{
	show:boolean,
	onHide?:()=>void
}

interface IState
{
	infoShow:boolean,
	show:boolean,
	address:string,
	amount:string,
	asset:string,
	netfee:boolean,
}

// @observer
export default class Transfer extends React.Component<IProps, IState> 
{
	constructor(props: IProps)
	{
		super(props);		
	}
	public state = {
		show:false,
		infoShow:false,
		address:"",
		amount:"",
		asset:"",
		netfee:false,
	}
	public options:IOption[]=[
		{id:'cgasexchange',name:'GAS'},
		{id:'gasexchange',name:'CGAS'},
		{id:'gasexchange',name:'NEO'}
	]
	// 监控输入内容
	public onAddrChange = (event) =>
	{
		this.setState({address:event})
	}
	// 监控输入内容
	public onAmountChange = (event) =>
	{
		this.setState({amount:event})
	}
	public showInfo=()=>{
		// this.props.onHide();
		this.setState({
			infoShow:true
		})
	}
	public closeInfo=()=>{
		this.setState({
			infoShow:false
		})
	}
	public onHide=()=>{
		this.setState({
			address:"",
			amount:"",
			infoShow:false
		})
		this.props.onHide?this.props.onHide():null;
	}
	public onCheck=(event:boolean)=>{
		this.setState({
			netfee:event
		})
	}
	public send=()=>{
		bg.transfer({
			"amount":this.state.amount,
			"asset":this.state.asset,
			"fromAddress":common.account.address,
			"toAddress":this.state.address,
			"fee":this.state.netfee?"0.001":"0",
			"network":"TestNet"
		})
		.then(result=>{
			console.log(result.txid);			
		})
		.catch(error=>{
			console.log(error);			
		})
	}

	public render()
	{
		return (
			<Modal title={this.state.infoShow?"转账详情":"转账"} show={this.props.show}>
			{
				
				this.state.infoShow?
				<div className="transfer-info">
					<div className="info-line first">							
						<div className="title">从</div>
						<div className="content">
							<div className="double walletname">{common.account.walletName}</div>
							<div className="double address">{common.account.address}</div>
						</div>
					</div>
					<div className="info-line">							
						<div className="title">发送</div>
						<div className="content">{this.state.amount}</div>
					</div>
					<div className="info-line">							
						<div className="title">至</div>
						<div className="content"><div className="address">{this.state.address}</div> </div>
					</div>
					<div className="info-line">							
						<div className="title">手续费</div>
						<div className="content">{this.state.netfee?'0.001 GAS':'0 GAS'}</div>
					</div>
					<div className="btn-list">
						<div className="cancel">
							<Button type="warn" text="取消" onClick={this.onHide} />
						</div>
						<div className="confrim">
							<Button type="primary" text="确定" onClick={this.send}/>
						</div>
					</div>
				</div>
				:
				<>
					<div className="line">
						<Select options={this.options} text="资产" />
					</div>
					<div className="line">
						<Input placeholder="发送至" value={this.state.address} onChange={this.onAddrChange} type="text" />		
					</div>		
					<div className="line">
						<Input placeholder="发送数量" value={this.state.amount} onChange={this.onAmountChange} type="text" />		
					</div>		
					<div className="line">
						<Checkbox text="优先确认交易（支付 0.001 GAS）" onClick={this.onCheck} />
					</div>
					<div className="btn-list">
						<div className="cancel">
							<Button type="warn" text="取消" onClick={this.onHide} />
						</div>
						<div className="confrim">
							<Button type="primary" text="下一步" onClick={this.showInfo}/>
						</div>
					</div>
				</>
			}
			</Modal>
		);
	}
}