/**
 * 主页布局
 */
import * as React from 'react';
import Header from '../header';
import Footer from '../footer';
import ContractRequest from '../contract'
import './index.less';
import Provider from '../provider';
import { Command } from '../../../../common/entity';
import Login from '../login';
import { Background } from '../../../../lib/background';
import SendRequest from '../send';
import DeployRequest from '../deploy';
import SendScriptRequest from '../scripthex';
import { ICON } from '../../../image';
import common from '../../store/common';
import { observer } from 'mobx-react';
import intl from '../../../popup/store/intl';
@observer
export default class Home extends React.Component<any, any> {

  public state = {
    label: "",
    header: { title: "", domain: "", icon: "" },
    account: { address: "", walletName: "" },
    data: null,
    login: false,
    notifyID: "",
    error: false,
  }

  public componentDidMount() {
    if (chrome.tabs) {
      const bg = chrome.extension.getBackgroundPage() as Background;
      const account = bg.AccountManager.getCurrentAccount();
      if (account) {
        const account2 = { address: account.address, label: account.walletName }
        this.setState({ account: account2, login: true });
      }
      else {
        this.setState({
          login: false
        })
      }

      const title = this.getQueryVariable("title");
      const label = this.getQueryVariable("label");
      const domain = this.getQueryVariable("domain");
      const mark = this.getQueryVariable('mark');
      const icon = this.getQueryVariable('icon');
      if (mark) {
        this.setState({ notifyID: mark, label, header: { title, domain, icon } })
      }
      // alert(title);
      // alert(this.getQueryVariable("label"));
      window.opener.addEventListener("message", e => {
        const response = e.data;
        if (response.notifyID && response.notifyID === mark && response.notifyData) {
          this.setState({ data: response.notifyData }, () => {
            // alert(JSON.stringify(this.state.data)) 
          })
        }
      })
      window.opener.postMessage({ notifyID: mark, state: "getData" }, "*")
    }
  }

  public onCancel = () => {
    window.opener.postMessage({ notifyID: this.state.notifyID, state: "cancel" }, "*")
    // chrome.storage.local.set({ confirm: "cancel" }, () => {
    //   window.opener = null;
    //   window.open('', '_self');
    //   window.close();
    // });
  }

  public onConfirm = () => {
    window.opener.postMessage({ notifyID: this.state.notifyID, state: "confirm" }, "*")
    // const input = window.opener.document.getElementById("notifyMessage") as HTMLInputElement;
    // input.value = "onConfirm"
    // chrome.storage.local.set({ confirm: "confirm" }, () => {
    //   window.opener = null;
    //   window.open('', '_self');
    //   window.close();
    // });
  }

  public goHome = (account: { address: string, label: string }) => {
    this.setState({
      account,
      login: true
    })
  }

  public getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[ i ].split("=");
      if (pair[ 0 ] == variable) { return decodeURI(pair[ 1 ]); }
    }
    return "";
  }

  public toError = () => {
    this.setState({ error: true })
  }

  public render() {
    return (
      <>
        {this.state.login ?
          <div className="notify-page">
            <Header address={this.state.account.address} {...this.props} />
            <div className="notify-box">
              <div className="notify-content">
                {
                  this.state.label == Command.getAccount &&
                  <Provider title={this.state.header.title} domain={this.state.header.domain} icon={this.state.header.icon} />
                }
                {
                  (this.state.label == Command.invoke || this.state.label == Command.invokeGroup) &&
                  <ContractRequest title={this.state.header.title} domain={this.state.header.domain} address={this.state.account.address} data={this.state.data} {...this.props} />
                }
                {
                  this.state.label == Command.send &&
                  <SendRequest title={this.state.header.title} domain={this.state.header.domain} address={this.state.account.address} data={this.state.data} {...this.props} />
                }
                {
                  this.state.label == Command.deployContract &&
                  <DeployRequest title={this.state.header.title} domain={this.state.header.domain} address={this.state.account.address} data={this.state.data} {...this.props} />
                }
                {
                  this.state.label == Command.sendScript &&
                  <SendScriptRequest title={this.state.header.title} domain={this.state.header.domain} address={this.state.account.address} data={this.state.data} {...this.props} />
                }
              </div>
              <Footer onCancel={this.onCancel} onConfirm={this.onConfirm} disable={common.error} />
              {
                this.state.label !== Command.getAccount && !this.state.data &&
                <div className="loading-model">
                  <div className="loading-box">
                    <div className="loading-icon">
                      <img src={ICON.loading} />
                    </div>
                    <div className="loading-text">{intl.message.notify.processing}</div>
                  </div>
                </div>
              }
            </div>
          </div> :
          <Login goHome={this.goHome} />
        }
      </>
    );
  }
}

// export default injectIntl(Home);
