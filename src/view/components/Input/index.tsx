// 输入框组件
import * as React from 'react';
// import { observer } from 'mobx-react';
import classnames from 'classnames';
import './index.less';
import { ICON } from '../../image';

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
	type: 'text'|'password'|'file'|'hidden'|'select',	//当前组件主要就支持这几种类型
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

	public fileClick = () =>
	{
		document.getElementById('file-input').click();
	}

	// 文件更改触发事件
	public fileChange = (event: any) =>
	{
		// 判断是否有onChange方法 && 是否有files对象 && files对象是否有文件流
		if (this.props.onChange && event.target.files && event.target.files.length) 
		{
			this.props.onChange(event.target.files[0]);
		}
	}

	public render() {
		const inputClassName = classnames('input-line', { 'file': this.props.type==="file" ? true : false },{'active':this.props.value?true:false},{'error':this.props.error});
		const inputMessage = classnames('input-message',{'error':this.props.error})
		return (
			<div className="input-group">
				<div className="input-title">{(this.state.title||this.props.value)?this.props.placeholder:""}</div>
				{
					this.props.type==="file"?
					<div className={inputClassName} onClick={this.fileClick}>
						{this.props.value?this.props.value:this.props.placeholder}
						<input type="file" id="file-input" onChange={this.fileChange} />
					</div>:
					(
						this.props.type==="select"?
						<div></div>:
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
					)
				}
                <div className={inputMessage}>
					{this.props.error?
					<img src={ICON.attention} alt=""/> :<></>
					}
					{this.props.message}
                </div>
			</div>
		);
	}
}