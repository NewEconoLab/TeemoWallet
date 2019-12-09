/**
 * 按钮组件
 */
import * as React from 'react';
// import { observer } from 'mobx-react';
import './index.less';
import classnames from 'classnames';

interface IProps {
	onClick?: () => void,
	style?: object,
	disabled?: boolean, // 按钮是否禁止点击
	text: string,
	type?: 'primary' | 'warn' | 'disable-btn' | 'remind' | 'white', // 按钮样式
	size?: 'normal' | 'large' | 'long' | 'small' | 'small-big';
}

// @observer
export default class Button extends React.Component<IProps, {}>
{
	constructor(props: IProps) {
		super(props);
	}
	// 监控输入内容
	public onClick = () => {
		if (!this.props.disabled && this.props.onClick) {
			this.props.onClick();
		}
	}

	public render() {
		const btnClassName = classnames('primary', this.props.type ? this.props.type : '', this.props.size ? this.props.size : 'normal', { "disable-btn": this.props.disabled });
		// const type = this.props.type?this.props.type:'primary';
		// const size = this.props.size?this.props.size:'normal'
		// const name = [type,size,this.props.disabled?'disable':''].join(" ");

		return (
			<div
				className={btnClassName}
				onClick={this.onClick}
				style={this.props.style}
			>
				{this.props.text}
			</div>
		);
	}
}
