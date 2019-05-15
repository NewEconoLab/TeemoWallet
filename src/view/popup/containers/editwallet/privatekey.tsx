/**
 * 按钮组件
 */
import * as React from 'react';
import { observer } from 'mobx-react';
import './index.less';
import common from '../../store/common';
import Toast from '../../../components/Toast'
import Button from '../../../components/Button';
import { bg } from '../../utils/storagetools';
import intl from '../../store/intl';

interface IProps
{
	onClose?: () => void
}

@observer
export default class PrivateKey extends React.Component<IProps, any>
{
	public state = {
		showStep: 0,
		copyPrivate:'',
		password:''
	}
	// 下一步
	public onGoNextStep = () =>
	{
		bg.AccountManager.getWifByDeciphering(common.account.address,this.state.password)
		.then(result=>{
			this.setState({
				showStep: 1,
				copyPrivate:result,
				password:''
			})
		})
		.catch(error=>{
			Toast(intl.message.login.error,'error');
			this.setState({
				password:'',
				copyPrivate:''
			})
		})
	}

	public onPasswordChange =(event:any)=>{
		this.setState({
			password:event.target.value
		})
	}

	public onClose = () =>
	{
		this.setState({
			showStep:0
		})
		this.props.onClose ? this.props.onClose() : null;
	}
	// 复制nep2
	public onCopyPrivate = () => {		
		const oInput = document.createElement('input');
		oInput.value = this.state.copyPrivate;
		document.body.appendChild(oInput);
		oInput.select(); // 选择对象
		document.execCommand("Copy"); // 执行浏览器复制命令
		oInput.className = 'oInput';
		oInput.style.display = 'none';
		Toast(intl.message.toast.copySuccess);		
        oInput.remove();
	  }
	public render()
	{
		return (
			<div className="twice-dialog">
				<div className="private-wrapper">
					<div className="red-tips">{intl.message.editwallet.msg9}</div>
					{
						this.state.showStep === 0 && (
							<div className="step-box">
								<div className="input-wrap">
									<input type="password" className="private-input" placeholder={intl.message.editwallet.msg10} value={this.state.password} onChange={this.onPasswordChange} />
								</div>
								<div className="step-btn">
									<Button type="warn" text={intl.message.button.cancel} onClick={this.onClose} />
									<Button type="primary" text={intl.message.button.next} onClick={this.onGoNextStep} />
								</div>
							</div>
						)
					}
					{
						this.state.showStep === 1 && (
							<div className="step-box">
								<div className="private-text" onClick={this.onCopyPrivate}>
									{this.state.copyPrivate}
								</div>
								<p className="copy-tips">（{intl.message.editwallet.msg3}）</p>
							</div>
						)
					}
				</div>
				{/* <div className="modal-close" onClick={this.onClose}>
					<img src={require("../../../image/close.png")} alt="" />
				</div> */}
			</div>
		);
	}
}