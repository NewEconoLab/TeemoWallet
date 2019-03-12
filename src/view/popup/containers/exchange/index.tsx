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
import { InvokeArgs } from '../../../../common/entity';
import common from '../../store/common';
import { HASH_CONFIG } from '../../../config';
import { bg } from '../../utils/storagetools';

interface IProps
{
	show:boolean
	onHide?:()=>void;
}

interface IState
{
	show:boolean,
	amount:string,
	currentOption:IOption
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
		amount:'',
		currentOption:{id:'cgasexchange',name:'GAS换CGAS'}
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

	public onSelect=(event:IOption)=>
	{
		this.setState({currentOption:event})
	}

	public onHide=()=>{
		this.props.onHide?this.props.onHide():null;
	}

	public send=()=>{
		if(this.state.currentOption.id=="cgasexchange")
		{
			const invoke:InvokeArgs={
				"scriptHash":HASH_CONFIG.ID_CGAS.toString(),
				"operation":"mintTokens",
				"arguments":[],
				"attachedAssets":{[HASH_CONFIG.ID_GAS]:this.state.amount},
				"network":common.network,
				// "assetIntentOverrides":{
				// 	"inputs":[],
				// 	"outputs":[]
				// }
			}
			bg.contractBuilder(invoke)
			.then(result=>{
				result.txid;
			})
			.catch(error=>{

			})
		}
		else
		{}
	}

	public render()
	{
		return (
			<Modal title="CGAS兑换" show={this.props.show}>
				<div className="line">
					<Select onCallback={this.onSelect} options={this.options} text="操作类型" size="big" />
				</div>
				<div className="line">
					<Input placeholder="兑换数量" value={this.state.amount+""} onChange={this.onChange} type="text" />		
				</div>		
				<div className="line-checkbox">
					<Checkbox text="优先确认交易（支付 0.001 GAS）" />
				</div>
				<div className="btn-list">
					<div className="cancel">
						<Button type="warn" text="取消" onClick={this.onHide} />
					</div>
					<div className="confrim">
						<Button type="primary" text="确认" onClick={this.send} />
					</div>
				</div>
			</Modal>
		);
	}
}