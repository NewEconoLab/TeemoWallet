/**
 * 交易记录组件
 */
import * as React from 'react';
import './index.less';
import Panel from '../../../components/Panel';
import Select, { IOption } from '../../../components/Select';
// @observer
export default class History extends React.Component<any, {}> 
{
	constructor(props: any)
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
    public options:IOption[]=
    [
        {id:"all",name:"全部"},
        {id:"gas",name:"GAS"},
        {id:"cgas",name:"CGAS"},
        {id:"neo",name:"NEO"},
    ]
    onSelectModule = (call:IOption)=>
    {
        this.setState({currentOption:call})
    }

	public render()
	{
		return (
            <div className="transactionlist">
                <div className="waitlist">
                    <div className="title">排队中</div>
                    <Panel type="contract" time={11222} wait={true} message="" title="个人转账" ></Panel>
                </div>
                <div className="history">
                    <div className="title">交易历史</div>
                    <Select text="" options={this.options} onCallback={this.onSelectModule}/>
                    <Panel type="contract" time={11222} wait={true} message="" title="个人转账" ></Panel>
                </div>
            </div>
		);
	}
}
