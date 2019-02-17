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
	address:string,
	amount:string
}

// @observer
export default class Transfer extends React.Component<IProps, IState> 
{
	constructor(props: IProps)
	{
		super(props);		
	}
	public state = {
		show:false,	
		address:"",
		amount:""
	}
	public options:IOption[]=[
		{id:'cgasexchange',name:'GAS'},
		{id:'gasexchange',name:'CGAS'},
		{id:'gasexchange',name:'NEO'}
	]
	// 监控输入内容
	public onAddrChange = (event) =>
	{
		this.setState({address:event})
	}
	// 监控输入内容
	public onAmountChange = (event) =>
	{
		this.setState({amount:event})
	}

	public render()
	{
		return (
			<Modal title="转账" show={this.props.show}>
				<div className="line">
					<Select options={this.options} text="资产" />
				</div>
				<div className="line">
					<Input placeholder="发送至" value={this.state.address} onChange={this.onAddrChange} type="text" />		
				</div>		
				<div className="line">
					<Input placeholder="发送数量" value={this.state.amount} onChange={this.onAmountChange} type="text" />		
				</div>		
				<div className="line">
					<Checkbox text="优先确认交易（支付 0.001 GAS）" />
				</div>
				<div className="btn-list">
					<div className="cancel">
						<Button type="warn" text="取消" />
					</div>
					<div className="confrim">
						<Button type="primary" text="下一步" />
					</div>
				</div>
			</Modal>
		);
	}
}