/**
 * 按钮组件
 */
import * as React from 'react';
// import { observer } from 'mobx-react';
import './index.less';
import Modal from '../../../components/Modal';
import Select, { IOption } from '../../../components/Select';
import Input from '../../../components/Input';
import Checkbox from '../../../components/Checkbox';
import Button from '../../../components/Button';
import { bg } from '../../utils/storagetools';
import common from '../../store/common';
import { NNSTool } from '../../utils/nnstool';
import { neotools } from '../../../notify/utils/neotools';
import { asNumber } from '../../utils/numberTool';
import { HASH_CONFIG } from '../../../config';
import Toast from '../../../components/Toast';
import { observer } from 'mobx-react';
import intl from '../../store/intl';

interface IProps
{
	lableChange: (table: string) => void
	asset: string,
}

interface IState
{
	infoShow: boolean,
	address: string,
	amount: string,
	asset: string,
	netfee: boolean,
	errorAddr: boolean,
	errorAmount: boolean,
	verifyPass: boolean,
	checkDisable: boolean,
	addrMessage: string,
	resolverMessage:string;
	amountMessage: string,
	currentOption: IOption,
	toAddress: string,
	domain: string,
	confirmDisable: boolean,
}

@observer
export default class Transfer extends React.Component<IProps, IState>
{
	constructor(props: IProps)
	{
		super(props);
	}
	public state = {
		infoShow: false,
		address: "",
		amount: "",
		asset: "",
		netfee: false,
		errorAddr: false,
		errorAmount: false,
		verifyPass: false,
		checkDisable: false,
		confirmDisable: false,
		addrMessage: '',
		amountMessage: '',
		resolverMessage:'',
		currentOption: { id: HASH_CONFIG.ID_GAS, name: 'GAS' },
		toAddress: '',
		domain: '',
	}

	componentDidMount()
	{
		console.log(this.props.asset);

		if (this.props.asset != '')
		{
			console.log(this.props.asset);
			const current = this.options.find(option => option.id == this.props.asset);
			console.log(current);

			this.setState({
				currentOption: this.options.find(option => option.id == this.props.asset)
			})
		}
	}

	public options: IOption[] = [
		{ id: HASH_CONFIG.ID_GAS, name: 'GAS' },
		{ id: HASH_CONFIG.ID_CGAS.toString(), name: 'CGAS' },
		{ id: HASH_CONFIG.ID_NEO, name: 'NEO' },
		{ id: HASH_CONFIG.ID_NNC.toString(), name: 'NNC' }
	]
	public onSelect = (currentOption: IOption) =>
	{
		console.log(currentOption);

		this.setState(
			{
				currentOption
			}, () =>
			{
				this.onAmountChange(this.state.amount)
			}
		)
	}
	// 监控输入内容
	public onAddrChange = async (event) =>
	{
		let errorAddr = false;
		let resolverMessage,addrMessage, toAddress, domain = "";
		let address = event;
		this.setState({ address })
		if (NNSTool.verifyDomain(event))
		{
			try
			{
				const addr = await NNSTool.resolveData(event)
				if (!addr)
				{
					errorAddr = true;
					addrMessage = intl.message.transfer.error2
				} else
				{
					errorAddr = false;
					// addrMessage = toAddress = addr;
					resolverMessage = toAddress = addr;
					domain = event;
				}
			} catch (error)
			{
				errorAddr = true;
				addrMessage = intl.message.transfer.error2
			}
		}
		else if (neotools.verifyAddress(event))
		{
			errorAddr = false;
			toAddress = event;
			try {
				const domainInfo = await bg.getDomainFromAddress({address:event,network:common.network});
				// const currenttime = new Neo.BigInteger(new Date().getTime()).divide(1000);
				// console.log(domainInfo);
				// console.log(new Date().getTime());
				// console.log(currenttime.toString());
				// if(domainInfo.fullDomainName!='' && currenttime.compareTo(new Neo.BigInteger(domainInfo.TTL))<0)
				// {
				// 	resolverMessage=domainInfo.fullDomainName;
				// }
				
				if(domainInfo.fullDomainName!='')
				{
					resolverMessage=domainInfo.fullDomainName;
				}
			} catch (error) {
				
			}
		}
		else
		{
			errorAddr = true;
			addrMessage = intl.message.transfer.error1
		}
		this.setState({ errorAddr, addrMessage, domain, toAddress,resolverMessage }, () =>
		{
			this.onVerify();
		})
	}

	public onVerify = () =>
	{
		this.setState({
			verifyPass: (!this.state.errorAddr) && (!this.state.errorAmount) && (!!this.state.amount) && (!!this.state.address)
		})
	}

