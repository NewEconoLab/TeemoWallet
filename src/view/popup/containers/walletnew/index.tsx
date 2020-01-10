import * as React from 'react';
import './index.less';
import { RouteComponentProps } from 'react-router-dom';
import Label from '../../../components/Label';
import { IOption } from '../../../components/Select';
import WalletCreate from './create';
import WalletImport from './load';
import common from '../../store/common';
import { observer } from 'mobx-react';
import intl, { Language } from '../../store/intl';
import { ICON } from '../../../image';

interface AppProps extends RouteComponentProps {
    develop: boolean;
}

interface AppState {
    develop: boolean;
}

@observer
export default class Login extends React.Component<AppProps> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
    }

    public options: IOption[] =
        [
            { id: "nep6", name: intl.message.walletnew.option_nep6 },
            { id: "nep2", name: intl.message.walletnew.option_nep2 },
            { id: "wif", name: intl.message.walletnew.option_wif },
        ]

    public state =
        {
            currentOption: this.options[ 0 ],
            currentLable: "import",
            isShowLanguage: false,
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
    public componentDidMount() {
        // Example of how to send a message to eventPage.ts.
    }

    goBack = () => {
        this.props.history.push('/login')
    }

    getCreateLable = () => {
        common.selectLabel('create');
        // this.setState({currentLable:"create"});
    }
    getImoprtLable = () => {
        common.selectLabel('import');
        // this.setState({currentLable:"import"});
    }

    goMyWallet = () => {
        common.initAccountInfo();
        this.props.history.push("mywallet")
    }

    render() {
        return (
            <div className="loginContainer">
                <div className="titleBackground">
                    <div className="title">{intl.message.walletnew.newWallet}</div>
                    <img className="teemo-bg" src={require("../../../image/owl.png")} alt="" />

                </div>
                <div className="content">
                    <div className="form-label">
                        <Label text={intl.message.walletnew.createWallet} active={common.walletnew_label === "create"} onClick={this.getCreateLable} />
                        <Label text={intl.message.walletnew.importWallet} active={common.walletnew_label === "import"} onClick={this.getImoprtLable} />
                    </div>
                    {common.walletnew_label === "create" ?
                        <WalletCreate goBack={this.goBack} goMyWallet={this.goMyWallet} /> :
                        <WalletImport goMyWallet={this.goMyWallet} goBack={this.goBack} />}
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
        )
    }
}
