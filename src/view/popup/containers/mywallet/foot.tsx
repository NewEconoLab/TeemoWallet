// 输入框组件
import * as React from 'react';
import Select, { IOption } from '../../../components/Select';
import common from '../../store/common';

// @observer
export default class WalletFoot extends React.Component<any, {}> {
	constructor(props: any) {
		super(props);
	}
	
	public onSelect=(option:IOption)=>{
		common.network=option.id
	}

    public options:IOption[]=
    [
        {id:"mainnet",name:"主网"},
        {id:"testnet",name:"测试网"},
    ]

	public render() {
		return (
			<div className="foot">
				<div className="content">
					<Select defaultValue={common.network} options={this.options} text='当前网络' up={true} />
				</div>
			</div>
		);
	}
}