	// 监控输入内容
	public onAmountChange = (event) =>
	{
		const amount = asNumber(event, 8);
		const balance = Neo.Fixed8.fromNumber(common.balances[this.state.currentOption.name])
		let checkDisable = false;
		let errorAmount = false;
		let amountMessage = "";
		const compare = Neo.Fixed8.parse(amount).compareTo(balance)
		if (compare > 0)
		{
			errorAmount = true;
			amountMessage = intl.message.exchange.noBalance + " " + this.state.currentOption.name + ' ' + balance.toString();
		}
		else if (compare == 0)
		{
			errorAmount = false;
			amountMessage = '';
			checkDisable = true;
		}
		this.setState({ amount, errorAmount, amountMessage, checkDisable }, () =>
		{
			this.onVerify()
		})
	}
	public showInfo = () =>
	{
		// this.props.onHide();
		this.setState({
			infoShow: true
		})
	}
	public closeInfo = () =>
	{
		this.setState({
			infoShow: false
		})
	}
	public onHide = () =>
	{
		this.setState({
			infoShow: false,
			address: "",
			amount: "",
			asset: "",
			netfee: false,
			errorAddr: false,
			errorAmount: false,
			verifyPass: false,
			checkDisable: false,
			addrMessage: '',
			amountMessage: '',
			currentOption: { id: HASH_CONFIG.ID_GAS, name: 'GAS' },
			toAddress: '',
			domain: '',
			confirmDisable: false
		})
		if (this.props.lableChange)
		{
			this.props.lableChange('');
		}
	}
	public onCheck = (event: boolean) =>
	{
		this.setState({
			netfee: event
		})
	}
	public send = () =>
	{
		console.log(this.state.currentOption.id);
		this.setState({
			confirmDisable: true
		})
		bg.transfer({
			"amount": this.state.amount,
			"asset": this.state.currentOption.id,
			"fromAddress": common.account.address,
			"toAddress": this.state.toAddress,
			"fee": this.state.netfee ? "0.001" : "0",
			"network": "TestNet"
		})
		.then(result =>
		{
			Toast(intl.message.toast.successfully);
			console.log(result);
			this.onHide();
		})
		.catch(error =>
		{
			Toast(intl.message.toast.failed, "error");
			console.log(error);
			this.onHide();
		})
	}

	public render()
	{
		return (
			<div className="transfer-wrapper">
				{
					this.state.infoShow ?
						<div className="transfer-info">
							<h3>{intl.message.transfer.title}</h3>
							<div className="transfer-content">
								<div className="info-line first">
									<div className="title">{intl.message.transfer.title1}</div>
									<div className="content">
										<div className="double">{common.account.lable}</div>
										<div className="double address">{common.account.address}</div>
									</div>
								</div>
								<div className="info-line">
									<div className="title">{intl.message.transfer.title2}</div>
									<div className="content">{`${this.state.amount} ${this.state.currentOption.name}`}</div>
								</div>
								<div className="info-line">
									<div className="title">{intl.message.transfer.title3}</div>
									<div className="content">
										{
											this.state.domain ?
											<>
												<div className="double">{this.state.domain}</div>
												<div className="double address">{this.state.toAddress}</div>
											</> :
											<div className="single address">{this.state.toAddress}</div>
										}
									</div>
								</div>
								<div className="info-line">
									<div className="title">{intl.message.transfer.title4}</div>
									<div className="content">{this.state.netfee ? '0.001 GAS' : '0 GAS'}</div>
								</div>
							</div>
							<div className="btn-list">
								<div className="cancel">
									<Button type="warn" text={intl.message.button.cancel} onClick={this.onHide} />
								</div>
								<div className="confrim">
									<Button type="primary" text={intl.message.button.confirm} onClick={this.send} disabled={this.state.confirmDisable} />
								</div>
							</div>
						</div>
						:
						<>
							<div className="line">
								<Select currentOption={this.state.currentOption} defaultValue={this.props.asset} options={this.options} onCallback={this.onSelect} text={intl.message.mywallet.assets} />
							</div>
							<div className="line">
								<Input placeholder={intl.message.transfer.sendTo} value={this.state.address} onChange={this.onAddrChange} type="text" error={this.state.errorAddr} message={this.state.addrMessage} />
								{
								!!this.state.resolverMessage &&
								<p className="tip-check">
									<img className="trans-icon" src={require("../../../image/transfer.png")} alt=""/>
									<span className="trans-text">{this.state.resolverMessage}</span>
								</p>
								}
							</div>
							<div className="line line-big">
								<Input placeholder={intl.message.transfer.amount + "（90000 GAS可用）"} value={this.state.amount} onChange={this.onAmountChange} type="text" error={this.state.errorAmount} message={this.state.amountMessage} />
							</div>
							<div className="line">
								<Checkbox text={intl.message.transfer.payfee} onClick={this.onCheck} disabled={this.state.checkDisable} />
							</div>
							<div className="btn-list">
								<div className="cancel">
									<Button type="warn" text={intl.message.button.cancel} onClick={this.onHide} />
								</div>
								<div className="confrim">
									<Button type="primary" disabled={!this.state.verifyPass} text={intl.message.transfer.next} onClick={this.showInfo} />
								</div>
							</div>
						</>
				}
			</div>
		);
	}
}