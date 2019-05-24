/**
 * 下拉组件
 */
import * as React from 'react';
// import { observer } from 'mobx-react';
import classnames from 'classnames';
import './index.less';
import EventHandler from '../../../utils/event';
import { IOption } from '../../../../components/Select';

interface IProps
{
	options:IOption[],
	placeholder?:string,
	defaultValue?:string | number,
	title?:string,
	message?:string,
	onCallback?: (event: IOption) => void
}

interface IState{
	option:IOption
	expand:boolean 
}


export default class AddrList extends React.Component<IProps, IState> {
	public state:IState = {
		// 选择的项
		option:{id: '', name: ''},
		expand: false,
	}
	public componentDidMount() {
		if(this.props.defaultValue) {
			this.setState({
				option:this.props.options.filter((item) => item.id === this.props.defaultValue)[0]
			}, () => {
				if(this.props.onCallback) {
					this.props.onCallback(this.state.option);
				}
			});
		}
		else if(this.props.options.length)
		{
			this.setState({
				option:this.props.options[0]
			},()=>{
				this.props.onCallback(this.state.option);
			})
		}
		else{
			// console.log(this.props.options);
			
		}

		// 注册全局点击事件，以便点击其他区域时，隐藏展开的内容
		EventHandler.add(this.globalClick);
	}

	// 选择选项
	public onSelect = (item:IOption) => {

		this.setState({ option: item, expand: false });

		if(this.props.onCallback) {
			this.props.onCallback(item);
		}
	}
	// 全局点击
	public globalClick = () => {
		this.setState({ expand: false });
	}
	// 展开
	public onExpand = (e) => {
		// 取反
		const expand = !this.state.expand;
	
		this.setState({
			expand: expand
		});
	
		e.stopPropagation();
	}
	public componentWillUnmount() {
		//  组件释放remove click处理
		EventHandler.remove(this.globalClick);
	}

	public render()
	{
		const list = classnames('wallet-list', {'disNone': !this.state.expand})
		const line = classnames('select-line',{'active':this.state.expand})
		return (
			
			<div className="select-group" onClick={this.onExpand}>
				<div className="select-title">
					<span> {this.props.title} </span>         
					<span className="triangle "></span>
					<div className={list}>
						<div className="list-content">
							{this.props.options.map(option=>{
								return (
									<div className="list-line" onClick={this.onSelect.bind(this,option)}>
										<div className="line-text">{option.name}</div>
									</div>
								)
							})}
						</div>
						<div className="wallet-list-wrapper">
							<div className="arrow" />
						</div>
					</div>
				</div>
				<div className={line}>
					
				</div>
				<div className="select-message">{this.props.message}</div>
			</div>
		);
	}
}