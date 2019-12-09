// 输入框组件
import * as React from 'react';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { observer } from 'mobx-react';
import { AccountInfo, NepAccount } from '../../../../common/entity';
import { Storage_local, bg } from '../../utils/storagetools';
import common from '../../store/common';
import intl from '../../store/intl';

interface IState {
    walletname: string,
    walletname_error: boolean,
    moudle_download: boolean,
    download_href: string,
    download_name: string,
    password: string,
    passwordconfirm: string,
    passwordconfirm_error: boolean,
    password_error: boolean,
    wif: string,
    account: AccountInfo
}

interface IPorps {
    goBack: () => void;
    goMyWallet: () => void;
}

@observer
export default class WalletCreate extends React.Component<IPorps, IState> {
    constructor(props: any) {
        super(props);
    }

    public wallet: ThinNeo.nep6wallet = new ThinNeo.nep6wallet();

    public state: IState = {
        walletname_error: false,
        moudle_download: false,
        password_error: false,
        passwordconfirm_error: false,
        download_href: "",
        download_name: "",
        walletname: "",
        password: "",
        passwordconfirm: "",
        wif: "",
        account: null
    }

    public passwordChange = (event: string) => {
        this.setState({
            password: event,
            password_error: (event.length < 8)
        })
    }

    public password2Change = (event) => {
        this.setState({
            passwordconfirm: event,
            passwordconfirm_error: this.state.password != event
        })
    }

    public walletNameChange = (event: string) => {
        const clength = event.match(/[\u4E00-\u9FA5]/g) ? event.match(/[\u4E00-\u9FA5]/g).length : 0;
        const elength = event.match(/[a-zA-Z0-9]/g) ? event.match(/[a-zA-Z0-9]/g).length : 0;
        this.setState({
            walletname: event,
            walletname_error: (clength * 2 + elength) > 15
        })
    }

    goBack = () => {
        if (this.props.goBack)
            this.props.goBack();
    }

    goMyWallet = () => {
        const account = Storage_local.setAccount(this.state.account);
        bg.AccountManager.setAccount(this.state.account);
        common.initAccountInfo();
        if (this.props.goMyWallet)
            this.props.goMyWallet();
    }

    createWallet = () => {
        var array = new Uint8Array(32);
        var key = Neo.Cryptography.RandomNumberGenerator.getRandomValues<Uint8Array>(array);
        // spanPri.textContent = key.toHexString();
        var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(key);
        var addr = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);

        this.wallet.scrypt = new ThinNeo.nep6ScryptParameters();
        this.wallet.scrypt.N = 16384;
        this.wallet.scrypt.r = 8;
        this.wallet.scrypt.p = 8;
        this.wallet.accounts = [];
        this.wallet.accounts[ 0 ] = new ThinNeo.nep6account();
        this.wallet.accounts[ 0 ].address = addr;
        ThinNeo.Helper.GetNep2FromPrivateKey(key, this.state.password, this.wallet.scrypt.N, this.wallet.scrypt.r, this.wallet.scrypt.p, (info, result) => {
            console.log(info);
            console.log(result);

            if (info == "finish") {
                this.wallet.accounts[ 0 ].nep2key = result;
                this.wallet.accounts[ 0 ].contract = new ThinNeo.contract();
                var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(key);
                this.wallet.accounts[ 0 ].contract.script = ThinNeo.Helper.GetAddressCheckScriptFromPublicKey(pubkey).toHexString();
                var jsonstr = JSON.stringify(this.wallet.toJson());
                var blob = new Blob([ ThinNeo.Helper.String2Bytes(jsonstr) ]);
                const wif = ThinNeo.Helper.GetWifFromPrivateKey(key);
                this.setState({
                    download_name: this.state.walletname + ".json"
                })
                this.setState({
                    download_href: URL.createObjectURL(blob)
                });
                this.setState({
                    wif: wif
                });
                this.setState({
                    moudle_download: true
                });
                const account: AccountInfo = new AccountInfo(
                    new NepAccount(
                        this.state.walletname,
                        this.wallet.accounts[ 0 ].address,
                        this.wallet.accounts[ 0 ].nep2key,
                        this.wallet.scrypt,
                    ),
                    key,
                    pubkey,
                )
                this.setState({ account })
            }
        });
    }

    public render() {
        const disable =
            (this.state.password_error || this.state.walletname_error || this.state.passwordconfirm_error) ||
            (this.state.walletname == "" || this.state.password == "" || this.state.passwordconfirm == "");
        return (
            <>
                {!this.state.moudle_download ?
                    <div className="form">
                        <div className="form-content">
                            <div className="first">
                                <Input type="text" placeholder={intl.message.walletnew.create.createName}
                                    value={this.state.walletname}
                                    onChange={this.walletNameChange}
                                    error={this.state.walletname_error}
                                    message={this.state.walletname_error ? intl.message.walletnew.create.error1 : ""}
                                />
                            </div>
                            <div className="input">
                                <Input type="password" placeholder={intl.message.walletnew.create.setPassword}
                                    value={this.state.password}
                                    onChange={this.passwordChange}
                                    error={this.state.password_error}
                                    message={this.state.password_error ? intl.message.walletnew.create.error2 : ""}
                                />
                            </div>
                            <div className="input">
                                <Input type="password" placeholder={intl.message.walletnew.create.confirmPassword}
                                    value={this.state.passwordconfirm}
                                    onChange={this.password2Change}
                                    error={this.state.passwordconfirm_error}
                                    message={this.state.passwordconfirm_error ? intl.message.walletnew.create.error3 : ""}
                                    onEnter={disable ? undefined : this.createWallet}
                                />
                            </div>
                            <div className="create-btn-list">
                                <div className="btn-first">
                                    <Button type='warn' size='small-big' text={intl.message.button.cancel} onClick={this.goBack} />
                                </div>
                                <div>
                                    <Button type='primary' size='small-big' text={intl.message.button.confirm} onClick={this.createWallet} disabled={disable} />
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="form">
                        <div className="form-content">
                            <div className="form-line">
                                <div className="line-title">{intl.message.walletnew.create.successfully}</div>
                                {intl.message.walletnew.create.goWallet}
                            </div>
                            <div className="form-line">
                                <div className="line-title">
                                    {intl.message.walletnew.create.prikey}
                                </div>
                                <div className="prikey">{this.state.wif}</div>
                            </div>
                            <div className="form-line">
                                <a href={this.state.download_href} download={this.state.download_name}>
                                    <Button text={intl.message.walletnew.create.download} size="long" onClick={this.goMyWallet} />
                                </a>
                            </div>
                        </div>
                    </div>
                }
            </>
        )
    }
}