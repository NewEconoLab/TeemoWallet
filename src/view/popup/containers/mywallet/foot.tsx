// 输入框组件
import * as React from 'react';
import Select, { IOption } from '../../../components/Select';

// @observer
export default class Input extends React.Component<any, {}> {
	constructor(props: any) {
		super(props);
    }

    public options:IOption[]=
    [
        {id:"main",name:"主网"},
        {id:"test",name:"测试网"},
    ]

	public render() {
		return (
			<div className="foot">
				<div className="content">
					<Select options={this.options} text='当前网络' up={true} />
				</div>
			</div>
		);
	}
}