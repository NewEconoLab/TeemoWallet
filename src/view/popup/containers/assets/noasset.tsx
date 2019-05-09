/**
 * 按钮组件
 */
import * as React from 'react';
import { observer } from 'mobx-react';
import './index.less';
import Modal from '../../../components/Modal';
import intl from '../../store/intl';
import Button from '../../../components/Button';

interface IProps
{
	show: boolean,
	onHide?:()=>void
}

@observer
export default class NoAsset extends React.Component<IProps, any>
{
	
	public onHide=()=>{
		this.props.onHide?this.props.onHide():null;
	}
	
	public render()
	{
		return (
			<Modal title="" show={this.props.show}>
				<div className="alert-wrapper">
					<p className="first-p">请先添加代币！</p>
                    <Button type="primary" size="small-big" text="确定" onClick={this.onHide} />
				</div>
				<div className="modal-close" onClick={this.onHide}>
					<img src={require("../../../image/close.png")} alt="" />
				</div>
			</Modal>
		);
	}
}