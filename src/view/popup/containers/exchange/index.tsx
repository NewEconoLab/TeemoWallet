/**
 * 按钮组件
 */
import * as React from 'react';
// import { observer } from 'mobx-react';
import './index.less';
import Modal from '../../../components/Modal';
import Select, { IOption } from '../../../components/Select';
import Input from '../../../components/Input';
import Checkbox from '../../../components/Checkbox';
import Button from '../../../components/Button';

interface IProps
{
	show:boolean
}

interface IState
{
	show:boolean,
	amount:string
}

// @observer
export default class Exchange extends React.Component<IProps, IState> 
{
	constructor(props: IProps)
	{
		super(props);		
	}
	public state = {
		show:false,
		amount:''		
	}
	public options:IOption[]=[
		{id:'cgasexchange',name:'GAS换CGAS'},
		{id:'gasexchange',name:'CGAS换GAS'}
	]
	// 监控输入内容
	public onChange = (event) =>
	{
		this.setState({
			amount:event
		})
	}

	public render()
	{
		return (
			<Modal title="CGAS兑换" show={this.props.show}>
				<div className="line">
					<Select options={this.options} text="操作类型" />
				</div>
				<div className="line">
					<Input placeholder="兑换数量" value={this.state.amount+""} onChange={this.onChange} type="text" />		
				</div>		
				<div className="line">
					<Checkbox text="隐藏0GAS" />
				</div>
				<div className="btn-list">
					<div className="cancel">
						<Button type="warn" text="取消" />
					</div>
					<div className="confrim">
						<Button type="primary" text="确认" />
					</div>
				</div>
			</Modal>
		);
	}
}