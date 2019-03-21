// 输入框组件
import * as React from 'react';
import Select, { IOption } from '../../../components/Select';
import common from '../../store/common';
import { bg } from '../../utils/storagetools';
import { NetWork } from '../../store/interface/common.interface';
import { observer } from 'mobx-react';

@observer
export default class WalletFoot extends React.Component<any, {}> {
	constructor(props: any) {
		super(props);
	}

	public state={currentNetWork:undefined}

	componentDidMount(){
		common.initNetWork();
		if(common.network==NetWork.TestNet)
			this.setState({currentNetWork:{id:NetWork.TestNet,name:"测试网"}})
		else
			this.setState({currentNetWork:{id:NetWork.MainNet,name:"主网"}})
	}
	
	public onSelect=(option:IOption)=>{
		let network = option.id as NetWork;		
		common.changeNetWork(network);
		if(network==NetWork.TestNet)
			this.setState({currentNetWork:{id:NetWork.TestNet,name:"测试网"}})
		else
			this.setState({currentNetWork:{id:NetWork.MainNet,name:"主网"}})
	}

    public options:IOption[]=
    [
        {id:NetWork.MainNet,name:"主网"},
        {id:NetWork.TestNet,name:"测试网"},
    ]

	public render() {
		return (
			<div className="foot">
				<div className="content">
					<Select currentOption={this.state.currentNetWork} options={this.options} onCallback={this.onSelect} text='当前网络' up={true} />
				</div>
			</div>
		);
	}
}