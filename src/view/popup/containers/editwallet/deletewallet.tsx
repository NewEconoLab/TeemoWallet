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
	// show: boolean,
	// onHide?:()=>void
}

@observer
export default class DeleteWallet extends React.Component<IProps, any>
{
	public state = {
		showDeleteStep: 0,
	}
	// 下一步
	public onGoNextStep = () =>
	{
		this.setState({
			showDeleteStep: 1
		})
	}
	public onDeleteWallet = () =>{
		this.onHide();
	}
	public onHide=()=>{
		this.setState({
			showDeleteStep:0
		})
		// this.props.onHide?this.props.onHide():null;
	}
	
	public render()
	{
		return (
			<div className="twice-dialog">
				<div className="delete-wrapper">
					{
						this.state.showDeleteStep === 0 && (
							<div className="step-box">
								<p className="normal-tips">删除钱包会清除本钱包的全部信息此操作不可逆</p>								
								<p className="normal-tips red-tips">恢复帐户需要私钥或备份文件和密码请确保你已经进行了备份</p>
								<p className="normal-tips last-tips">确认删除本钱包？</p>
								<div className="step-btn">
									<Button type="warn" text="取消" onClick={this.onHide} />
									<Button type="primary" text="确定" onClick={this.onGoNextStep} />
								</div>
							</div>
						)
					}
					{
						this.state.showDeleteStep === 1 && (
							<div className="step-box">
								<div className="input-wrap">
									<input type="text" className="delete-input" placeholder="输入你要删除的钱包名称以确认" />
								</div>
								<div className="input-wrap last-input">
									<input type="password" className="delete-input" placeholder="输入钱包密码" />
								</div>
								<div className="step-btn step2-btn">
									<Button type="warn" text="取消" onClick={this.onHide} />
									<Button type="primary" text="确定" onClick={this.onGoNextStep} />
								</div>
							</div>
						)
					}					
				</div>
				<div className="modal-close" onClick={this.onHide}>
					<img src={require("../../../image/close.png")} alt="" />
				</div>
			</div>
		);
	}
}