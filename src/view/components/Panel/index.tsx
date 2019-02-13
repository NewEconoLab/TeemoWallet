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
	// 监控输入内容
	public onClick = () =>
	{
		if (this.props.onClick)
		{
			this.props.onClick();
		}
	}

	public render()
	{
		return (
			<div className="panel">
				<div className="panel-heading">
					<div>
						<div className="icon">{this.props.children}</div>
						<div className="message">
							<div className="type">合约交互</div>
							<div className="time">1-1 10:09</div>
						</div>
					</div>
					<div className="asset">
						<span>-5 GAS</span>
						<span>等待确认</span>
					</div>
				</div>
				<div className="panel-body">
				</div>
			</div>
		);
	}
}