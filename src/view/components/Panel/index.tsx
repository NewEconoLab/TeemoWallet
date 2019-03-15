/**
 * 按钮组件
 */
import * as React from 'react';
// import { observer } from 'mobx-react';
import './index.less';
import { Task, TaskState, ConfirmType } from '../../popup/containers/history';

interface IProps
{
	onClick?: () => void;
    active?:boolean;
	disabled?: boolean; // 按钮是否禁止点击
	task:Task;
}

// @observer
export default class Panel extends React.Component<IProps, {}> 
{
	constructor(props: IProps)
	{
		super(props);		
	}
	public state = {
		open:false
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

	public render()
	{
		return (
			<div className="panel">
				<div className="panel-heading" onClick={this.onClick}>
					<div className="transfer-type">
						<div className="icon">{this.props.children}</div>
						<div className="message">
							<div className="type">{this.props.task.type===ConfirmType.contract?"合约交互":"个人转账"}</div>
							<div className="time">{this.props.task.startTime}</div>
						</div>
					</div>
					<div className="asset">
						<div className="output">- {this.props.task.expenses}</div>
						{
							((this.props.task.state===TaskState.watting)||(this.props.task.state===TaskState.watForLast))?
							<div className="wait">等待确认</div>
							:<></>
						}
					</div>
				</div>
				{
					this.state.open?					
					<div className="panel-body" >
						<div className="group txid">
							<div className="title">TXID</div>
							<div className="value">{this.props.task.txid}</div>
						</div>
						<div className="transaction-info">
							<div className="transaction-title">{this.props.task.confirm==ConfirmType.tranfer?'转账':'合约'}</div>
							<div className="group send">
								<div className="title">发往</div>
								<div className="value">AeMy...oWu3</div>
							</div>
							<div className="group expense">
								<div className="title">花费</div>
								<div className="value">5 GAS</div>
							</div>
							<div className="group netfee">
								<div className="title">手续费</div>
								<div className="value">0 GAS</div>
							</div>
						</div>
					</div>:<></>
				}
			</div>
		);
	}
}