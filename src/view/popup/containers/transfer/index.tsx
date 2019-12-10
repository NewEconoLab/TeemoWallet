/**
 * 按钮组件
 */
import * as React from 'react';
// import { observer } from 'mobx-react';
import './index.less';
import Select, { IOption } from '../../../components/Select';
import Input from '../../../components/Input';
// import Checkbox from '../../../components/Checkbox';
import Button from '../../../components/Button';
import { bg } from '../../utils/storagetools';
import common from '../../store/common';
import { NNSTool } from '../../utils/nnstool';
import { neotools } from '../../../notify/utils/neotools';
import { asNumber } from '../../utils/numberTool';
// import { HASH_CONFIG } from '../../../config';
import Toast from '../../../components/Toast';
import { observer } from 'mobx-react';
import intl from '../../store/intl';
import manageStore from '../manage/store/manage.store';
import { HASH_CONFIG } from '../../../config';
// import Radio from '../../../components/Radio';

interface IProps {
	lableChange: (table: string) => void
	asset: string,
}

interface IState {
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
	resolverMessage: string;
	amountMessage: string,
	currentOption: IOption,
	toAddress: string,
	domain: string,
	confirmDisable: boolean,
	available: string;
	balance: number;
	gas: number;
	radioKey: string;
	currentasset: AssetInfo;
}

@observer
export default class Transfer extends React.Component<IProps, IState>
{
	constructor(props: IProps) {
		super(props);
	}
	public state: IState = {
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
		resolverMessage: '',
		currentOption: undefined,
		// options:[],
		toAddress: '',
		domain: '',
		available: '',
		radioKey: 'normal',
		balance: 0,
		gas: 0,
		currentasset: { "assetid": "", "name": "", "decimals": 0, "symbol": "", "type": "nep5" },
	}

	componentDidMount() {
		if (this.props.asset != '') {
			const currentasset = manageStore.myAssets.find(option => option.assetid == this.props.asset)
			let balance = common.balances.find(asset => asset.assetID === currentasset.assetid).amount;
			common.getBalanceByAsset(HASH_CONFIG.ID_GAS).then(value => {
				this.setState({ gas: parseFloat(value.amount) })
			}).catch(err => {
				this.setState({ gas: 0 })
			})
			// let gas = common.balances.find(asset => asset.assetID === HASH_CONFIG.ID_GAS).amount;
			this.setState({
				currentOption: { id: currentasset.assetid, name: currentasset.symbol },
				available: `${balance} ${currentasset.symbol}`,
				balance: parseFloat(balance),
				currentasset,
				// gas: parseFloat(gas)
			})
		}
		else {
			const balance = common.balances.find(asset => asset.assetID === manageStore.myAssets[ 0 ].assetid).amount;
			// let gas = common.balances.find(asset => asset.assetID === HASH_CONFIG.ID_GAS).amount;
			this.setState({
				currentOption: { id: manageStore.myAssets[ 0 ].assetid, name: manageStore.myAssets[ 0 ].symbol },
				available: `${balance} ${manageStore.myAssets[ 0 ].symbol}`,
				balance: parseFloat(balance),
				currentasset: manageStore.myAssets[ 0 ],
				// gas: parseFloat(gas)
			})
			common.getBalanceByAsset(HASH_CONFIG.ID_GAS).then(value => {
				this.setState({ gas: parseFloat(value.amount) })
			}).catch(err => {
				this.setState({ gas: 0 })
			})
		}
	}
	public onSelect = (currentOption: IOption) => {
		const balance = parseFloat(common.balances.find(asset => asset.assetID === currentOption.id).amount);
		// let gas = parseFloat(common.balances.find(asset => asset.assetID === HASH_CONFIG.ID_GAS).amount);
		const currentasset = manageStore.myAssets.find(option => option.assetid == currentOption.id);
		const available = `${common.balances.find(asset => asset.assetID === currentOption.id).amount} ${currentOption.name}`
		this.setState({
			currentOption, available, balance, currentasset
		}, () => {
			this.onAmountChange(this.state.amount)
		})
		common.getBalanceByAsset(HASH_CONFIG.ID_GAS).then(value => {
			this.setState({ gas: parseFloat(value.amount) })
		}).catch(err => {
			this.setState({ gas: 0 })
		})
	}
	// 监控输入内容
	public onAddrChange = async (event) => {
		let errorAddr = false;
		let resolverMessage, addrMessage, toAddress, domain = "";
		let address = event;
		this.setState({ address })
		if (event == '') {
			this.setState({ errorAddr, addrMessage, domain, toAddress, resolverMessage })
		}
		else if (NNSTool.verifyDomain(event)) {
			try {
				const addr = await NNSTool.resolveData(event)
				if (!addr) {
					errorAddr = true;
					addrMessage = intl.message.transfer.error2
				}
				else {
					errorAddr = false;
					// addrMessage = toAddress = addr;
					resolverMessage = toAddress = addr;
					domain = event;
				}
				this.setState({ errorAddr, addrMessage, domain, toAddress, resolverMessage }, () => {
					this.onVerify();
				})
			}
			catch (error) {
				errorAddr = true;
				addrMessage = intl.message.transfer.error2
				this.setState({ errorAddr, addrMessage, domain, toAddress, resolverMessage }, () => {
					this.onVerify();
				})
			}
		}
		else if (neotools.verifyAddress(event)) {
			errorAddr = false;
			toAddress = event;
			this.setState({ errorAddr, addrMessage, domain, toAddress, resolverMessage }, () => {
				this.onVerify();
			})
			try {
				const domainInfo = await bg.getDomainFromAddress({ address: event, network: common.network });
				if (domainInfo.fullDomainName != '') {
					resolverMessage = domainInfo.fullDomainName;
				}
				// console.log('状态1',{ errorAddr, addrMessage, domain, toAddress,resolverMessage });
				this.setState({ errorAddr, addrMessage, domain, toAddress, resolverMessage }, () => {
					this.onVerify();
				})
			} catch (error) {

			}
		}
		else {
			errorAddr = true;
			addrMessage = intl.message.transfer.error1
			this.setState({ errorAddr, addrMessage, domain, toAddress, resolverMessage }, () => {
				this.onVerify();
			})
		}
	}

