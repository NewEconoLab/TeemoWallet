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
import { RouteComponentProps } from 'react-router';
import intl from '../../store/intl';

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
					Toast(intl.message.editwallet.msg17);
				}
				else
				{
					this.setState({confrimName:'',password:''})
					Toast(intl.message.login.error,'error');
				}
			});			
		}
		else
		{
			Toast(intl.message.editwallet.msg18,'error');
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
								<p className="normal-tips">{intl.message.editwallet.msg12}</p>								
								<p className="normal-tips red-tips">{intl.message.editwallet.msg13}</p>
								<p className="normal-tips last-tips">{intl.message.editwallet.msg14}</p>
								<div className="step-btn">
									<Button type="warn" text={intl.message.button.cancel} onClick={this.onHide} />
									<Button type="primary" text={intl.message.button.confirm} onClick={this.onGoNextStep} />
								</div>
							</div>
						)
					}
					{
						this.state.showDeleteStep === 1 && (
							<div className="step-box">
								<div className="input-wrap">
									<input type="text" className="delete-input" placeholder={intl.message.editwallet.msg15} onChange={this.onNameChange} value={this.state.confrimName} />
								</div>
								<div className="input-wrap last-input">
									<input type="password" className="delete-input" placeholder={intl.message.editwallet.msg16} onChange={this.onPwdChange} value={this.state.password} />
								</div>
								<div className="step-btn step2-btn">
									<Button type="warn" text={intl.message.button.cancel} onClick={this.onHide} />
									<Button type="primary" text={intl.message.button.confirm} onClick={this.onDeleteWallet} />
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