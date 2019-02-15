/**
 * 按钮组件
 */
import * as React from 'react';
// import { observer } from 'mobx-react';
import './index.less';

interface IProps
{
	onClick?: () => void;
    active?:boolean;
	disabled?: boolean; // 按钮是否禁止点击
	type: 'contract'|'transfer';
	time:number;
	title:string;
	wait:boolean;
	message:string;
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
							<div className="type">{this.props.type==="contract"?"合约交互":"个人转账"}</div>
							<div className="time">1-1 10:09</div>
						</div>
					</div>
					<div className="asset">
						<div className="output">-5 GAS</div>
						<div className="wait">等待确认</div>
					</div>
				</div>
				{
					this.state.open?					
					<div className="panel-body" >
						<div className="group txid">
							<div className="title">TXID</div>
							<div className="value">5380...2927</div>
						</div>
						<div className="transaction-info">
							<div className="transaction-title">转账</div>
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