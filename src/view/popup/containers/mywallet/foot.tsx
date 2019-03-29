// 输入框组件
import * as React from 'react';
import Select, { IOption } from '../../../components/Select';
import common from '../../store/common';
import { NetWork } from '../../store/interface/common.interface';
import { observer } from 'mobx-react';
import intl, { Language } from '../../store/intl';
import { ICON } from '../../../image';

@observer
export default class WalletFoot extends React.Component<any, {}> {
	constructor(props: any) {
		super(props);
	}

	public state={
		currentNetWork:undefined,
		isShowLanguage: false,
		languageText: intl.currentLang === Language.EN ? "En" : "中",
		languageImg: intl.currentLang === Language.EN ? ICON.en : ICON.cn,
	}

	componentDidMount(){
		common.initNetWork();
		if(common.network==NetWork.TestNet)
			this.setState({currentNetWork:{id:NetWork.TestNet,name:intl.message.mywallet.testnet}})
		else
			this.setState({currentNetWork:{id:NetWork.MainNet,name:intl.message.mywallet.mainnet}})
	}
	
	public onSelect=(option:IOption)=>{
		let network = option.id as NetWork;		
		common.changeNetWork(network);
		if(network==NetWork.TestNet)
			this.setState({currentNetWork:{id:NetWork.TestNet,name:intl.message.mywallet.testnet}})
		else
			this.setState({currentNetWork:{id:NetWork.MainNet,name:intl.message.mywallet.mainnet}})
	}

	// 是否显示语言
	public toggleLanguage = () => {
	  this.setState({
			isShowLanguage: !this.state.isShowLanguage,
			isShowOther: false
	  })
	}
	// 切换英文
	public onClickEnglish = () => {
		intl.changeLanguage(Language.EN)
	}
	// 切换中文
	public onClickChinese = () => {
		intl.changeLanguage(Language.CN)
	}

    public options:IOption[]=
    [
        {id:NetWork.MainNet,name:intl.message.mywallet.mainnet},
        {id:NetWork.TestNet,name:intl.message.mywallet.testnet},
    ]

	public render() {
		return (
			<div className="foot">
				<div className="content">
					<Select currentOption={this.state.currentNetWork} options={this.options} onCallback={this.onSelect} text={intl.message.mywallet.currentnet} up={true} />
				</div>
				
                <div className="language-toggle" id="language">
                  <label onClick={this.toggleLanguage}>
                    <div className="language-content">
                      <span className="lang-text">{intl.currentLang==Language.CN?'中':'En'}</span>
                      <img src={intl.currentLang==Language.CN?ICON.cn:ICON.en} alt="ch.png" />
                    </div>
                    <span className="middle-line" />
                    <div className="triangle-wrap">
                      <div className="triangle" />
                    </div>
                  </label>
                  {
                    this.state.isShowLanguage && (
                      <div className="select-wrap" id="selectlang" onClick={this.toggleLanguage}>
                        <ul>
                          <li><a onClick={this.onClickChinese}>中文</a></li>
                          <li><a onClick={this.onClickEnglish}>English</a></li>
                        </ul>
                      </div>
                    )
                  }
                </div>
			</div>
		);
	}
}