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
import { NNSTool } from '../../utils/nnstool';
import { neotools } from '../../../notify/utils/neotools';
import { asNumber } from '../../utils/numberTool';
import { HASH_CONFIG } from '../../../config';
import Toast from '../../../components/Toast';

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
	errorAddr:boolean,
	errorAmount:boolean,
	verifyPass:boolean,
	checkDisable:boolean,
	addrMessage:string,
	amountMessage:string,
	currentOption:IOption,
	toAddress:string,
	domain:string,
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
		errorAddr:false,
		errorAmount:false,
		verifyPass:false,
		checkDisable:false,
		addrMessage:'',
		amountMessage:'',
		currentOption:{id:HASH_CONFIG.ID_GAS,name:'GAS'},
		toAddress:'',
		domain:'',
	}
	public options:IOption[]=[
		{id:HASH_CONFIG.ID_GAS,name:'GAS'},
		{id:HASH_CONFIG.ID_CGAS.toString(),name:'CGAS'},
		{id:HASH_CONFIG.ID_NEO,name:'NEO'},
		{id:HASH_CONFIG.ID_NNC.toString(),name:'NNC'}
	]
	public onSelect = (currentOption:IOption)=>{
		this.setState({
			currentOption
		},()=>{
			this.onAmountChange(this.state.amount)
		})
	}
	// 监控输入内容
	public onAddrChange = async(event) =>
	{
		let errorAddr=false;
		let addrMessage,toAddress,domain="";
		let address =event;
		this.setState({address})
		if(NNSTool.verifyDomain(event))
		{
			try {
				const addr = await NNSTool.resolveData(event)
				if(!addr)
				{
					errorAddr=true;
					addrMessage='该域名无映射地址'
				}else{
					errorAddr=false;
					addrMessage=toAddress=addr;
					domain = event;
				}
			} catch (error) {
				errorAddr=true;
				addrMessage='该域名无映射地址'
			}
		}
		else if(neotools.verifyAddress(event))
		{
			errorAddr=false;
			toAddress=event;
		}
		else
		{
			errorAddr=true;
			addrMessage='请输入正确格式的域名或地址'
		}
		this.setState({errorAddr,addrMessage,domain,toAddress},()=>{
			this.onVerify();
		})
	}

	public onVerify=()=>{
		this.setState({
			verifyPass:(!this.state.errorAddr)&&(!this.state.errorAmount)&&(!!this.state.amount)&&(!!this.state.address)
		})
	}

	// 监控输入内容
	public onAmountChange = (event) =>
	{
		const amount = asNumber(event,8);
		const balance = Neo.Fixed8.fromNumber(common.balance[this.state.currentOption.name])
		let checkDisable=false;
		let errorAmount = false;
		let amountMessage="";
		const compare = Neo.Fixed8.parse(amount).compareTo(balance)
		if(compare>0)
		{
			errorAmount=true;
			amountMessage="您的余额不足 "+this.state.currentOption.name+' '+balance.toString();
		}
		else if(compare==0)
		{
			errorAmount=false;
			amountMessage='';
			checkDisable=true;
		}
		this.setState({amount,errorAmount,amountMessage,checkDisable},()=>{
			this.onVerify()
		})
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
			show:false,
			infoShow:false,
			address:"",
			amount:"",
			asset:"",
			netfee:false,
			errorAddr:false,
			errorAmount:false,
			verifyPass:false,
			checkDisable:false,
			addrMessage:'',
			amountMessage:'',
			currentOption:{id:'GAS',name:'GAS'},
			toAddress:'',
			domain:'',
		})
		this.props.onHide?this.props.onHide():null;
	}
	public onCheck=(event:boolean)=>{
		this.setState({
			netfee:event
		})
	}
	public send=()=>
	{
		bg.transfer({
			"amount":this.state.amount,
			"asset":this.state.currentOption.id,
			"fromAddress":common.account.address,
			"toAddress":this.state.toAddress,
			"fee":this.state.netfee?"0.001":"0",
			"network":"TestNet"
		})
		.then(result=>{
			Toast("交易已发送！");
			console.log(result);
			this.onHide();
		})
		.catch(error=>{
			Toast("交易失败！","error");
			console.log(error);
			this.onHide();
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
							<div className="double">{common.account.walletName}</div>
							<div className="double address">{common.account.address}</div>
						</div>
					</div>
					<div className="info-line">
						<div className="title">发送</div>
						<div className="content">{this.state.amount}</div>
					</div>
					<div className="info-line">
						<div className="title">至</div>
						<div className="content">
						{this.state.domain?
						<>
							<div className="double">{this.state.domain}</div>
							<div className="double address">{this.state.toAddress}</div>
						</>:
							<div className="single address">{this.state.toAddress}</div>
						}
						</div>
					</div>
					<div className="info-line">
						<div className="title">手续费</div>
						<div className="content">{(this.state.netfee?'0.001':'0')+" "+this.state.currentOption.name}</div>
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
						<Select options={this.options} onCallback={this.onSelect} text="资产" />
					</div>
					<div className="line">
						<Input placeholder="发送至" value={this.state.address} onChange={this.onAddrChange} type="text" error={this.state.errorAddr} message={this.state.addrMessage} />		
					</div>
					<div className="line">
						<Input placeholder="发送数量" value={this.state.amount} onChange={this.onAmountChange} type="text" error={this.state.errorAmount} message={this.state.amountMessage} />		
					</div>
					<div className="line">
						<Checkbox text="优先确认交易（支付 0.001 GAS）" onClick={this.onCheck} disabled={this.state.checkDisable} />
					</div>
					<div className="btn-list">
						<div className="cancel">
							<Button type="warn" text="取消" onClick={this.onHide} />
						</div>
						<div className="confrim">
							<Button type="primary" disabled={!this.state.verifyPass} text="下一步" onClick={this.showInfo}/>
						</div>
					</div>
				</>
			}
			</Modal>
		);
	}
}