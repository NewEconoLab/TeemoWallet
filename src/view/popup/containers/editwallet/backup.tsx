/**
 * 按钮组件
 */
import * as React from 'react';
import { observer } from 'mobx-react';
import './index.less';
import Modal from '../../../components/Modal';
import intl from '../../store/intl';

interface IProps
{
	show: boolean,
	onHide?:()=>void
}

@observer
export default class BackUp extends React.Component<IProps, any>
{
	
	public onHide=()=>{
		this.props.onHide?this.props.onHide():null;
	}
	
	public render()
	{
		return (
			<Modal title={intl.message.editwallet.msg4} show={this.props.show}>
				<div className="backup-wrapper">
					<p className="first-p">{intl.message.editwallet.msg6}</p>
					<p>{intl.message.editwallet.msg6_2}</p>
					<p>{intl.message.editwallet.msg6_3}</p>
				</div>
				<div className="modal-close" onClick={this.onHide}>
					<img src={require("../../../image/close.png")} alt="" />
				</div>
			</Modal>
		);
	}
}