/**
 * 下拉组件
 */
import * as React from 'react';
// import { observer } from 'mobx-react';
import classnames from 'classnames';
import './index.less';
import EventHandler from '../../popup/utils/event';

export interface IOption {
	id: string | number,
	name: string,
	icon: any
}

interface IProps
{
	options:IOption[],
	placeholder?:string,
	defaultValue?:string | number,
	onCallback?: (event: IOption) => void
}

interface IState{
	option:IOption
	expand:boolean 
}


export default class Chooser extends React.Component<IProps, IState> {
	public state:IState = {
		// 选择的项
		option:{id: '', name: '', icon : undefined},
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
		// else if(!this.props.placeholder) {
		// 	this.setState({
		// 		option:this.props.options[0]
		// 	});
		// 	if(this.props.onCallback) {
		// 		this.props.onCallback(this.props.options[0]);
		// 	}
		// }

		// 注册全局点击事件，以便点击其他区域时，隐藏展开的内容
		EventHandler.add(this.globalClick);
	}

	// 选择选项
	public onSelect = (e:any,item:IOption) => {
		// console.log(e.nativeEvent);
		this.setState({ option: item, expand: false });

		if(this.props.onCallback) {
			this.props.onCallback(item);
		}
		e.nativeEvent.stopImmediatePropagation()
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
		const content = classnames('hint-content', {'disNone': !this.state.expand})
		return (
            <div className="hint-box">
                <div className="hint-msg">
					<div onClick={this.onExpand}>{this.props.children}</div>
                    <div className={content}>
						{this.props.options.map(option=>{
							return (
								<div className="hint-line" key={option.id} onClick={this.onSelect.bind(this,event, option)} >
									<div className="line-icon">
										<img src={option.icon} alt=""/>
									</div>
									<div className="line-text">
										{option.name}
									</div>
								</div>
							)
						})}

                        <div className="hint-wrapper">
                            <div className="arrow" />
                        </div>
                    </div>
                </div>
            </div>
		);
	}
}