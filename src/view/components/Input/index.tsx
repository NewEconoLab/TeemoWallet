// 输入框组件
import * as React from 'react';
// import { observer } from 'mobx-react';
import classnames from 'classnames';
import './index.less';

interface IProps {
	placeholder: string,
	status?: string,
    error?:boolean,
	message?: string,
	value: string,
	onChange: (event: any) => void,
	onFocus?: () => void,
	style?: object,
	readonly?: boolean,
	type: string,
    onBlur?: (event: any) => void,
	topsearch?: boolean,
	onEnter?: () => void,
	onClickMax?: () => void,
	maxlength?: number,
}

// @observer
export default class Input extends React.Component<IProps, {}> {
	constructor(props: IProps) {
		super(props);
    }
    public state={
        title:false
    }
	// 监控输入内容
	public onInputChange = (event: any) => {
		if (this.props.onChange) {
			this.props.onChange(event.target.value);
		}
	}
	// 监控焦点
	public onInputBlur = (event: any) => {
        this.setState({title:false})
		if (this.props.onBlur) {
			this.props.onBlur(event.target.value);
		}
	}
	// 失去焦点事件
	public onFocus = () => {
        this.setState({title:true})
		if (this.props.onFocus) {
			this.props.onFocus();
		}
	}
	// 回车事件
	public onKeyDown = (event: any) => {
		if (event.keyCode === 13) {
			if (this.props.onEnter) {
				this.props.onEnter();
			}
		}
	}
	// 获取最大值
	public onClickMax = () => {
		if (this.props.onClickMax) {
			this.props.onClickMax();
		}
	}
	public render() {
        const inputClassName = classnames('input-line', { 'top-search': this.props.topsearch ? this.props.topsearch : false },{'active':this.props.value?true:false});
		return (
			<div className="input-group">
                {
                    <div className="input-title">{(this.state.title||this.props.value)?this.props.placeholder:""}</div>
                }
				<input
					className={inputClassName}
					value={this.props.value}
					type={this.props.type}
					placeholder={this.state.title?"":this.props.placeholder}
					onChange={this.onInputChange}
					style={this.props.style}
					readOnly={this.props.readonly}
					onBlur={this.onInputBlur}
					onFocus={this.onFocus}
					onKeyDown={this.onKeyDown}
					maxLength={this.props.maxlength}
				/>
                <div className="message">
                </div>
			</div>
		);
	}
}