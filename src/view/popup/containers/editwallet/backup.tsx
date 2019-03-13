/**
 * 按钮组件
 */
import * as React from 'react';
import { observer } from 'mobx-react';
import './index.less';
import Modal from '../../../components/Modal';

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
			<Modal title="Nep6备份文件" show={this.props.show}>
				<div className="backup-wrapper">
					<p className="first-p">NEP6备份文件已下载</p>
					<p>请妥善保存并牢记密码</p>
					<p>恢复钱包时将会要求密码</p>
				</div>
				<div className="modal-close" onClick={this.onHide}>
					<img src={require("../../../image/close.png")} alt="" />
				</div>
			</Modal>
		);
	}
}