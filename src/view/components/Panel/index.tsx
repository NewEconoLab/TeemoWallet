/**
 * 动态面板
 */
import * as React from 'react';
// import { observer } from 'mobx-react';
import './index.less';
import { Task, TaskState, ConfirmType, IHistory } from '../../popup/containers/history/store/interface/history.interface';
import { Storage_local } from '../../../common/util';
import { SendArgs } from '../../../lib/background';
import { ICON } from '../../image';
import { format } from '../../popup/utils/formatTime';
import { HASH_CONFIG } from '../../config';
import common from '../../popup/store/common';
import { NetWork } from '../../popup/store/interface/common.interface';

interface IProps
{
	onClick?: () => void;
    active?:boolean;
	disabled?: boolean; // 按钮是否禁止点击
	task:IHistory;
}
interface IState
{
	open:boolean,
	tranMessage:SendArgs,
	dappMessage:{title:string,icon:string}
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
		let type=''
		if(this.props.task.sendHistory)
		{type=this.props.task.sendHistory.fromAddress!==common.account.address && this.props.task.sendHistory.toAddress==common.account.address?'input':'output'}
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
						<div className="icon"><img src={this.props.task.invokeHistory.domain=="TeemoWallet.exchange"?ICON.exchange:this.props.task.dappMessage.icon}/></div>
						<div className="message">
							<div className="type">合约交互</div>
							<div className="time">{format("MM-dd hh:mm:ss",this.props.task.startTime.toString(),'cn')}</div>
						</div>
					</div>
				}
				{
					this.props.task.sendHistory!=null&&					
					<div className="asset">
						{type=='input'? 
						<div className="input">+ {this.props.task.sendHistory.amount} {this.props.task.sendHistory.symbol}</div>
						:
						<div className="output">- {this.props.task.sendHistory.amount} {this.props.task.sendHistory.symbol}</div>
						}
						{
							(this.props.task.state==TaskState.watting||this.props.task.state==TaskState.watForLast) &&
							<div className="wait">等待确认</div>
						}
						{
							this.props.task.state==TaskState.fail&&
							<div className="fail">交易失败</div>
						}
					</div>
				}
				{
					this.props.task.invokeHistory && this.props.task.invokeHistory.expenses!=null&&					
					<div className="asset">
						<div className="output">
						{
							this.props.task.invokeHistory.expenses.length>0&&
							`-${this.props.task.invokeHistory.expenses[0].amount} ${this.props.task.invokeHistory.expenses[0].symbol}${this.props.task.invokeHistory.expenses.length>1?',...':''}`
						}
						</div>
						{
							(this.props.task.state==TaskState.watting||this.props.task.state==TaskState.watForLast) &&
							<div className="wait">等待确认</div>
						}
						{
							this.props.task.state==TaskState.fail&&
							<div className="fail">交易失败</div>
						}
					</div>
				}
				</div>
				{
					this.state.open && 
					<div className="panel-body" >
						<div className="group txid">
							<div className="title">TXID</div>
							<div className="value">
								<a href={'https://scan.nel.group'+(common.network==NetWork.TestNet?'/test':'')+'/transaction/'+this.props.task.txid}
								target="_blank"
								>
								{this.props.task.txid.substr(0,4)+'...'+this.props.task.txid.substr(this.props.task.txid.length-3,4)}
								</a>
							</div>
						</div>
					{this.props.task.type==ConfirmType.tranfer?
					<>
						<div className="transaction-info">
							<div className="transaction-title">{type=='input' ?'收款': '转账'}</div>
							{this.props.task.sendHistory.remark&&
								<div className="group">
									<div className="title">备注</div>
									<div className="value">{this.props.task.sendHistory.remark}</div>
								</div>
							}
							<div className="group send">
								<div className="title">{type=='input' ?'来自': '发往'}</div>
								<div className="value">{type=='input'?this.props.task.sendHistory.fromAddress.substr(0,4)+"..."+this.props.task.sendHistory.fromAddress.substr(31,4) :this.props.task.sendHistory.toAddress.substr(0,4)+"..."+this.props.task.sendHistory.toAddress.substr(31,4)}</div>
							</div>
							<div className="group expense">
								<div className="title">
									{this.props.task.sendHistory.fromAddress!==common.account.address && 
										this.props.task.sendHistory.toAddress==common.account.address && '收款'}
									{this.props.task.sendHistory.fromAddress==common.account.address && '花费'}
								</div>
								<div className="value">{this.props.task.sendHistory.amount} {this.props.task.sendHistory.symbol}</div>
							</div>
							<div className="group netfee">
								<div className="title">手续费</div>
								<div className="value">{this.props.task.sendHistory.fee} GAS</div>
							</div>
						</div>
					</>:
					<>
						<div className="transaction-info">
							<div className="transaction-title">{this.props.task.dappMessage.title}</div>
							<div className="send">
								<div className="group">
									<div className="title">合约hash</div>
									<div className="value">{this.props.task.invokeHistory.scriptHashs.map(hash=>(hash.substr(0,4)+"..."+hash.substr(hash.length-3,4))).join(',')}</div>
								</div>
								<div className="group">
									<div className="title">备注</div>
									<div className="value">{this.props.task.invokeHistory.descripts?this.props.task.invokeHistory.descripts:""}</div>
								</div>
							</div>
							<div className="group expense">
								<div className="title">花费</div>
								<div className="value">
								{this.props.task.invokeHistory.expenses.map((val,key)=>{
									return val.amount+' '+val.symbol;
								}).join(',')}
								</div>
							</div>
							<div className="group netfee">
								<div className="title">手续费</div>
								<div className="value">{this.props.task.invokeHistory.netfee} GAS</div>
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