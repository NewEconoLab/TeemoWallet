/**
 * 按钮组件
 */
import * as React from 'react';
// import { observer } from 'mobx-react';
import './index.less';
import classnames = require('classnames');

interface IProps
{
	onClick?: () => void;
	title:string;
	show?:boolean;
}

// @observer
export default class Modal extends React.Component<IProps, {}> 
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
		const wrap =  classnames('modal-wrap',{"show":this.props.show})
		return (
			<div className={wrap}>
				<div className="modal-content">				
					<div className="modal-heading" >
						<div className="title">{this.props.title}</div>
					</div>		
					<div className="modal-body" >
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}