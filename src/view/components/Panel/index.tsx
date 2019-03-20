/**
 * 动态面板
 */
import * as React from 'react';
// import { observer } from 'mobx-react';
import './index.less';
import { Task, TaskState, ConfirmType } from '../../popup/containers/history';
import { Storage_local } from '../../../common/util';
import { SendArgs } from '../../../lib/background';
import { ICON } from '../../image';
import { format } from '../../popup/utils/formatTime';
import { HASH_CONFIG } from '../../config';

interface IProps
{
	onClick?: () => void;
    active?:boolean;
	disabled?: boolean; // 按钮是否禁止点击
	task:Task;
}
interface IState
{
	open:boolean,
	tranMessage:SendArgs,
	invokeMessage:InvokeHistory,
	dappMessage:{title:string,icon:string}
}

interface InvokeHistory
{
    domain: string;
    scriptHashs: string[];
    descripts: string[];
    expenses: {assetid:string,symbol:string,amount:string}[];
    netfee: string;
}

// @observer
export default class Panel extends React.Component<IProps, IState> 
{
	constructor(props: IProps)
	{
		super(props);		
	}
	public state:IState = {
		open:false,
		tranMessage:null,
		invokeMessage:null,
		dappMessage:{title:'',icon:''}
	}
	// 监控输入内容
	public onClick = () =>
	{
		this.setState({
			open:!this.state.open
		})
		if (this.props.onClick)
		{
			this.props.onClick();
		}
	}

	componentDidMount()
	{
		if(this.props.task.type == ConfirmType.tranfer)
		{
			Storage_local.get('send-data')
			.then(data =>{
				if(data)
				{
					const message = data[this.props.task.txid];
					this.setState({
						tranMessage:message
					})
				}
			});
		}
		else
		{
			Storage_local.get('invoke-data')
			.then(invokes=>{
				if(invokes)
				{
					console.log(invokes);
					
					this.setState({
						invokeMessage:invokes[this.props.task.txid]
					},()=>{
						Storage_local.get('white_list')
						.then(result=>{
							this.setState({ dappMessage:result[this.state.invokeMessage.domain]},()=>{
								console.log("invoke 数据初始化完成");
								
								console.log(this.state.dappMessage);
							})
						})
					})

				}
			})
		}
	}

	public getAssetSymbol(assetId:string){
		switch (assetId) {
			case HASH_CONFIG.ID_GAS:
				return "GAS"
			case HASH_CONFIG.ID_NEO:
				return "NEO"
			case HASH_CONFIG.ID_CGAS.toString():
				return "CGAS"
			case HASH_CONFIG.ID_NNC.toString():
				return "NNC"
			case HASH_CONFIG.ID_CNEO.toString():
				return "CNEO"
			default:
				return assetId.substr(0,4)+'...'+assetId.substr(assetId.length-3,4);
		}
	}

	public getIconForDomain()
	{

	}

	public render()
	{
		return (
			<div className="panel">
				<div className="panel-heading" onClick={this.onClick}>
				{this.props.task.type == ConfirmType.tranfer?
					<div className="transfer-type">
						<div className="icon"><img src={ICON.output}/></div>
						<div className="message">
							<div className="type">个人转账</div>
							<div className="time">{format("MM-dd hh:mm:ss",this.props.task.startTime.toString(),'cn')}</div>
						</div>
					</div>:
					<div className="transfer-type">
						<div className="icon"><img src={this.state.dappMessage.icon}/></div>
						<div className="message">
							<div className="type">合约交互</div>
							<div className="time">{format("MM-dd hh:mm:ss",this.props.task.startTime.toString(),'cn')}</div>
						</div>
					</div>
				}
				{
					this.state.tranMessage!=null&&					
					<div className="asset">
						<div className="output">- {this.state.tranMessage.amount} {this.getAssetSymbol(this.state.tranMessage.asset)}</div>
						{
							(this.props.task.state==TaskState.watting||this.props.task.state==TaskState.watForLast) &&
							<div className="wait">等待确认</div>
						}
					</div>
				}
				{
					this.state.invokeMessage!=null&&					
					<div className="asset">
						<div className="output">
						{
							this.state.invokeMessage.expenses&&this.state.invokeMessage.expenses.length>0&&
							`-${this.state.invokeMessage.expenses[0].amount} ${this.state.invokeMessage.expenses[0].symbol}${this.state.invokeMessage.expenses.length>1?',...':''}`
						}
						</div>
						{
							(this.props.task.state==TaskState.watting||this.props.task.state==TaskState.watForLast) &&
							<div className="wait">等待确认</div>
						}
					</div>
				}
				</div>
				{
					this.state.open && 
					<div className="panel-body" >
						<div className="group txid">
							<div className="title">TXID</div>
							<div className="value">{this.props.task.txid.substr(0,4)+'...'+this.props.task.txid.substr(this.props.task.txid.length-3,4)}</div>
						</div>
					{this.props.task.type==ConfirmType.tranfer?
					<>
						<div className="transaction-info">
							<div className="transaction-title">转账</div>
							<div className="group send">
								<div className="title">发往</div>
								<div className="value">{this.state.tranMessage.toAddress.substr(0,4)+"..."+this.state.tranMessage.toAddress.substr(31,4)}</div>
							</div>
							<div className="group expense">
								<div className="title">花费</div>
								<div className="value">{this.state.tranMessage.amount} {this.getAssetSymbol(this.state.tranMessage.asset)}</div>
							</div>
							<div className="group netfee">
								<div className="title">手续费</div>
								<div className="value">{this.state.tranMessage.fee} GAS</div>
							</div>
						</div>
					</>:
					<>
						<div className="transaction-info">
							<div className="transaction-title">{this.state.dappMessage.title}</div>
							<div className="send">
								<div className="group">
									<div className="title">合约hash</div>
									<div className="value">{this.state.invokeMessage.scriptHashs.map(hash=>(hash.substr(0,4)+"..."+hash.substr(hash.length-3,4))).join(',')}</div>
								</div>
								<div className="group">
									<div className="title">备注</div>
									<div className="value">{this.state.invokeMessage.descripts?this.state.invokeMessage.descripts:""}</div>
								</div>
							</div>
							<div className="group expense">
								<div className="title">花费</div>
								<div className="value">
								{this.state.invokeMessage.expenses.map((val,key)=>{
									return val.amount+' '+val.symbol;
								}).join(',')}
								</div>
							</div>
							<div className="group netfee">
								<div className="title">手续费</div>
								<div className="value">{this.state.invokeMessage.netfee} GAS</div>
							</div>
						</div>
					</>
					}
					</div>
				}
			</div>
		);
	}
}