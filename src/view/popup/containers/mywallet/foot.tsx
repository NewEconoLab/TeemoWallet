// 输入框组件
import * as React from 'react';
import Select, { IOption } from '../../../components/Select';
import common from '../../store/common';
import { NetWork } from '../../store/interface/common.interface';
import { observer } from 'mobx-react';
import intl, { Language } from '../../store/intl';
import { ICON } from '../../../image';
import EventHandler from '../../utils/event';

@observer
export default class WalletFoot extends React.Component<any, {}> {
	constructor(props: any) {
		super(props);
	}

	public state = {
		currentNetWork: { id: NetWork.TestNet, name: intl.message.mywallet.testnet },
		isShowLanguage: false,
	}

	componentDidMount() {
		common.initNetWork();
		if (common.network == NetWork.TestNet)
			this.setState({ currentNetWork: { id: NetWork.TestNet, name: intl.message.mywallet.testnet } })
		else
			this.setState({ currentNetWork: { id: NetWork.MainNet, name: intl.message.mywallet.mainnet } })

		// 注册全局点击事件，以便点击其他区域时，隐藏展开的内容
		EventHandler.add(this.globalClick);
	}

	// 全局点击
	public globalClick = () => {
		// console.log("全局点击事件");
		// console.log(this.state.isShowLanguage);

		if (this.state.isShowLanguage)
			this.setState({ isShowLanguage: false });
	}

	public onSelect = (option: IOption) => {
		let network = option.id as NetWork;
		common.changeNetWork(network);
		if (network == NetWork.TestNet)
			this.setState({ currentNetWork: { id: NetWork.TestNet, name: intl.message.mywallet.testnet } })
		else
			this.setState({ currentNetWork: { id: NetWork.MainNet, name: intl.message.mywallet.mainnet } })
	}

	// 是否显示语言
	public toggleLanguage = (e) => {
		this.setState({
			isShowLanguage: !this.state.isShowLanguage,
			isShowOther: false
		})
		e.stopPropagation();
	}
	// 切换英文
	public onClickEnglish = () => {
		intl.changeLanguage(Language.EN)
	}
	// 切换中文
	public onClickChinese = () => {
		intl.changeLanguage(Language.CN)
	}

	public options: IOption[] =
		[
			// {id:NetWork.MainNet,name:intl.message.mywallet.mainnet},
			{ id: NetWork.TestNet, name: intl.message.mywallet.testnet },
		]

	public render() {
		const options: IOption[] =
			[
				// { id: NetWork.MainNet, name: intl.message.mywallet.mainnet },
				{ id: NetWork.TestNet, name: intl.message.mywallet.testnet },
			]
		const current = options.find(option => option.id == this.state.currentNetWork.id);
		return (
			<div className="foot">
				<div className="content">
					<Select currentOption={current} options={options} onCallback={this.onSelect} text={intl.message.mywallet.currentnet} up={true} />
				</div>
				<div className="language-toggle" id="language">
					<label onClick={this.toggleLanguage}>
						<div className="language-content">
							<span className="lang-text">{intl.currentLang}</span>
							<img src={intl.currentLang == Language.CN ? ICON.cn : ICON.en} alt="ch.png" />
						</div>
						<span className="middle-line" />
						<div className="triangle-wrap">
							<div className="triangle" />
						</div>
					</label>
					{
						this.state.isShowLanguage &&
						<div className="select-wrap" id="selectlang" onClick={this.toggleLanguage}>
							<ul>
								<li><a onClick={this.onClickChinese}>中文</a></li>
								<li><a onClick={this.onClickEnglish}>English</a></li>
							</ul>
						</div>
					}
				</div>
			</div>
		);
	}
}