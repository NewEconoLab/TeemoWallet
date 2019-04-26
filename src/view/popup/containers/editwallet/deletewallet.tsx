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
import Input from '../../../components/Input';
import { bg } from '../../utils/storagetools';
import { RouteComponentProps } from 'react-router';

interface IProps extends RouteComponentProps
{
	onClose?: () => void
}

@observer
export default class DeleteWallet extends React.Component<IProps, any>
{
	public state = {
		showDeleteStep: 0,
		confrimName:'',
		password:''
	}
	// 下一步
	public onGoNextStep = () =>
	{
		this.setState({
			showDeleteStep: 1
		})
	}
	public onDeleteWallet = () =>{
		if(this.state.confrimName==common.account.lable)
		{
			bg.AccountManager.verifyCurrentAccount(common.account.address,this.state.password)
			.then(result=>{
				if(result)
				{
					bg.AccountManager.deleteCurrentAccount()
					this.props.history.push('/login');
					Toast('钱包删除成功');
				}
				else
				{
					this.setState({confrimName:'',password:''})
					Toast('密码错误','error');
				}
			});			
		}
		else
		{
			Toast('账户名错误','error');
			this.setState({confrimName:'',password:''})
		}
	}
	public onHide=()=>{
		this.setState({
			showDeleteStep:0
		})
		this.props.onClose?this.props.onClose():null;
	}

	public onNameChange = (event:any)=>{
		this.setState({confrimName:event.target.value})
	}

	public onPwdChange = (event:any) =>{
		this.setState({password:event.target.value})
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
									<input type="text" className="delete-input" placeholder="输入你要删除的钱包名称以确认" onChange={this.onNameChange} value={this.state.confrimName} />
									{/* <Input type="text" placeholder="输入你要删除的钱包名称以确认"  onChange={this.onNameChange} value={this.state.confrimName} /> */}
								</div>
								<div className="input-wrap last-input">
									<input type="password" className="delete-input" placeholder="输入钱包密码" onChange={this.onPwdChange} value={this.state.password} />
								</div>
								<div className="step-btn step2-btn">
									<Button type="warn" text="取消" onClick={this.onHide} />
									<Button type="primary" text="确定" onClick={this.onDeleteWallet} />
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