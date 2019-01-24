/**
 * 按钮组件
 */
import * as React from 'react';
// import { observer } from 'mobx-react';
import './index.less';

interface IProps
{
	onClick?: () => void,
    active?:boolean,
	disabled?: boolean, // 按钮是否禁止点击
    text: string,
    style?:object
}

// @observer
export default class Label extends React.Component<IProps, {}> 
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
            <div 
                className={'label'+(this.props.active?'active':'')}
				onClick={this.onClick}
				style={this.props.style}
            >
				{this.props.text}
			</div>
		);
	}
}
