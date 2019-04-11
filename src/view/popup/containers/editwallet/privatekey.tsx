/**
 * 按钮组件
 */
import * as React from 'react';
import { observer } from 'mobx-react';
import './index.less';
import Modal from '../../../components/Modal';
import common from '../../store/common';
import QrMakeCode from '../../utils/qrcode';
import Toast from '../../../components/Toast'
import Button from '../../../components/Button';

interface IProps
{
	show: boolean,
	onHide?: () => void
}

@observer
export default class PrivateKey extends React.Component<IProps, any>
{
	public state = {
		showStep: 0,
		copyPrivate:''
	}
	// 下一步
	public onGoNextStep = () =>
	{
		this.setState({
			showStep: 1
		})
	}

	public onHide = () =>
	{
		this.setState({
			showStep:0
		})
		this.props.onHide ? this.props.onHide() : null;
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
		Toast("复制成功");		
	  }
	public render()
	{
		return (
			<Modal title="显示私钥" show={this.props.show}>
				<div className="private-wrapper">
					<div className="red-tips">请不要将私钥展示给任何人拥有私钥的人可以拿走钱包里的一切</div>
					{
						this.state.showStep === 0 && (
							<div className="step-box">
								<div className="input-wrap">
									<input type="text" className="private-input" placeholder="输入密码以继续 " />
								</div>
								<div className="step-btn">
									<Button type="warn" text="取消" onClick={this.onHide} />
									<Button type="primary" text="下一步" onClick={this.onGoNextStep} />
								</div>
							</div>
						)
					}
					{
						this.state.showStep === 1 && (
							<div className="step-box">
								<div className="private-text" onClick={this.onCopyPrivate}>
									a939367dbbfd2b45dca5102769585e67137f6babbdb841d20d59c069d3278d97
								</div>
								<p className="copy-tips">（点击私钥直接复制）</p>
							</div>
						)
					}
				</div>
				<div className="modal-close" onClick={this.onHide}>
					<img src={require("../../../image/close.png")} alt="" />
				</div>
			</Modal>
		);
	}
}