	public onVerify = () => {
		this.setState({
			verifyPass: (!this.state.errorAddr) && (!this.state.errorAmount) && (!!this.state.amount) && (!!this.state.address)
		})
	}

	// 监控输入内容
	public onAmountChange = (event) => {
		const amount = asNumber(event, 8)
		let checkDisable = false;
		let errorAmount = false;
		let amountMessage = "";
		if (this.state.currentasset.assetid === HASH_CONFIG.ID_GAS) {
			const balance = Neo.Fixed8.parse(common.balances.find(asset => this.state.currentOption.id == asset.assetID).amount.toString())
			const compare = Neo.Fixed8.parse(amount).compareTo(balance.subtract(Neo.Fixed8.parse(this.state.radioKey === "normal" ? "1.0127" : "1.0137")))
			if (compare > 0) {
				errorAmount = true;
				amountMessage = intl.message.exchange.noBalance;
			}
			else if (compare == 0) {
				errorAmount = false;
				amountMessage = '';
				checkDisable = true;
			}
		}
		else {
			const gasbalance = Neo.Fixed8.fromNumber(this.state.gas);
			const balance = Neo.Fixed8.parse(common.balances.find(asset => this.state.currentOption.id == asset.assetID).amount.toString())
			const compare = Neo.Fixed8.parse(amount).compareTo(balance)
			const compareGas = Neo.Fixed8.parse(this.state.radioKey === "normal" ? "1.0127" : "1.0137").compareTo(gasbalance);
			if (compare > 0 || compareGas > 0) {
				errorAmount = true;
				amountMessage = intl.message.exchange.noBalance;
			}
			else if (compare == 0) {
				errorAmount = false;
				amountMessage = '';
				checkDisable = true;
			}
		}
		this.setState({ amount, errorAmount, amountMessage, checkDisable }, () => {
			this.onVerify()
		})
	}
	public showInfo = () => {
		// this.props.onHide();
		this.setState({
			infoShow: true
		})
	}
	public closeInfo = () => {
		this.setState({
			infoShow: false
		})
	}
	public onHide = () => {
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
			currentOption: { id: '', name: '' },
			toAddress: '',
			domain: '',
			confirmDisable: false
		})
		if (this.props.lableChange) {
			this.props.lableChange("history");
		}
	}
	public onCancel = () => {
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
			currentOption: { id: '', name: '' },
			toAddress: '',
			domain: '',
			confirmDisable: false
		})
		if (this.props.lableChange) {
			this.props.lableChange("assets");
		}
	}

	public onCheck = (event: boolean) => {
		this.setState({
			netfee: event
		})
	}
	public send = () => {
		// console.log(this.state.currentOption.id);
		this.setState({
			confirmDisable: true
		})
		bg.transfer({
			"amount": this.state.amount,
			"asset": this.state.currentOption.id,
			"fromAddress": common.account.address,
			"toAddress": this.state.toAddress,
			"networkFee": this.state.radioKey === "normal" ? "0.0127" : "0.0137",
			"systemFee": "1",
			"network": "TestNet"
		})
			.then(result => {
				Toast(intl.message.toast.successfully);
				// console.log(result);
				this.onHide();
			})
			.catch(error => {
				if (error.description == "TX size is over 1024byte") {
					Toast(intl.message.toast.txFailed, "error");
				}
				else {
					Toast(intl.message.toast.failed, "error");
				}
				// console.log(error);
				this.onHide();
			})
	}

	public radioChange = (key: string) => {
		console.log(key);

		this.setState({ radioKey: key });
	}

	public render() {
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
									<div className="content">{this.state.radioKey === "normal" ? "1.0127 GAS" : "1.0137 GAS"}</div>
								</div>
							</div>
							<div className="btn-list">
								<div className="cancel">
									<Button type="warn" text={intl.message.button.cancel} onClick={this.onCancel} />
								</div>
								<div className="confrim">
									<Button type="primary" text={intl.message.button.confirm} onClick={this.send} disabled={this.state.confirmDisable} />
								</div>
							</div>
						</div>
						:
						<>
							<div className="line">
								<Select
									currentOption={this.state.currentOption}
									defaultValue={this.props.asset}
									options={
										manageStore.myAssets ? manageStore.myAssets.map(asset => { return { id: asset.assetid, name: asset.symbol } }) :
											[]
									}
									onCallback={this.onSelect}
									text={intl.message.mywallet.assets}
								/>
							</div>
							<div className="line">
								<Input
									placeholder={intl.message.transfer.sendTo}
									value={this.state.address} onChange={this.onAddrChange}
									type="text" error={this.state.errorAddr} message={this.state.addrMessage} />
								{
									!!this.state.resolverMessage &&
									<p className="tip-check">
										<img className="trans-icon" src={require("../../../image/transfer.png")} alt="" />
										<span className="trans-text">{this.state.resolverMessage}</span>
									</p>
								}
							</div>
							<div className="line line-big">
								<Input
									placeholder={`${intl.message.transfer.amount} （${
										this.state.currentasset.assetid === HASH_CONFIG.ID_GAS ?
											`${Neo.Fixed8.fromNumber(this.state.balance)
												.subtract(
													Neo.Fixed8.fromNumber(this.state.radioKey === 'normal' ? 1.0127 : 1.0137)).toString()
											} ${this.state.currentasset.name}` :
											`${this.state.balance} ${this.state.currentasset.name}, ${Neo.Fixed8.fromNumber(this.state.gas).toString()} GAS`
										}） ${intl.message.transfer.available}`}
									value={this.state.amount}
									onChange={this.onAmountChange} type="text"
									error={this.state.errorAmount} message={this.state.amountMessage} />
							</div>
							<div className="line">
								{/* <Checkbox text={intl.message.transfer.payfee} onClick={this.onCheck} disabled={this.state.checkDisable} /> */}
								{/* <Radio options={[ { label: '普通', value: '1' }, { label: '快', value: '2' } ]} /> */}
								<div className="radio-group">
									<div className={`radio button ${this.state.radioKey === 'normal' ? 'active' : ''}`} onClick={this.radioChange.bind(this, 'normal')}>
										<div className="title">普通</div><div className="value">1.0127 GAS</div>
									</div>
									<div className={`radio button ${this.state.radioKey === 'fast' ? 'active' : ''}`} onClick={this.radioChange.bind(this, 'fast')}>
										<div className="title">快</div><div className="value">1.0137 GAS</div>
									</div>
								</div>
							</div>
							<div className="btn-list">
								<div className="cancel">
									<Button type="warn" text={intl.message.button.cancel} onClick={this.onCancel} />
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