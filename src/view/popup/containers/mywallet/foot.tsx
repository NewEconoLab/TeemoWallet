// 输入框组件
import * as React from 'react';
import Select, { IOption } from '../../../components/Select';
import common from '../../store/common';
import { bg } from '../../utils/storagetools';
import { NetWork } from '../../store/interface/common.interface';
import { observer } from 'mobx-react';
import intl from '../../store/intl';

@observer
export default class WalletFoot extends React.Component<any, {}> {
	constructor(props: any) {
		super(props);
	}

	public state={currentNetWork:undefined}

	componentDidMount(){
		common.initNetWork();
		if(common.network==NetWork.TestNet)
			this.setState({currentNetWork:{id:NetWork.TestNet,name:intl.message.mywallet.testnet}})
		else
			this.setState({currentNetWork:{id:NetWork.MainNet,name:intl.message.mywallet.mainnet}})
	}
	
	public onSelect=(option:IOption)=>{
		let network = option.id as NetWork;		
		common.changeNetWork(network);
		if(network==NetWork.TestNet)
			this.setState({currentNetWork:{id:NetWork.TestNet,name:intl.message.mywallet.testnet}})
		else
			this.setState({currentNetWork:{id:NetWork.MainNet,name:intl.message.mywallet.mainnet}})
	}

    public options:IOption[]=
    [
        {id:NetWork.MainNet,name:intl.message.mywallet.mainnet},
        {id:NetWork.TestNet,name:intl.message.mywallet.testnet},
    ]

	public render() {
		return (
			<div className="foot">
				<div className="content">
					<Select currentOption={this.state.currentNetWork} options={this.options} onCallback={this.onSelect} text={intl.message.mywallet.currentnet} up={true} />
				</div>
			</div>
		);
	}
}